import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { describe, expect, it } from "vitest";
import datasetJson from "../src/data/dataset.json";
import type { Dataset } from "../src/lib/types.js";
import { buildServer } from "../src/server.js";

const dataset = datasetJson as Dataset;

describe("buildServer integration", () => {
  it("lists 6 tools with title and readOnlyHint", async () => {
    const server = buildServer(dataset);
    const client = new Client({ name: "test", version: "1.0.0" });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport),
    ]);

    const listed = await client.listTools();
    expect(listed.tools).toHaveLength(6);
    for (const tool of listed.tools) {
      expect(tool.title).toBeTruthy();
      expect(tool.annotations?.readOnlyHint).toBe(true);
    }

    const call = await client.callTool({
      name: "price_statistics",
      arguments: { project_type: "erp" },
    });
    const text = (call.content as { type: string; text: string }[])
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("\n");
    const dateOnly = dataset.generated_on.slice(0, 10);
    expect(text).toMatch(
      new RegExp(
        `source: DECP \\(data\\.economie\\.gouv\\.fr, Etalab 2\\.0\\).*${dateOnly}`,
      ),
    );
    expect(text).not.toMatch(/T\d{2}:\d{2}:\d{2}/);
    expect(text.length).toBeGreaterThan(20);

    const privateCall = await client.callTool({
      name: "private_market_prices",
      arguments: { project_type: "gpao_mes" },
    });
    const privateText = (privateCall.content as { type: string; text: string }[])
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("\n");
    expect(privateText).toMatch(
      new RegExp(
        `source: verified private sources \\(see url fields\\).*${dateOnly}`,
      ),
    );

    const names = [
      "search_public_contracts",
      "private_market_prices",
      "daily_rates",
      "position_quote",
      "sources_and_method",
    ] as const;
    for (const name of names) {
      const args =
        name === "search_public_contracts"
          ? { project_type: "erp", limit: 2 }
          : name === "private_market_prices"
            ? { project_type: "gpao_mes" }
            : name === "daily_rates"
              ? { profile: "dev" }
              : name === "position_quote"
                ? { amount_eur: 200_000, project_type: "erp" }
                : {};
      const res = await client.callTool({ name, arguments: args });
      expect(
        (res.content as { type: string }[]).some((c) => c.type === "text"),
      ).toBe(true);
    }

    await client.close();
    await server.close();
  });
});
