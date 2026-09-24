# software-buyer-france — suivi

Plan : ~/.claude/plans/celui-de-l-organisation-jaikin-sasu-squishy-reef.md (validé le 24/09/2026)

## Phase 0 — Préparation
- [x] DNS jaikin.eu chez Cloudflare → MCP sur `mcp.jaikin.eu` (Worker custom domain)
- [x] Dépôt local initialisé, instantanés des données dans `pipeline/input/` (24/09)
- [ ] Compte Console platform.claude.com (Victor)

## Phase 1 — Pipeline de données
- [x] `pipeline/build-dataset.mjs` → `server/src/data/dataset.json`
- [x] Filtre CPV 45*/71* + tests
- [x] Prix privés vérifiés → `pipeline/input/private_prices.json` (14 chiffres)
- [x] Brancher `private_prices.json` → `private.market` dans dataset (TDD)
- [x] Passe de nettoyage : doublons de modification DECP v3, faux positifs ERP bâtiment, entités HTML
- [x] Tests pipeline verts

## Phase 2 — Serveur MCP (Worker)
- [x] Scaffold server/ (package.json, tsconfig, wrangler, vitest)
- [x] lib/stats.ts + helpers + 6 outils purs (TDD)
- [x] buildServer + index Worker (`createMcpHandler` via `agents/mcp`, sans DO)
- [x] Tests intégration InMemoryTransport + couverture ≥ 80 %
- [x] `private_market_prices` : filtre project_type, caveat, source/url/data_date/quote

## Phase 3 — Skills, commandes, docs
- [x] 7 skills + 5 commandes
- [x] README EN/FR, PRIVACY.md, plugin.json, marketplace.json, .mcp.json
- [x] LICENSE, CHANGELOG, .gitignore
- [x] scripts/check-content.sh + CI

## Session (24/09) — prix privés + packaging
- [x] Test pipeline : 14 figures `private.market`, url https + data_date
- [x] Impl. `build-dataset.mjs` → `private.market`
- [x] Outil + tests serveur `private_market_prices`
- [x] LICENSE / CHANGELOG / .gitignore
- [x] `scripts/check-content.sh` + `.github/workflows/ci.yml`
- [x] `npm run data:build` + tests racine/serveur + check-content

## Phase 4 — Évaluation des skills (3 documents piégés)
- [x] 24/09, Sonnet : devis 9/9 pièges (+ erreur de total), cahier des charges 7/7, comparaison OK → evals/results/
## Phase 5 — Publication (accord explicite de Victor avant repo public)
## Phase 6 — Soumission (Victor)
## Phase 7 — Page jaikin.eu (option)
