import { describe, expect, it } from 'vitest';
import { computeIndices } from '../lib/indices.mjs';

function mk(amount, duration = 12, offers = 2) {
  return {
    amount_eur: amount,
    duration_months: duration,
    offers_received: offers,
  };
}

describe('computeIndices', () => {
  it('n < 5 → médiane null + withheld_reason', () => {
    const markets = [mk(10), mk(20), mk(30), mk(40)];
    const idx = computeIndices(markets);
    expect(idx.n).toBe(4);
    expect(idx.median).toBeNull();
    expect(idx.q1).toBeNull();
    expect(idx.q3).toBeNull();
    expect(idx.withheld_reason).toBeTruthy();
  });

  it('5 ≤ n < 12 → médiane publiée, quartiles null', () => {
    const markets = Array.from({ length: 11 }, (_, i) => mk((i + 1) * 10_000));
    const idx = computeIndices(markets);
    expect(idx.n).toBe(11);
    expect(idx.median).not.toBeNull();
    expect(idx.q1).toBeNull();
    expect(idx.q3).toBeNull();
    expect(idx.withheld_reason).toMatch(/quartile|12/i);
  });

  it('n ≥ 12 → quartiles et médiane publiés', () => {
    const markets = Array.from({ length: 12 }, (_, i) => mk((i + 1) * 10_000));
    const idx = computeIndices(markets);
    expect(idx.n).toBe(12);
    expect(idx.median).not.toBeNull();
    expect(idx.q1).not.toBeNull();
    expect(idx.q3).not.toBeNull();
    expect(idx.withheld_reason).toBeNull();
  });

  it('tension : groupes publiés seulement si chacun ≥ 10', () => {
    const one = Array.from({ length: 10 }, (_, i) => mk(50_000 + i, 12, 1));
    const four = Array.from({ length: 10 }, (_, i) => mk(80_000 + i, 12, 4));
    const mixed = [...one, ...four];
    const idx = computeIndices(mixed);
    expect(idx.tension.one_offer_median).not.toBeNull();
    expect(idx.tension.four_plus_median).not.toBeNull();

    const tooSmall = [...one.slice(0, 5), ...four];
    const idx2 = computeIndices(tooSmall);
    expect(idx2.tension.one_offer_median).toBeNull();
    expect(idx2.tension.four_plus_median).toBeNull();
  });

  it('calcule monthly_median et single_offer_share', () => {
    const markets = [
      mk(120_000, 12, 1),
      mk(240_000, 12, 1),
      mk(120_000, 12, 3),
      mk(120_000, 12, 2),
      mk(120_000, 12, 2),
    ];
    const idx = computeIndices(markets);
    expect(idx.single_offer_share).toBeCloseTo(0.4);
    expect(idx.monthly_median).toBe(10_000);
  });
});
