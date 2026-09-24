import { clampLimit, fold } from "../lib/helpers.js";
import { DEFAULT_LIMIT, MAX_ROWS, type Dataset } from "../lib/types.js";

export interface DailyRatesArgs {
  profile?: string;
}

export interface DailyRateRow {
  profile: string;
  tjm_direct: string;
  tjm_intermediary: string;
  source: string;
  year: string;
  source_url: string;
}

const FREEWORK_URL =
  "https://www.free-work.com/fr/tech-it/blog/actualite-informatique";

export function dailyRates(
  dataset: Dataset,
  args: DailyRatesArgs,
): { rates: DailyRateRow[]; limit: number } {
  const limit = clampLimit(args.profile ? MAX_ROWS : DEFAULT_LIMIT, DEFAULT_LIMIT);
  const needle = args.profile ? fold(args.profile) : "";

  const rates = dataset.private.daily_rates
    .map((row) => ({
      profile: String(row["Profil"] || ""),
      tjm_direct: String(row["TJM moyen en direct"] || ""),
      tjm_intermediary: String(row["TJM moyen via un intermédiaire"] || ""),
      source: String(row["Source"] || "Free-Work"),
      year: String(row["Année"] || ""),
      source_url: FREEWORK_URL,
    }))
    .filter((r) => (needle ? fold(r.profile).includes(needle) : true))
    .slice(0, limit);

  return { rates, limit };
}
