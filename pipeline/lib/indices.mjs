/**
 * Indices agrégés (médiane, quartiles, tension) avec planchers de publication.
 */
import { PLANCHERS, mediane, quartiles } from './stats.mjs';

/**
 * @param {Array<{ amount_eur: number, duration_months?: number, offers_received?: number|null }>} markets
 */
export function computeIndices(markets) {
  const amounts = markets.map((m) => m.amount_eur);
  const n = amounts.length;

  let median = null;
  let q1 = null;
  let q3 = null;
  let withheld_reason = null;

  if (n < PLANCHERS.MEDIANE) {
    withheld_reason = `n<${PLANCHERS.MEDIANE}_mediane`;
  } else {
    median = mediane(amounts);
    if (n < PLANCHERS.QUARTILES) {
      withheld_reason = `n<${PLANCHERS.QUARTILES}_quartiles`;
    } else {
      const q = quartiles(amounts);
      q1 = q.q1;
      q3 = q.q3;
    }
  }

  const monthlyValues = markets
    .filter((m) => typeof m.duration_months === 'number' && m.duration_months > 0)
    .map((m) => m.amount_eur / m.duration_months);

  const monthly_median =
    monthlyValues.length >= PLANCHERS.MEDIANE ? mediane(monthlyValues) : null;

  const withOffers = markets.filter((m) => typeof m.offers_received === 'number');
  const single_offer_share =
    withOffers.length > 0
      ? withOffers.filter((m) => m.offers_received === 1).length / withOffers.length
      : null;

  const oneOffer = markets.filter((m) => m.offers_received === 1).map((m) => m.amount_eur);
  const fourPlus = markets.filter((m) => m.offers_received >= 4).map((m) => m.amount_eur);

  let one_offer_median = null;
  let four_plus_median = null;
  if (
    oneOffer.length >= PLANCHERS.TENSION_GROUPE &&
    fourPlus.length >= PLANCHERS.TENSION_GROUPE
  ) {
    one_offer_median = mediane(oneOffer);
    four_plus_median = mediane(fourPlus);
  }

  return {
    n,
    median,
    q1,
    q3,
    monthly_median,
    single_offer_share,
    tension: { one_offer_median, four_plus_median },
    withheld_reason,
  };
}
