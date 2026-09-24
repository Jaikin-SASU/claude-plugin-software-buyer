# Lessons — claude-plugin-software-buyer

## 2026-09-24 — MCP Worker

- Ne pas mélanger `@cloudflare/workers-types` et `@types/node` dans le même `types[]` de tsconfig (identifiers dupliqués). Pour les tests, importer `dataset.json` directement plutôt que `node:fs`.
- `agents@0.24` : `createMcpHandler` existe bien sur `agents/mcp` ; avec un serveur SDK v1 il bascule sur le lane legacy (WorkerTransport). Un serveur frais par requête évite Durable Object. Le lane vraiment stateless SDK v2 est `agents/mcp/server`.
- Couverture branches : les `?? ""` sur chaque champ CSV gonflent le compteur ; factoriser via un helper réduit le bruit.
