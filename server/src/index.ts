import { createMcpHandler } from "agents/mcp";
import datasetJson from "./data/dataset.json";
import type { Dataset } from "./lib/types.js";
import { GITHUB_REPO } from "./lib/types.js";
import { buildServer } from "./server.js";

const dataset = datasetJson as Dataset;

const HOME = `prix-logiciel — read-only French software price MCP
Repo: ${GITHUB_REPO}
Privacy: ${GITHUB_REPO}/blob/main/PRIVACY.md
MCP endpoint: /mcp
`;

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(HOME, {
        status: 200,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    // Fresh server per request (stateless). createMcpHandler exists on agents/mcp
    // and routes SDK v1 servers through the WorkerTransport lane.
    return createMcpHandler(buildServer(dataset), { route: "/mcp" })(
      request,
      env,
      ctx,
    );
  },
} satisfies ExportedHandler;
