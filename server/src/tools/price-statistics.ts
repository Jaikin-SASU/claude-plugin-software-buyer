import { isProjectType, unsupportedProjectType } from "../lib/helpers.js";
import {
  PRICE_CAVEAT,
  type Dataset,
  type IndexBlock,
  type UnsupportedProjectType,
} from "../lib/types.js";

export interface PriceStatisticsArgs {
  project_type: string;
  nature?: string;
}

export type PriceStatisticsResult =
  | UnsupportedProjectType
  | (IndexBlock & { caveat: string; project_type: string; nature: string | null });

export function priceStatistics(
  dataset: Dataset,
  args: PriceStatisticsArgs,
): PriceStatisticsResult {
  if (!isProjectType(args.project_type)) {
    return unsupportedProjectType(args.project_type);
  }

  const block = dataset.indices[args.project_type];
  if (!block) {
    return unsupportedProjectType(args.project_type);
  }

  const indices: IndexBlock =
    args.nature && block.by_nature[args.nature]
      ? block.by_nature[args.nature]!
      : block.all;

  return {
    project_type: args.project_type,
    nature: args.nature ?? null,
    n: indices.n,
    median: indices.median,
    q1: indices.q1,
    q3: indices.q3,
    monthly_median: indices.monthly_median,
    single_offer_share: indices.single_offer_share,
    tension: indices.tension,
    withheld_reason: indices.withheld_reason,
    caveat: PRICE_CAVEAT,
  };
}
