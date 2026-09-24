import { describe, expect, it } from "vitest";
import datasetJson from "../src/data/dataset.json";
import type { Dataset } from "../src/lib/types.js";
import { searchPublicContracts } from "../src/tools/search-public-contracts.js";
import { priceStatistics } from "../src/tools/price-statistics.js";
import { privateMarketPrices } from "../src/tools/private-market-prices.js";
import { dailyRates } from "../src/tools/daily-rates.js";
import { positionQuote } from "../src/tools/position-quote.js";
import { sourcesAndMethod } from "../src/tools/sources-and-method.js";

const dataset = datasetJson as Dataset;

const AVAILABLE = [
  "erp",
  "mobile_app",
  "digital_transformation",
  "gpao_mes",
  "digital_twin",
] as const;

describe("search_public_contracts", () => {
  it("returns contracts sorted by date desc with buyer link", () => {
    const result = searchPublicContracts(dataset, {
      project_type: "erp",
      limit: 3,
    });
    expect(result).not.toHaveProperty("error");
    if ("contracts" in result) {
      expect(result.contracts.length).toBeLessThanOrEqual(3);
      expect(result.contracts[0]?.buyer_link).toMatch(
        /^https:\/\/annuaire-entreprises\.data\.gouv\.fr\/etablissement\//,
      );
      const dates = result.contracts.map((c) => c.notified_on ?? "");
      const sorted = [...dates].sort((a, b) => b.localeCompare(a));
      expect(dates).toEqual(sorted);
    }
  });

  it("returns a clear message for project_type ai (no error throw)", () => {
    const result = searchPublicContracts(dataset, { project_type: "ai" });
    expect(result).toMatchObject({
      message: expect.stringMatching(/no reliable dataset/i),
      available_project_types: [...AVAILABLE],
    });
  });

  it("caps limit at 10", () => {
    const result = searchPublicContracts(dataset, {
      project_type: "erp",
      limit: 50,
    });
    if ("contracts" in result) {
      expect(result.contracts.length).toBeLessThanOrEqual(10);
      expect(result.limit).toBe(10);
    }
  });

  it("matches keywords ignoring accents and case", () => {
    const result = searchPublicContracts(dataset, {
      project_type: "digital_twin",
      keywords: "données",
      limit: 10,
    });
    expect("contracts" in result).toBe(true);
    if ("contracts" in result) {
      expect(result.contracts.length).toBeGreaterThan(0);
      const folded = result.contracts.every((c) =>
        c.object
          .normalize("NFD")
          .replace(/\p{M}/gu, "")
          .toLowerCase()
          .includes("donnees"),
      );
      expect(folded).toBe(true);
    }
  });

  it("filters by department, nature and year_min", () => {
    const byDept = searchPublicContracts(dataset, {
      project_type: "erp",
      department: "13",
      limit: 5,
    });
    expect("contracts" in byDept).toBe(true);
    if ("contracts" in byDept) {
      expect(byDept.contracts.every((c) => c.department === "13")).toBe(true);
    }

    const byNature = searchPublicContracts(dataset, {
      project_type: "erp",
      nature: "creation",
      limit: 5,
    });
    if ("contracts" in byNature) {
      expect(byNature.contracts.every((c) => c.nature === "creation")).toBe(
        true,
      );
    }

    const byYear = searchPublicContracts(dataset, {
      project_type: "erp",
      year_min: 2024,
      limit: 5,
    });
    if ("contracts" in byYear) {
      expect(
        byYear.contracts.every(
          (c) => (c.notified_on ?? "0000") >= "2024-01-01",
        ),
      ).toBe(true);
    }
  });
});

describe("price_statistics", () => {
  it("returns indices for erp with caveat", () => {
    const result = priceStatistics(dataset, { project_type: "erp" });
    expect(result).not.toHaveProperty("error");
    if ("n" in result) {
      expect(result.n).toBeGreaterThan(100);
      expect(result.median).toBeTruthy();
      expect(result.caveat).toMatch(/multi-year ceilings/i);
    }
  });

  it("scopes by nature when present", () => {
    const result = priceStatistics(dataset, {
      project_type: "erp",
      nature: "creation",
    });
    expect("n" in result).toBe(true);
    if ("nature" in result) expect(result.nature).toBe("creation");
  });

  it("returns message for ai without throwing", () => {
    const result = priceStatistics(dataset, { project_type: "ai" });
    expect(result).toMatchObject({
      message: expect.stringMatching(/no reliable dataset/i),
      available_project_types: [...AVAILABLE],
    });
  });
});

describe("private_market_prices", () => {
  it("without project_type returns one summary per type with source, url, data_date, quote", () => {
    const result = privateMarketPrices(dataset, {});
    expect("prices" in result).toBe(true);
    if ("prices" in result) {
      expect(result.caveat).toBe(
        "Agency grids are one vendor's published prices, not market statistics.",
      );
      expect(result.prices.length).toBeGreaterThan(0);
      expect(result.prices.length).toBeLessThanOrEqual(10);
      const types = result.prices.map((p) => p.project_type);
      expect(new Set(types).size).toBe(types.length);
      for (const p of result.prices) {
        expect(p.source).toBeTruthy();
        expect(p.url).toMatch(/^https?:\/\//);
        expect(p.data_date).toBeTruthy();
        expect(p.quote).toBeTruthy();
      }
    }
  });

  it("filters erp to erp market figures plus crm_pricing", () => {
    const result = privateMarketPrices(dataset, { project_type: "erp" });
    if ("prices" in result) {
      expect(result.prices.length).toBeGreaterThan(0);
      expect(result.prices.length).toBeLessThanOrEqual(10);
      expect(result.prices.every((p) => p.project_type === "erp")).toBe(true);
      expect(result.prices.some((p) => p.kind === "vendor_list")).toBe(true);
      expect(result.prices.some((p) => p.kind !== "vendor_list")).toBe(true);
      for (const p of result.prices) {
        expect(p.source).toBeTruthy();
        expect(p.url).toMatch(/^https?:\/\//);
        expect(p.data_date).toBeTruthy();
        expect(p.quote).toBeTruthy();
      }
    }
  });

  it("filters mobile_app to mobile_app market figures", () => {
    const result = privateMarketPrices(dataset, {
      project_type: "mobile_app",
    });
    if ("prices" in result) {
      expect(result.prices.length).toBeGreaterThan(0);
      expect(result.prices.every((p) => p.project_type === "mobile_app")).toBe(
        true,
      );
      expect(result.prices.every((p) => p.kind !== "vendor_list")).toBe(true);
    }
  });

  it("filters by project_type gpao_mes", () => {
    const result = privateMarketPrices(dataset, { project_type: "gpao_mes" });
    if ("prices" in result) {
      expect(result.prices.every((p) => p.project_type === "gpao_mes")).toBe(
        true,
      );
      expect(result.prices.length).toBeGreaterThan(0);
      for (const p of result.prices) {
        expect(p.source).toBeTruthy();
        expect(p.url).toMatch(/^https?:\/\//);
        expect(p.data_date).toBeTruthy();
        expect(p.quote).toBeTruthy();
      }
    }
  });

  it("returns message for ai without throwing", () => {
    const result = privateMarketPrices(dataset, { project_type: "ai" });
    expect(result).toMatchObject({
      message: expect.stringMatching(/no reliable dataset/i),
      available_project_types: [...AVAILABLE],
    });
  });
});

describe("daily_rates", () => {
  it("returns reference TJM with source and year", () => {
    const result = dailyRates(dataset, {});
    expect(result.rates.length).toBeGreaterThan(0);
    expect(result.rates.length).toBeLessThanOrEqual(10);
    expect(result.rates[0]?.source).toBeTruthy();
    expect(result.rates[0]?.year).toBeTruthy();
  });

  it("filters profile ignoring accents", () => {
    const result = dailyRates(dataset, { profile: "architecte" });
    expect(result.rates.length).toBeGreaterThan(0);
    expect(
      result.rates.every((r) =>
        r.profile
          .normalize("NFD")
          .replace(/\p{M}/gu, "")
          .toLowerCase()
          .includes("architecte"),
      ),
    ).toBe(true);
  });
});

describe("position_quote", () => {
  const erp = dataset.indices.erp!;

  it("places the ERP median near the 50th percentile", () => {
    const median = erp.all.median!;
    const result = positionQuote(dataset, {
      amount_eur: median,
      project_type: "erp",
    });
    expect(result).not.toHaveProperty("message");
    if ("percentile" in result) {
      expect(result.percentile).toBeGreaterThanOrEqual(45);
      expect(result.percentile).toBeLessThanOrEqual(55);
      expect(result.interpretation).toBeTruthy();
      expect(result.status).toBe("within_range");
      expect(result).not.toHaveProperty("statut");
    }
  });

  it("interprets low, high and out-of-range amounts", () => {
    const low = positionQuote(dataset, {
      amount_eur: 1_000,
      project_type: "erp",
    });
    expect("status" in low && low.status === "out_of_range").toBe(true);

    const high = positionQuote(dataset, {
      amount_eur: erp.all.q3! * 1.5,
      project_type: "erp",
      nature: "creation",
    });
    expect("interpretation" in high).toBe(true);

    const midHigh = positionQuote(dataset, {
      amount_eur: erp.all.q3! - 1,
      project_type: "erp",
    });
    if ("interpretation" in midHigh) {
      expect(midHigh.interpretation.length).toBeGreaterThan(20);
    }

    const q1ish = positionQuote(dataset, {
      amount_eur: erp.all.q1!,
      project_type: "erp",
    });
    if ("interpretation" in q1ish) {
      expect(q1ish.interpretation).toMatch(/Q1|percentile/i);
    }

    const empty: Dataset = {
      ...dataset,
      contracts: [],
      indices: {
        ...dataset.indices,
        digital_twin: {
          all: {
            n: 0,
            median: null,
            q1: null,
            q3: null,
            monthly_median: null,
            single_offer_share: null,
            tension: { one_offer_median: null, four_plus_median: null },
            withheld_reason: "n<5_mediane",
          },
          by_nature: {},
        },
      },
    };
    const none = positionQuote(empty, {
      amount_eur: 10_000,
      project_type: "digital_twin",
    });
    expect("status" in none && none.status === "undetermined").toBe(true);
  });

  it("adds private_references: La Fabrique Q1–Q3 is above for 64750 € mobile_app", () => {
    const result = positionQuote(dataset, {
      amount_eur: 64_750,
      project_type: "mobile_app",
    });
    expect("private_references" in result).toBe(true);
    if (!("private_references" in result)) return;

    expect(result.private_references.length).toBeGreaterThan(0);
    expect(result.private_references.length).toBeLessThanOrEqual(4);

    const q1q3 = result.private_references.find(
      (r) =>
        r.source.includes("La Fabrique") &&
        r.value_low === 15_000 &&
        r.value_high === 50_000,
    );
    expect(q1q3).toBeDefined();
    expect(q1q3?.position).toBe("above");
    expect(q1q3).toMatchObject({
      metric: expect.any(String),
      unit: expect.stringMatching(/EUR/i),
      url: expect.stringMatching(/^https?:\/\//),
      data_date: expect.any(String),
    });

    const medianRef = result.private_references.find(
      (r) => r.value === 30_000 && !("value_low" in r),
    );
    if (medianRef) {
      expect(medianRef.position).toBe("above_median");
    }
  });

  it("returns message for ai without throwing", () => {
    const result = positionQuote(dataset, {
      amount_eur: 100_000,
      project_type: "ai",
    });
    expect(result).toMatchObject({
      message: expect.stringMatching(/no reliable dataset/i),
      available_project_types: [...AVAILABLE],
    });
  });
});

describe("price_statistics gaps", () => {
  it("returns unsupported when indices bucket is missing", () => {
    const thin: Dataset = { ...dataset, indices: {} };
    const result = priceStatistics(thin, { project_type: "erp" });
    expect(result).toMatchObject({
      message: expect.stringMatching(/no reliable dataset/i),
    });
  });
});

describe("private_market empty fields", () => {
  it("tolerates sparse CRM/GPAO rows", () => {
    const sparse: Dataset = {
      ...dataset,
      private: {
        daily_rates: [],
        crm_pricing: [{}],
        gpao_vendor_pricing: [
          { source_url: "https://example.com", date_releve: "2026" },
        ],
        market: [],
      },
    };
    const result = privateMarketPrices(sparse, { project_type: "gpao_mes" });
    if ("prices" in result) {
      expect(result.prices.length).toBe(1);
      expect(result.prices[0]?.url).toBe("https://example.com");
      expect(result.prices[0]?.data_date).toBe("2026");
      expect(result.caveat).toMatch(/Agency grids/i);
    }
  });
});

describe("search edge keywords", () => {
  it("treats blank keywords as match-all", () => {
    const result = searchPublicContracts(dataset, {
      project_type: "erp",
      keywords: "   ",
      limit: 2,
    });
    expect("contracts" in result).toBe(true);
  });
});

describe("sources_and_method", () => {
  it("lists DECP sources, filters and GitHub repo", () => {
    const result = sourcesAndMethod(dataset);
    expect(result.licence).toMatch(/Etalab/i);
    expect(result.github).toMatch(/claude-plugin-software-buyer/);
    expect(result.filters).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/CPV 45/i),
        expect.stringMatching(/dedup|dédoubl|modificat/i),
      ]),
    );
    expect(result.sources.length).toBeGreaterThanOrEqual(5);
  });
});
