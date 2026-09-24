---
name: legacy-takeover
description: Plan the takeover of an existing application or information system whose vendor or developer is gone, whose code is undocumented, or whose ERP was badly integrated. Use when the user says "our developer left", "the agency disappeared", "nobody dares touch the ERP", "reprise d'application legacy", "should we rewrite or maintain?". Produces a phased takeover plan (secure, audit, stabilise, then evolve or migrate) and a rewrite-vs-maintain decision frame.
argument-hint: "<what the system does and what is known>"
---

# Take over an existing system

If the user passed arguments, they are: $ARGUMENTS

Rewriting is not a reflex. First regain control, then understand, then decide.

**Language:** answer in the user's language.

## Workflow

1. Gather facts (ask only what is missing): what the system does, who uses it, stack if known, where it is hosted, who holds the accesses, last change, incidents, contracts with the previous vendor.
2. Produce the phased plan below, tailored to the facts.
3. If the user considers rewriting, apply the decision frame.

## Phases

**1. Secure (days, not weeks)**
- Inventory every access: hosting, domain/DNS, code repository, databases, third-party APIs, app store accounts, email sending, payment providers.
- Put each access **in the company's name**; rotate secrets held by former providers; remove departed people.
- Verify backups and **run one restore**.
- Request from the previous vendor, in writing, the deliverables owed under its contract (code, documentation, data) — quote the reversibility clause if there is one.

**2. Audit**
- Code: can it be built and deployed from the repository by someone new? Dependencies and their versions, known vulnerabilities, tests.
- Data: model, volumes, quality, where the master data lives.
- Operations: monitoring, logs, error rates, manual workarounds used by staff.
- Deliverable: a written audit with a risk list and an effort estimate per risk.

**3. Stabilise**
- Fix what threatens operations first (security patches, failing jobs, backups), document as you go, add minimal monitoring.

**4. Evolve or migrate**
- Evolve when the core is sound; migrate or rebuild module by module when it is not.

## Rewrite vs maintain — decision frame
Compare over 3 to 5 years: maintenance cost of the existing system (including incident cost and workarounds) vs rebuild cost + migration + run cost of the new one. Consider business risk during the transition. Recommend rewriting only when the comparison says so, and preferably in slices.

## Output format

```
## Situation
## Immediate actions (this week)
## Takeover plan (phases with deliverables)
## Rewrite or maintain?
## Questions for the previous vendor / the team
```
