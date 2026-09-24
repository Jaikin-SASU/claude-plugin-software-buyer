import {
  GITHUB_REPO,
  type Dataset,
} from "../lib/types.js";

export function sourcesAndMethod(dataset: Dataset) {
  return {
    generated_on: dataset.generated_on,
    licence: "Etalab 2.0",
    github: GITHUB_REPO,
    sources: dataset.sources.map((s) => ({
      project_type: s.project_type,
      dataset: s.dataset,
      collected_on: s.collected_on,
      licence: s.licence,
      url: s.url,
    })),
    filters: [
      "CPV 45* (construction) and CPV 71* (architecture/engineering) excluded",
      "Deduplication of DECP modification republishes (duplicate-modification)",
      "ERP false positives filtered (medical devices / telecom CPV motifs)",
    ],
    publication_floors: {
      median_min_n: 5,
      quartiles_min_n: 12,
      tension_group_min_n: 10,
    },
    known_limits: [
      "Public amounts are often multi-year ceilings including licences and maintenance.",
      "No reliable public dataset for AI-only projects yet.",
      "Private vendor pages are list prices, not negotiated deals.",
      "Department is missing on many older awards.",
    ],
    excluded_count: dataset.excluded_count,
  };
}
