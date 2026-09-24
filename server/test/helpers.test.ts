import { describe, expect, it } from "vitest";
import {
  buyerLink,
  clampLimit,
  fold,
  isProjectType,
  unsupportedProjectType,
} from "../src/lib/helpers.js";
import { situerMontant } from "../src/lib/stats.js";

describe("helpers", () => {
  it("folds accents", () => {
    expect(fold("DONNÉES")).toBe("donnees");
  });

  it("validates project types", () => {
    expect(isProjectType("erp")).toBe(true);
    expect(isProjectType("ai")).toBe(false);
  });

  it("clamps limits", () => {
    expect(clampLimit(undefined, 5)).toBe(5);
    expect(clampLimit(50, 5)).toBe(10);
    expect(clampLimit(0, 5)).toBe(5);
    expect(clampLimit(-1, 5)).toBe(5);
    expect(clampLimit(3, 5)).toBe(3);
  });

  it("builds buyer links", () => {
    expect(buyerLink(null)).toBeNull();
    expect(buyerLink("123")).toBe(
      "https://annuaire-entreprises.data.gouv.fr/etablissement/123",
    );
  });

  it("formats unsupported message", () => {
    expect(unsupportedProjectType("ai").message).toMatch(/ai/);
  });
});

describe("situerMontant edges", () => {
  it("rejects non-finite amounts", () => {
    expect(situerMontant([1, 2, 3], Number.NaN).statut).toBe("indetermine");
  });

  it("interpolates between ranks", () => {
    const r = situerMontant([10, 20, 30, 40], 25);
    expect(r.statut).toBe("dans");
  });

  it("marks above max as hors-echelle", () => {
    expect(situerMontant([1, 2, 3], 99).statut).toBe("hors-echelle");
  });
});
