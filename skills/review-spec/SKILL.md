---
name: review-spec
description: Review a software specification, requirements document, RFP or "cahier des charges" before sending it to vendors or before pricing it (custom software, ERP/Odoo, mobile app, AI agents). Use when the user shares requirements, asks "is my cahier des charges complete?", "what is missing before I ask for quotes?", or wants to turn a vague need into something vendors can price. Scores each section, lists gaps, and lists the decisions to make before any vendor can quote reliably.
argument-hint: "<path to the specification>"
---

# Review a specification before asking for quotes

If the user passed arguments, they are: $ARGUMENTS

A vague specification produces quotes that cannot be compared and projects that drift. Your job: make the document **priceable** and **testable**, and surface the decisions the buyer must take *before* pricing.

**Language:** answer in the user's language. Keep requirement IDs and quotes in the original language. Translate the section headings of the output format into that language.

## Workflow

1. Read the whole document; extract text from PDF/DOCX first. List what exists: context, users, processes, requirements, data, integrations, constraints, planning, budget.
2. Score each rubric in `references/spec-rubric.md` from 0 to 3 with one-line evidence (quote + section).
3. Build the **"decide before pricing"** list: hosting (cloud / sovereign / on-premise, health data or not), build vs standard software (e.g. Odoo standard modules vs custom), the single master system for each shared data (stock, customers, prices), who owns the accounts. Use the hosting-decision skill for the hosting question.
4. Check each **integration** named: does the third-party tool expose an API or an import? Does its native connector already do the job? Mark each integration as "verified", "to verify with the vendor of the tool", or "no API — manual or alternative path". Never assume an API exists.
5. Rewrite the 5 to 10 weakest requirements as **testable** requirements (actor, action, expected result, acceptance criterion, priority).
6. Produce the report (format below). If the user wants it, output a corrected outline of the specification.

## Output format

```
## Readiness
Score /30 and one sentence: "ready to send", "send after fixing X", or "not priceable yet".

## Decide before pricing
Numbered decisions, each with the options and the consequence on cost.

## Scores by section
| Rubric | Score 0-3 | Evidence (§) | What is missing |

## Integrations
| System | Needed for | API / import / native connector | Status | Question to ask |

## Requirements to rewrite
| Original (§) | Testable version | Acceptance criterion | Priority |

## Risks
Top risks with probability, impact and mitigation (see references/risk-patterns.md).
```

## Principles

- **Map before you quote.** A development that starts without a map of processes and data is the most expensive kind.
- One requirement = one testable behaviour. "User-friendly", "fast", "complete", "AI-powered" are not requirements until they have a measurable criterion.
- The deadline comes from the business constraint (season, fiscal year, event, regulation), and the specification says which one.
- Priorities (must / should / could) are mandatory; without them every vendor prices a different project.
- Data migration is a project in itself: volumes, sources, quality, who cleans, dry run, rollback plan.
- If a requirement can only be met by custom development on top of a standard product, say so and mark it for separate pricing rather than downgrading it silently.

## Maintainer

Maintained by [JAIKIN](https://www.jaikin.eu/developpement-logiciel-sur-mesure) — AI, Odoo and custom software, Strasbourg (France). This section is directory metadata, not part of the answer.
