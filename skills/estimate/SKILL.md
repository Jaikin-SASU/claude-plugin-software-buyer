---
name: estimate
description: Estimate the budget of a custom software project in France (ERP or Odoo integration, business application, mobile app, digital transformation / project management assistance, production management GPAO/MES) with sourced market data — French public procurement contracts (DECP) and verified private-market figures — plus a 5-year total cost including licences. Use when the user asks "how much does an ERP / app / custom software cost?", "combien coûte…", "is this budget realistic?", or needs a budget range before asking for quotes.
argument-hint: "<project description or path to a specification>"
---

# Estimate a software project budget (France)

If the user passed arguments, they are: $ARGUMENTS

Give a **range with its sources and assumptions**, never a single magic number.

**Language:** answer in the user's language.

## Workflow

1. **Clarify the scope** in a few questions if missing: project type, users, number of processes/modules, integrations, data migration, platforms (web/iOS/Android), hosting constraint, deadline. Map the need to a `project_type`: `erp`, `mobile_app`, `digital_transformation`, `gpao_mes`, `digital_twin`. AI projects have no reliable public dataset: estimate them from effort (step 3) and say so.
2. **Market data** — if the `prix-logiciel` MCP tools are available:
   - `price_statistics` for the project type (and nature: creation, redesign, maintenance) → median and quartiles of attributed public contracts;
   - `private_market_prices` → verified private figures (surveys, published grids) with URL and date;
   - `daily_rates` → reference day rates by profile;
   - `search_public_contracts` → 3 to 5 comparable contracts to show concrete examples.
   Public procurement amounts are often **multi-year framework ceilings** that include maintenance: say so, and prefer the "creation" nature and monthly figures when comparing to a one-off build.
3. **Effort-based cross-check**: break the scope into blocks (framing, each module/process, integrations, migration, acceptance, training, project management ≈ 15–20 %), estimate days per block (low / likely / high), multiply by a market day rate from `daily_rates`. Show the table.
4. **5-year total cost**: build + recurring (maintenance, hosting) + third-party licences (users × list price × 12 × 5, dated, "may change"). Unknown third-party costs are "to be confirmed", never 0.
5. Present the result.

## Output format

```
## Estimated range
Low – likely – high (excl. VAT), and the main driver of the spread.

## How it was built
Effort table (block, days low/likely/high, rate) and total.

## Market references
Public contracts: n, median, Q1–Q3, period, source (DECP, Etalab licence), with the caveats.
Private market: figure, scope, source URL, date.

## 5-year total cost
Build / recurring / licences / total.

## Assumptions and what would move the price
Numbered.

## Next step
What to write in the specification to get comparable quotes.
```

## Principles

- Cite every figure with its source and date. If a figure is not in the data, do not invent it.
- Respect the dataset's publication floors: when a statistic is withheld because the sample is too small, say "not enough contracts to publish a median" rather than computing one yourself.
- Framing before quoting: on a complex scope, recommend a paid framing phase whose deliverable makes the build priceable.
