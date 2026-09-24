export const PROJECT_TYPES = [
  "erp",
  "mobile_app",
  "digital_transformation",
  "gpao_mes",
  "digital_twin",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export const NATURES = [
  "creation",
  "refonte",
  "maintenance",
  "licences",
  "indeterminee",
  "unknown",
] as const;

export type Nature = (typeof NATURES)[number];

export interface Contract {
  id: string;
  object: string;
  amount_eur: number | null;
  duration_months: number | null;
  offers_received: number | null;
  notified_on: string | null;
  department: string | null;
  nature: Nature | string;
  buyer_siret: string | null;
  holder_siret: string | null;
  project_type: ProjectType | string;
  cpv?: string | null;
  source_dataset?: string | null;
}

export interface IndexBlock {
  n: number;
  median: number | null;
  q1: number | null;
  q3: number | null;
  monthly_median: number | null;
  single_offer_share: number | null;
  tension: {
    one_offer_median: number | null;
    four_plus_median: number | null;
  };
  withheld_reason: string | null;
}

export interface DatasetSource {
  project_type: string;
  dataset: string;
  collected_on: string | null;
  licence: string;
  url: string;
}

export interface Dataset {
  generated_on: string;
  sources: DatasetSource[];
  contracts: Contract[];
  indices: Record<
    string,
    {
      all: IndexBlock;
      by_nature: Record<string, IndexBlock>;
    }
  >;
  excluded_count: Record<string, number>;
  private: {
    daily_rates: Record<string, string>[];
    crm_pricing: Record<string, string>[];
    gpao_vendor_pricing: Record<string, string>[];
    market: PrivateMarketFigure[];
  };
}

export interface PrivateMarketFigure {
  project_type: string;
  kind: string;
  metric: string;
  value?: number;
  value_low?: number;
  value_high?: number;
  unit: string;
  scope: string;
  base: string;
  source: string;
  url: string;
  data_date: string;
  quote: string;
}

export interface UnsupportedProjectType {
  message: string;
  available_project_types: readonly ProjectType[];
}

export const MAX_ROWS = 10;
export const DEFAULT_LIMIT = 5;

export const GITHUB_REPO =
  "https://github.com/JAIKIN-SASU/claude-plugin-software-buyer";

export const PRICE_CAVEAT =
  "Public contract amounts are often multi-year ceilings including maintenance; compare one-off builds with nature=creation or monthly figures.";

export const READ_ONLY_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;
