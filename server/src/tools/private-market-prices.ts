import { isProjectType, unsupportedProjectType } from "../lib/helpers.js";
import {
  MAX_ROWS,
  type Dataset,
  type PrivateMarketFigure,
  type UnsupportedProjectType,
} from "../lib/types.js";

export interface PrivateMarketArgs {
  project_type?: string;
}

export interface PrivateMarketEntry {
  project_type: string;
  kind?: string;
  metric?: string;
  value?: number;
  value_low?: number;
  value_high?: number;
  unit?: string;
  scope?: string;
  base?: string;
  source: string;
  url: string;
  data_date: string;
  quote: string;
}

export type PrivateMarketResult =
  | UnsupportedProjectType
  | { prices: PrivateMarketEntry[]; caveat: string };

const CAVEAT =
  "Agency grids are one vendor's published prices, not market statistics.";

function foldKey(value: string | undefined): string {
  return value ?? "";
}

function fromFigure(figure: PrivateMarketFigure): PrivateMarketEntry {
  return {
    project_type: figure.project_type,
    kind: figure.kind,
    metric: figure.metric,
    ...(figure.value !== undefined ? { value: figure.value } : {}),
    ...(figure.value_low !== undefined ? { value_low: figure.value_low } : {}),
    ...(figure.value_high !== undefined
      ? { value_high: figure.value_high }
      : {}),
    unit: figure.unit,
    scope: figure.scope,
    base: figure.base,
    source: figure.source,
    url: figure.url,
    data_date: figure.data_date,
    quote: figure.quote,
  };
}

function fromCrm(row: Record<string, string>): PrivateMarketEntry | null {
  const url = foldKey(row.source_url);
  if (!url) return null;
  const editeur = foldKey(row.editeur) || "CRM";
  const plan = foldKey(row.plan_entree);
  const monthly = foldKey(row.prix_mensuel_eur_utilisateur_mois);
  const annual = foldKey(row.prix_annuel_eur_utilisateur_mois);
  const priceBits = [
    monthly ? `${monthly} €/user/month` : null,
    annual ? `${annual} €/user/month (annual billing)` : null,
  ].filter(Boolean);
  return {
    project_type: "erp",
    kind: "vendor_list",
    metric: plan ? `${editeur} — ${plan}` : editeur,
    unit: "EUR per user / month",
    scope: foldKey(row.perimetre),
    base: "vendor list price",
    source: editeur,
    url,
    data_date: foldKey(row.releve),
    quote: priceBits.length
      ? `${editeur}${plan ? ` ${plan}` : ""}: ${priceBits.join("; ")}`
      : `${editeur}${plan ? ` — ${plan}` : ""} list price`,
  };
}

function fromGpao(row: Record<string, string>): PrivateMarketEntry | null {
  const url = foldKey(row.source_url);
  if (!url) return null;
  const editeur = foldKey(row.editeur) || "GPAO";
  const offre = foldKey(row.offre);
  const monthly = foldKey(row.prix_mensuel_utilisateur_eur);
  const annual5 = foldKey(row.annuel_5_utilisateurs_eur);
  const priceBits = [
    monthly ? `${monthly} €/user/month` : null,
    annual5 ? `${annual5} €/year for 5 users` : null,
  ].filter(Boolean);
  return {
    project_type: "gpao_mes",
    kind: "vendor_list",
    metric: offre ? `${editeur} — ${offre}` : editeur,
    unit: "EUR per user / month",
    scope: offre,
    base: "vendor list price",
    source: editeur,
    url,
    data_date: foldKey(row.date_releve),
    quote: priceBits.length
      ? `${editeur}${offre ? ` ${offre}` : ""}: ${priceBits.join("; ")}`
      : `${editeur}${offre ? ` — ${offre}` : ""} list price`,
  };
}

function marketFigures(dataset: Dataset): PrivateMarketEntry[] {
  return (dataset.private.market ?? []).map(fromFigure);
}

function crmEntries(dataset: Dataset): PrivateMarketEntry[] {
  return dataset.private.crm_pricing
    .map(fromCrm)
    .filter((e): e is PrivateMarketEntry => e !== null);
}

function gpaoEntries(dataset: Dataset): PrivateMarketEntry[] {
  return dataset.private.gpao_vendor_pricing
    .map(fromGpao)
    .filter((e): e is PrivateMarketEntry => e !== null);
}

function summarizeType(
  projectType: string,
  entries: PrivateMarketEntry[],
): PrivateMarketEntry | null {
  if (entries.length === 0) return null;
  const first = entries[0]!;
  const sources = [...new Set(entries.map((e) => e.source).filter(Boolean))];
  const dates = entries.map((e) => e.data_date).filter(Boolean).sort();
  const latest = dates[dates.length - 1] ?? first.data_date;
  return {
    project_type: projectType,
    kind: "summary",
    metric: `${entries.length} verified figure(s)`,
    source: sources.slice(0, 3).join("; ") || first.source,
    url: first.url,
    data_date: latest,
    quote:
      entries.length === 1
        ? first.quote
        : `${entries.length} verified private-market figures for ${projectType} (e.g. ${first.quote})`,
  };
}

function entriesForProjectType(
  dataset: Dataset,
  projectType: string,
): PrivateMarketEntry[] {
  switch (projectType) {
    case "erp":
      return [
        ...marketFigures(dataset).filter((e) => e.project_type === "erp"),
        ...crmEntries(dataset),
      ];
    case "mobile_app":
      return marketFigures(dataset).filter(
        (e) => e.project_type === "mobile_app",
      );
    case "gpao_mes":
      return gpaoEntries(dataset);
    default:
      return [];
  }
}

function summaryPerType(dataset: Dataset): PrivateMarketEntry[] {
  const types = ["erp", "mobile_app", "gpao_mes"] as const;
  return types
    .map((t) => summarizeType(t, entriesForProjectType(dataset, t)))
    .filter((e): e is PrivateMarketEntry => e !== null);
}

export function privateMarketPrices(
  dataset: Dataset,
  args: PrivateMarketArgs,
): PrivateMarketResult {
  if (args.project_type !== undefined && !isProjectType(args.project_type)) {
    return unsupportedProjectType(args.project_type);
  }

  const prices =
    args.project_type === undefined
      ? summaryPerType(dataset)
      : entriesForProjectType(dataset, args.project_type);

  return {
    prices: prices.slice(0, MAX_ROWS),
    caveat: CAVEAT,
  };
}
