import { isProjectType, unsupportedProjectType } from "../lib/helpers.js";
import { situerMontant } from "../lib/stats.js";
import type {
  Dataset,
  PrivateMarketFigure,
  UnsupportedProjectType,
} from "../lib/types.js";

export interface PositionQuoteArgs {
  amount_eur: number;
  project_type: string;
  nature?: string;
}

export type PrivateReferencePosition =
  | "below"
  | "within"
  | "above"
  | "n/a"
  | "above_median"
  | "below_median";

export interface PrivateReference {
  source: string;
  metric: string;
  value?: number;
  value_low?: number;
  value_high?: number;
  unit: string;
  url: string;
  data_date: string;
  position: PrivateReferencePosition;
}

export type PositionStatus =
  | "within_range"
  | "out_of_range"
  | "undetermined";

export type PositionQuoteResult =
  | UnsupportedProjectType
  | {
      amount_eur: number;
      project_type: string;
      nature: string | null;
      status: PositionStatus;
      percentile: number | null;
      n: number;
      min: number | null;
      max: number | null;
      quartiles: { q1: number | null; median: number | null; q3: number | null };
      interpretation: string;
      private_references: PrivateReference[];
    };

const STATUS_MAP = {
  dans: "within_range",
  "hors-echelle": "out_of_range",
  indetermine: "undetermined",
} as const satisfies Record<string, PositionStatus>;

const PRIVATE_KINDS = new Set(["survey", "agency_grid"]);
const MAX_PRIVATE_REFS = 4;

function isEurUnit(unit: string): boolean {
  return /\bEUR\b/i.test(unit);
}

function hasUsableValues(figure: PrivateMarketFigure): boolean {
  const hasMedian = typeof figure.value === "number" && Number.isFinite(figure.value);
  const hasRange =
    typeof figure.value_low === "number" &&
    Number.isFinite(figure.value_low) &&
    typeof figure.value_high === "number" &&
    Number.isFinite(figure.value_high);
  return hasMedian || hasRange;
}

function positionAgainstFigure(
  amount: number,
  figure: PrivateMarketFigure,
): PrivateReferencePosition {
  if (!isEurUnit(figure.unit)) return "n/a";

  const hasRange =
    typeof figure.value_low === "number" &&
    Number.isFinite(figure.value_low) &&
    typeof figure.value_high === "number" &&
    Number.isFinite(figure.value_high);

  if (hasRange) {
    if (amount < figure.value_low!) return "below";
    if (amount > figure.value_high!) return "above";
    return "within";
  }

  if (typeof figure.value === "number" && Number.isFinite(figure.value)) {
    return amount > figure.value ? "above_median" : "below_median";
  }

  return "n/a";
}

function toPrivateReference(
  figure: PrivateMarketFigure,
  amount: number,
): PrivateReference {
  const base: PrivateReference = {
    source: figure.source,
    metric: figure.metric,
    unit: figure.unit,
    url: figure.url,
    data_date: figure.data_date,
    position: positionAgainstFigure(amount, figure),
  };

  const hasRange =
    typeof figure.value_low === "number" &&
    Number.isFinite(figure.value_low) &&
    typeof figure.value_high === "number" &&
    Number.isFinite(figure.value_high);

  if (hasRange) {
    return {
      ...base,
      value_low: figure.value_low,
      value_high: figure.value_high,
    };
  }

  return { ...base, value: figure.value };
}

function privateReferences(
  dataset: Dataset,
  projectType: string,
  amount: number,
): PrivateReference[] {
  return dataset.private.market
    .filter(
      (f) =>
        f.project_type === projectType &&
        PRIVATE_KINDS.has(f.kind) &&
        hasUsableValues(f),
    )
    .slice(0, MAX_PRIVATE_REFS)
    .map((f) => toPrivateReference(f, amount));
}

function interpret(
  statut: string,
  percentile: number | null,
  amount: number,
  q1: number | null,
  median: number | null,
  q3: number | null,
): string {
  if (statut === "indetermine") {
    return "Not enough published amounts to position this quote.";
  }
  if (statut === "hors-echelle") {
    return "Amount is outside the observed public range; treat as an outlier and check scope (multi-year ceiling vs one-off build).";
  }
  const p = percentile ?? 0;
  let band = "near the middle of published awards";
  if (q1 !== null && amount <= q1) band = "at or below Q1 (lower third of awards)";
  else if (q3 !== null && amount >= q3) band = "at or above Q3 (upper third of awards)";
  else if (median !== null && amount <= median) band = "between Q1 and the median";
  else if (median !== null) band = "between the median and Q3";

  return `About the ${Math.round(p)}th percentile of comparable public awards — ${band}. Public amounts are often multi-year ceilings; compare carefully.`;
}

export function positionQuote(
  dataset: Dataset,
  args: PositionQuoteArgs,
): PositionQuoteResult {
  if (!isProjectType(args.project_type)) {
    return unsupportedProjectType(args.project_type);
  }

  const amounts = dataset.contracts
    .filter((c) => c.project_type === args.project_type)
    .filter((c) => (args.nature ? c.nature === args.nature : true))
    .map((c) => c.amount_eur)
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v));

  const placed = situerMontant(amounts, args.amount_eur);
  const block = dataset.indices[args.project_type];
  const indices =
    args.nature && block?.by_nature[args.nature]
      ? block.by_nature[args.nature]!
      : block?.all;

  const percentile =
    placed.statut === "dans" ? Math.round(placed.part * 1000) / 10 : null;

  return {
    amount_eur: args.amount_eur,
    project_type: args.project_type,
    nature: args.nature ?? null,
    status: STATUS_MAP[placed.statut],
    percentile,
    n: placed.n,
    min: placed.min,
    max: placed.max,
    quartiles: {
      q1: indices?.q1 ?? null,
      median: indices?.median ?? null,
      q3: indices?.q3 ?? null,
    },
    interpretation: interpret(
      placed.statut,
      percentile,
      args.amount_eur,
      indices?.q1 ?? null,
      indices?.median ?? null,
      indices?.q3 ?? null,
    ),
    private_references: privateReferences(
      dataset,
      args.project_type,
      args.amount_eur,
    ),
  };
}
