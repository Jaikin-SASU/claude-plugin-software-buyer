import { describe, expect, it } from "vitest";
import { situerMontant, mediane, propres } from "../src/lib/stats.js";

describe("situerMontant", () => {
  it("returns ~50% for the median of a series", () => {
    const values = [10, 20, 30, 40, 50];
    const mid = mediane(values)!;
    const result = situerMontant(values, mid);
    expect(result.statut).toBe("dans");
    if (result.statut === "dans") {
      expect(result.part).toBeCloseTo(0.6, 5); // 3 of 5 ≤ 30
    }
  });

  it("marks amounts below min as hors-echelle", () => {
    expect(situerMontant([10, 20, 30], 5).statut).toBe("hors-echelle");
  });

  it("marks empty series as indetermine", () => {
    expect(situerMontant([], 10).statut).toBe("indetermine");
  });
});

describe("propres", () => {
  it("filters non-finite and sorts", () => {
    expect(propres([3, Number.NaN, 1, Infinity, 2])).toEqual([1, 2, 3]);
  });
});
