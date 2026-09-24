/**
 * Filtres d'exclusion des marchés (CPV faux positifs, montants, doublons).
 */

/**
 * Minuscules, sans accents.
 * @param {string} s
 * @returns {string}
 */
function fold(s) {
  return String(s)
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
}

/**
 * Clé d'objet pour dédoublonnage modifications DECP :
 * minuscules, sans accents, sans ponctuation, 40 premiers caractères.
 * @param {string|null|undefined} object
 * @returns {string}
 */
export function objectDedupKey(object) {
  return fold(object ?? '')
    .replace(/[^\p{L}\p{N}]+/gu, '')
    .slice(0, 40);
}

/**
 * @param {string|null|undefined} cpv
 * @returns {boolean}
 */
export function isExcludedCpv(cpv) {
  if (cpv == null || cpv === '') return false;
  const prefix = String(cpv).trim().slice(0, 2);
  return prefix === '45' || prefix === '71';
}

/**
 * Faux positifs « établissement recevant du public » pour project_type erp.
 * @param {Record<string, unknown>} m
 * @returns {boolean}
 */
export function isErpBuildingFalsePositive(m) {
  if (m.project_type !== 'erp') return false;

  const prefix = String(m.cpv ?? '').trim().slice(0, 2);
  if (prefix === '33' || prefix === '63') return true;

  const obj = fold(m.object ?? '');
  return (
    /defibrillat/.test(obj) ||
    /moyens de secours/.test(obj) ||
    /erp\s*\/\s*ert/.test(obj) ||
    /batiments? erp/.test(obj) ||
    /deplacements professionnels/.test(obj)
  );
}

/**
 * @param {Record<string, unknown>} m
 * @returns {string}
 */
function modificationKey(m) {
  return [
    m.project_type ?? '',
    m.buyer_siret ?? '',
    m.amount_eur ?? '',
    objectDedupKey(m.object),
  ].join('|');
}

/**
 * @param {Array<Record<string, unknown>>} markets
 * @returns {{ kept: typeof markets, excluded: Array<{ id: string, reason: string, market: object }> }}
 */
export function filterMarkets(markets) {
  const candidates = [];
  const excluded = [];
  const seenIdAmount = new Set();

  for (const m of markets) {
    const id = String(m.id ?? '');
    const amount = m.amount_eur;

    if (isExcludedCpv(m.cpv)) {
      const prefix = String(m.cpv).trim().slice(0, 2);
      excluded.push({
        id,
        reason: `cpv_${prefix}_exclu`,
        market: m,
      });
      continue;
    }

    if (isErpBuildingFalsePositive(m)) {
      excluded.push({
        id,
        reason: 'erp-building-false-positive',
        market: m,
      });
      continue;
    }

    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      excluded.push({
        id,
        reason: 'montant_invalide',
        market: m,
      });
      continue;
    }

    const key = `${id}|${amount}`;
    if (seenIdAmount.has(key)) {
      excluded.push({
        id,
        reason: 'doublon_id_montant',
        market: m,
      });
      continue;
    }
    seenIdAmount.add(key);
    candidates.push(m);
  }

  // Dédoublonnage modifications DECP : garder notified_on minimal.
  const bestByMod = new Map();
  for (const m of candidates) {
    const key = modificationKey(m);
    const prev = bestByMod.get(key);
    if (!prev) {
      bestByMod.set(key, m);
      continue;
    }
    const prevDate = String(prev.notified_on ?? '');
    const curDate = String(m.notified_on ?? '');
    if (curDate < prevDate) {
      bestByMod.set(key, m);
    }
  }

  const kept = [];
  for (const m of candidates) {
    const key = modificationKey(m);
    const best = bestByMod.get(key);
    if (best !== m) {
      excluded.push({
        id: String(m.id ?? ''),
        reason: 'duplicate-modification',
        market: m,
      });
      continue;
    }
    kept.push(m);
  }

  return { kept, excluded };
}
