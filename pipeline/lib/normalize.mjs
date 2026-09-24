/**
 * Normalisation des marchés DECP / CSV vers un schéma unique.
 */

const NAMED_ENTITIES = {
  amp: '&',
  quot: '"',
  lt: '<',
  gt: '>',
  apos: "'",
  nbsp: ' ',
};

/**
 * Nettoie un libellé d'objet DECP (HTML, mojibake œ, U+FFFD, espaces).
 * @param {string|null|undefined} raw
 * @returns {string}
 */
export function cleanObject(raw) {
  if (raw == null) return '';
  let s = String(raw);

  s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCodePoint(Number.parseInt(hex, 16)),
  );
  s = s.replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)));
  s = s.replace(/&([a-zA-Z]+);/g, (match, name) => {
    const mapped = NAMED_ENTITIES[name.toLowerCase()];
    return mapped !== undefined ? mapped : match;
  });

  // Mojibake œ : uniquement le motif "?uvre" (pas tout "?"), et "oeuvre" ASCII.
  s = s.replace(/\?([uU][vV][rR][eE])/g, (_, rest) => {
    const upper = rest === rest.toUpperCase();
    return upper ? `Œ${rest}` : `œ${rest.toLowerCase()}`;
  });
  s = s.replace(/([oO])([eE])([uU][vV][rR][eE])/g, (_, o, e, rest) => {
    const upper = o === 'O' && e === 'E';
    return upper ? `Œ${rest}` : `œ${rest.toLowerCase()}`;
  });

  s = s.replace(/\uFFFD/g, '');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

/**
 * Département depuis un code postal ou un code département.
 * Corse : 200xx/201xx → 2A, 202xx/206xx (et autres 20*) → 2B.
 * @param {string|null|undefined} code
 * @returns {string|null}
 */
export function departmentFromPostal(code) {
  if (code == null) return null;
  const s = String(code).trim().toUpperCase();
  if (!s) return null;

  if (s === '2A' || s === '2B') return s;

  if (/^\d{2}$/.test(s)) return s;

  if (!/^\d{5}$/.test(s)) return null;

  const prefix = s.slice(0, 2);
  if (prefix === '20') {
    const third = s[2];
    if (third === '0' || third === '1') return '2A';
    return '2B';
  }
  return prefix;
}

/**
 * Parse le nombre d'offres reçues (string DECP).
 * @param {unknown} raw
 * @returns {number|null}
 */
export function parseOffersReceived(raw) {
  if (raw == null || raw === '') return null;
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? Math.trunc(raw) : null;
  }
  const s = String(raw).trim();
  if (!s || /^MQ\s*NC$/i.test(s) || /^NC$/i.test(s)) return null;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

function toNumber(v) {
  if (typeof v === 'number') return v;
  if (v == null || v === '') return Number.NaN;
  return Number(String(v).replace(/\s/g, '').replace(',', '.'));
}

function natureOf(raw) {
  if (raw == null || raw === '') return 'unknown';
  return String(raw).trim().toLowerCase() || 'unknown';
}

/**
 * @param {Record<string, unknown>} raw
 * @param {string} projectType
 */
export function normalizeMarket(raw, projectType) {
  // digital_twin CSV shape
  const isTwin =
    projectType === 'digital_twin' ||
    ('montant_eur' in raw && 'date_notification' in raw);

  if (isTwin) {
    return {
      id: String(raw.id ?? ''),
      project_type: projectType,
      object: cleanObject(raw.objet ?? raw.object ?? ''),
      amount_eur: toNumber(raw.montant_eur ?? raw.montant),
      duration_months: toNumber(raw.duree_mois ?? raw.dureemois),
      offers_received: parseOffersReceived(raw.offresrecues ?? raw.offers_received),
      cpv: raw.codecpv != null ? String(raw.codecpv) : raw.cpv != null ? String(raw.cpv) : null,
      notified_on: String(raw.date_notification ?? raw.datenotification ?? ''),
      buyer_siret: raw.acheteur_id != null ? String(raw.acheteur_id) : null,
      holder_siret: raw.titulaire_id_1 != null ? String(raw.titulaire_id_1) : null,
      department: departmentFromPostal(raw.lieuexecution_code),
      nature: natureOf(raw.nature),
      source_dataset: String(raw.source_dataset ?? raw._source ?? ''),
    };
  }

  return {
    id: String(raw.id ?? ''),
    project_type: projectType,
    object: cleanObject(raw.objet ?? ''),
    amount_eur: toNumber(raw.montant),
    duration_months: toNumber(raw.dureemois),
    offers_received: parseOffersReceived(raw.offresrecues),
    cpv: raw.codecpv != null ? String(raw.codecpv) : null,
    notified_on: String(raw.datenotification ?? ''),
    buyer_siret: raw.acheteur_id != null ? String(raw.acheteur_id) : null,
    holder_siret: raw.titulaire_id_1 != null ? String(raw.titulaire_id_1) : null,
    department: departmentFromPostal(raw.lieuexecution_code),
    nature: natureOf(raw.nature),
    source_dataset: String(raw._source ?? ''),
  };
}
