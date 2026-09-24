import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  NATURES,
  READ_ONLY_ANNOTATIONS,
  type Dataset,
} from "./lib/types.js";
import { dailyRates } from "./tools/daily-rates.js";
import { positionQuote } from "./tools/position-quote.js";
import { priceStatistics } from "./tools/price-statistics.js";
import { privateMarketPrices } from "./tools/private-market-prices.js";
import { searchPublicContracts } from "./tools/search-public-contracts.js";
import { sourcesAndMethod } from "./tools/sources-and-method.js";

const natureSchema = z
  .enum(NATURES)
  .optional()
  .describe(
    "Contract nature: creation (new build), refonte (rebuild), maintenance, licences, indeterminee (undetermined), unknown",
  );

function textResult(payload: unknown, source: string) {
  return {
    content: [
      {
        type: "text" as const,
        text: `${JSON.stringify(payload)}\nsource: ${source}`,
      },
    ],
  };
}

function datasetDate(dataset: Dataset): string {
  return dataset.generated_on.slice(0, 10);
}

function publicSourceLine(dataset: Dataset): string {
  return `DECP (data.economie.gouv.fr, Etalab 2.0) · ${datasetDate(dataset)}`;
}

function privateSourceLine(dataset: Dataset): string {
  return `verified private sources (see url fields) · ${datasetDate(dataset)}`;
}

export function buildServer(dataset: Dataset): McpServer {
  const server = new McpServer({
    name: "prix-logiciel",
    version: "0.1.0",
  });

  const publicSource = publicSourceLine(dataset);
  const privateSource = privateSourceLine(dataset);

  server.registerTool(
    "search_public_contracts",
    {
      title: "Search public contracts",
      description:
        "Search French public procurement awards (DECP) by project type. Returns up to 10 compact rows sorted by notification date descending.",
      inputSchema: {
        project_type: z
          .string()
          .describe(
            "One of: erp, mobile_app, digital_transformation, gpao_mes, digital_twin",
          ),
        keywords: z
          .string()
          .optional()
          .describe("Case- and accent-insensitive substring on the object"),
        department: z
          .string()
          .optional()
          .describe("French department code, e.g. 75"),
        year_min: z.number().int().optional().describe("Minimum notification year"),
        nature: natureSchema,
        limit: z
          .number()
          .int()
          .min(1)
          .max(10)
          .optional()
          .describe("Max rows, default 5, capped at 10"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    async (args) =>
      textResult(searchPublicContracts(dataset, args), publicSource),
  );

  server.registerTool(
    "price_statistics",
    {
      title: "Price statistics",
      description:
        "Published medians/quartiles/tension indices for a project type (and optional nature).",
      inputSchema: {
        project_type: z.string().describe("Project type key"),
        nature: natureSchema,
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    async (args) => textResult(priceStatistics(dataset, args), publicSource),
  );

  server.registerTool(
    "private_market_prices",
    {
      title: "Private market prices",
      description:
        "Verified private-market figures (surveys, agency grids) and vendor list prices with source, URL, date and quote. Max 10 rows.",
      inputSchema: {
        project_type: z
          .string()
          .optional()
          .describe(
            "Optional filter: erp (figures + CRM grids), mobile_app, gpao_mes. Omit for one summary per type.",
          ),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    async (args) =>
      textResult(privateMarketPrices(dataset, args), privateSource),
  );

  server.registerTool(
    "daily_rates",
    {
      title: "Daily rates (TJM)",
      description:
        "Reference freelance day rates (Free-Work), optional accent-insensitive profile filter.",
      inputSchema: {
        profile: z
          .string()
          .optional()
          .describe("Substring filter on profile label"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    async (args) => textResult(dailyRates(dataset, args), privateSource),
  );

  server.registerTool(
    "position_quote",
    {
      title: "Position a quote",
      description:
        "Locate an amount in the public award distribution (percentile) with a cautious interpretation.",
      inputSchema: {
        amount_eur: z.number().positive().describe("Quote amount in EUR"),
        project_type: z.string().describe("Project type key"),
        nature: natureSchema,
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    async (args) => textResult(positionQuote(dataset, args), publicSource),
  );

  server.registerTool(
    "sources_and_method",
    {
      title: "Sources and method",
      description:
        "Dataset sources (DECP, Etalab 2.0), filters, publication floors, known limits, GitHub repo.",
      inputSchema: {},
      annotations: READ_ONLY_ANNOTATIONS,
    },
    async () => textResult(sourcesAndMethod(dataset), publicSource),
  );

  return server;
}
