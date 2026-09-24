/** Port of pipeline/lib/stats.mjs — situerMontant and helpers. */

export function propres(valeurs: number[]): number[] {
  return valeurs
    .filter((v) => typeof v === "number" && Number.isFinite(v))
    .sort((a, b) => a - b);
}

function rang(triees: number[], p: number): number {
  const h = (triees.length - 1) * p;
  const bas = Math.floor(h);
  const haut = Math.ceil(h);
  const low = triees[bas]!;
  if (bas === haut) return low;
  const high = triees[haut]!;
  return low + (h - bas) * (high - low);
}

export function mediane(valeurs: number[]): number | null {
  const t = propres(valeurs);
  return t.length ? rang(t, 0.5) : null;
}

export type SituerResult =
  | { statut: "indetermine"; n: number; min: null; max: null }
  | { statut: "hors-echelle"; n: number; min: number; max: number }
  | {
      statut: "dans";
      n: number;
      nInfOuEgal: number;
      part: number;
      min: number;
      max: number;
    };

export function situerMontant(
  valeurs: number[],
  montant: number,
): SituerResult {
  const t = propres(valeurs);
  if (!t.length || !Number.isFinite(montant)) {
    return { statut: "indetermine", n: t.length, min: null, max: null };
  }
  const min = t[0]!;
  const max = t[t.length - 1]!;
  if (montant < min || montant > max) {
    return { statut: "hors-echelle", n: t.length, min, max };
  }
  const nInfOuEgal = t.filter((v) => v <= montant).length;
  return {
    statut: "dans",
    n: t.length,
    nInfOuEgal,
    part: nInfOuEgal / t.length,
    min,
    max,
  };
}
