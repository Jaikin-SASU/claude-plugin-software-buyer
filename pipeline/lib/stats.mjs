// Statistiques et planchers de publication (spec section 5.4).
// Le plancher n'empeche pas le calcul, il gouverne la publication.
export const PLANCHERS = {
  QUARTILES: 12,
  MEDIANE: 5,
  TENSION_GROUPE: 10,
  SURVIE_COHORTE: 50,
};

function propres(valeurs) {
  return valeurs.filter((v) => typeof v === 'number' && Number.isFinite(v)).sort((a, b) => a - b);
}

function rang(triees, p) {
  const h = (triees.length - 1) * p;
  const bas = Math.floor(h);
  const haut = Math.ceil(h);
  if (bas === haut) return triees[bas];
  return triees[bas] + (h - bas) * (triees[haut] - triees[bas]);
}

export function mediane(valeurs) {
  const t = propres(valeurs);
  return t.length ? rang(t, 0.5) : null;
}

// Valeur au percentile p ∈ [0, 1], même interpolation que les quartiles.
export function valeurAuPercentile(valeurs, p) {
  const t = propres(valeurs);
  if (!t.length || !Number.isFinite(p) || p < 0 || p > 1) return null;
  return rang(t, p);
}

// Rang d'un montant dans une série publiée. Hors min/max : pas de rang.
export function situerMontant(valeurs, montant) {
  const t = propres(valeurs);
  if (!t.length || !Number.isFinite(montant)) {
    return { statut: 'indetermine', n: t.length, min: null, max: null };
  }
  if (montant < t[0] || montant > t[t.length - 1]) {
    return { statut: 'hors-echelle', n: t.length, min: t[0], max: t[t.length - 1] };
  }
  const nInfOuEgal = t.filter((v) => v <= montant).length;
  return {
    statut: 'dans',
    n: t.length,
    nInfOuEgal,
    part: nInfOuEgal / t.length,
    min: t[0],
    max: t[t.length - 1],
  };
}

export function quartiles(valeurs) {
  const t = propres(valeurs);
  if (!t.length) return null;
  return { q1: rang(t, 0.25), q2: rang(t, 0.5), q3: rang(t, 0.75) };
}

export function niveauPublication(n) {
  if (n >= PLANCHERS.QUARTILES) return 'complete';
  if (n >= PLANCHERS.MEDIANE) return 'mediane';
  return 'aucune';
}

export function resume(valeurs) {
  const t = propres(valeurs);
  const n = t.length;
  const niveau = niveauPublication(n);
  if (niveau === 'aucune') {
    return { n, niveau, mediane: null, q1: null, q3: null, min: null, max: null };
  }
  const q = quartiles(t);
  const complet = niveau === 'complete';
  return {
    n,
    niveau,
    mediane: q.q2,
    q1: complet ? q.q1 : null,
    q3: complet ? q.q3 : null,
    min: complet ? t[0] : null,
    max: complet ? t[n - 1] : null,
  };
}

// Decoupage en classes pour les histogrammes (spec du 13/09, section 5).
// Echelle logarithmique par defaut : le corpus va de 1 000 EUR a 7 200 000 EUR,
// une echelle lineaire y ecraserait 95 % des marches dans la premiere classe.
// Les bornes hautes sont exclusives, sauf la derniere : le maximum appartient
// a la derniere classe, jamais a une classe n+1 fantome.
export function bins(valeurs, { n = 12, echelle = 'log' } = {}) {
  const log = echelle === 'log';
  // Reuse propres() pour validation et tri numerique ; echelle log rejette les valeurs <= 0
  // car log(0) et log(x<0) ne sont pas definis. En echelle lineaire, aucun rejet supplementaire.
  const t = propres(valeurs).filter((v) => !log || v > 0);
  if (!t.length || n < 1) return [];

  const min = t[0];
  const max = t[t.length - 1];
  if (min === max) return [{ min, max, effectif: t.length }];

  const f = log ? Math.log : (x) => x;
  const g = log ? Math.exp : (x) => x;
  const a = f(min);
  const b = f(max);
  const bornes = Array.from({ length: n + 1 }, (_, i) => g(a + ((b - a) * i) / n));
  const classes = bornes.slice(0, -1).map((borne, i) => ({ min: borne, max: bornes[i + 1], effectif: 0 }));

  for (const v of t) {
    const brut = Math.floor(((f(v) - a) / (b - a)) * n);
    const i = Math.min(Math.max(brut, 0), n - 1);
    classes[i].effectif += 1;
  }
  return classes;
}
