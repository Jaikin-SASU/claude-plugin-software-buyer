---
name: hosting-decision
description: Decide where a business application should be hosted (French/EU sovereign cloud, hyperscaler, vendor SaaS, or on-premise on the client's own servers) before a software project is priced. Use when the user asks "cloud or on-premise?", "do we need HDS / SecNumCloud?", "is our data exposed to the CLOUD Act?", "can we host on our own servers?", or when a specification or quote leaves hosting undecided. Produces a decision, its cost consequences, and the on-premise option priced separately.
argument-hint: "<context: data, users, constraints>"
---

# Hosting decision — settle it before pricing

If the user passed arguments, they are: $ARGUMENTS

Hosting changes the architecture, the recurring cost, the security clauses and the contract. It must be decided **before** vendors price the project, not discovered during it.

**Language:** answer in the user's language.

## Workflow

1. Collect the facts (ask only what is missing): data categories (personal, HR, health, financial, industrial secrets), users and locations, availability needs, offline needs, existing infrastructure and IT staff, regulatory constraints of the sector, customer contractual requirements (some clients require EU-only or on-premise), budget for recurring costs.
2. Walk the decision tree in `references/hosting-options.md`.
3. Always present **on-premise as a separately priced option** when the user or their customers raise it — never dismiss it and never slip it in for free. Price it with its full cost: hardware, licences, backups (including an off-site copy), monitoring, security patching, the people who operate it, and renewal after 4–5 years.
4. Output:

```
## Recommendation
Hosting model + one-paragraph rationale.

## Constraints that drove it
Data categories, regulation, customer requirements.

## Options compared
| Option | Fits constraints? | Setup cost drivers | Recurring cost drivers | Who operates | Exit / reversibility |

## On-premise (priced separately)
What it requires, cost items, and what the buyer must staff.

## Questions to put in the specification
Numbered.
```

## Principles

- Accounts in the buyer's name (cloud account, domain, backups), whatever the model.
- Check the **certified scope** of a provider, service by service: a provider can be certified for health data hosting (HDS) while some of its managed services (managed databases, AI APIs) are outside the certified scope.
- A provider headquartered in the US remains subject to US extraterritorial laws (CLOUD Act) even when data sits in an EU region. If that matters to the buyer or its customers, prefer an EU-headquartered provider, or a qualified offer (SecNumCloud) when required.
- AI features: say where inference runs and whether data is pseudonymised before it leaves the application.
- Backups are only real once a **restore has been tested**.
