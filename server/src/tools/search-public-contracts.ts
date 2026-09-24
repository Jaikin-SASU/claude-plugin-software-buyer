import { buyerLink, clampLimit, fold, isProjectType, unsupportedProjectType } from "../lib/helpers.js";
import {
  DEFAULT_LIMIT,
  type Contract,
  type Dataset,
  type UnsupportedProjectType,
} from "../lib/types.js";

export interface SearchArgs {
  project_type: string;
  keywords?: string;
  department?: string;
  year_min?: number;
  nature?: string;
  limit?: number;
}

export interface SearchHit {
  object: string;
  amount_eur: number | null;
  duration_months: number | null;
  offers_received: number | null;
  notified_on: string | null;
  department: string | null;
  nature: string;
  buyer_siret: string | null;
  holder_siret: string | null;
  buyer_link: string | null;
}

export type SearchResult =
  | UnsupportedProjectType
  | { contracts: SearchHit[]; total_matched: number; limit: number };

function matchesKeywords(contract: Contract, keywords: string): boolean {
  const needle = fold(keywords).trim();
  if (!needle) return true;
  return fold(contract.object).includes(needle);
}

export function searchPublicContracts(
  dataset: Dataset,
  args: SearchArgs,
): SearchResult {
  if (!isProjectType(args.project_type)) {
    return unsupportedProjectType(args.project_type);
  }

  const limit = clampLimit(args.limit, DEFAULT_LIMIT);
  const yearMin = args.year_min;
  const matched = dataset.contracts
    .filter((c) => c.project_type === args.project_type)
    .filter((c) => (args.nature ? c.nature === args.nature : true))
    .filter((c) =>
      args.department ? c.department === args.department : true,
    )
    .filter((c) =>
      args.keywords ? matchesKeywords(c, args.keywords) : true,
    )
    .filter((c) => {
      if (yearMin === undefined || !Number.isFinite(yearMin)) return true;
      if (!c.notified_on) return false;
      return Number.parseInt(c.notified_on.slice(0, 4), 10) >= yearMin;
    })
    .sort((a, b) => (b.notified_on ?? "").localeCompare(a.notified_on ?? ""));

  const contracts = matched.slice(0, limit).map((c) => ({
    object: c.object,
    amount_eur: c.amount_eur,
    duration_months: c.duration_months,
    offers_received: c.offers_received,
    notified_on: c.notified_on,
    department: c.department,
    nature: c.nature,
    buyer_siret: c.buyer_siret,
    holder_siret: c.holder_siret,
    buyer_link: buyerLink(c.buyer_siret),
  }));

  return { contracts, total_matched: matched.length, limit };
}
