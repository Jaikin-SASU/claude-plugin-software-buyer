---
name: compare-vendor-offers
description: Compare two or more software vendor offers or quotes (custom development, ERP/Odoo integration, mobile app, AI project) on a like-for-like basis — 5-year total cost, bounded risk, ownership and exit — and recommend one. Use when the user has several quotes ("comparer des devis", "which agency should I choose?", "offer A vs offer B").
---

# Compare vendor offers like for like

The cheapest quote is often the one that has priced the least. Normalise first, then compare cost **and** risk.

**Language:** answer in the user's language.

## Workflow

1. Extract from each offer: scope covered (map to the buyer's requirements if available), pricing model (real, not claimed), one-off cost, recurring costs (maintenance, hosting, licences per user × users), payment schedule, duration, warranty, ownership, exit terms.
2. **Normalise scope**: build a requirement × offer matrix (covered / conditional / not covered). Items missing from an offer are priced as a gap ("not included — to add"), never assumed free.
3. **5-year total cost**: one-off + 5 × recurring. Third-party licences at dated list prices, flagged "may change". Where an offer is time and materials, show the estimate *and* state that it is uncapped.
4. **Risk score** per offer using the review-quote-contract checklist (price cap, ownership, acceptance, exit, reversibility, data). A bounded-risk offer can beat a lower price.
5. If the `prix-logiciel` MCP tools are available, position each offer with `position_quote` and cite sources.
6. Recommend, and list what to negotiate with the preferred vendor before signing.

## Output format

```
## Recommendation
Chosen offer + 3 reasons + conditions to negotiate.

## Scope coverage
| Requirement / lot | Offer A | Offer B | … |

## 5-year cost
| | Offer A | Offer B |
| One-off | | |
| Recurring / year | | |
| Licences / year | | |
| Total 5 years | | |
| Price capped? | | |

## Risk and ownership
| Criterion | Offer A | Offer B |

## Market positioning
Sources and dates, or "no reliable benchmark".

## To negotiate before signing
Numbered.
```

## Principles

- Buyers buy **bounded risk**, not the lowest number: a capped price, code in their name, a cheap exit.
- Same scope before same price: never compare totals of offers covering different scopes.
- A day rate alone means nothing without the number of days and a cap.
