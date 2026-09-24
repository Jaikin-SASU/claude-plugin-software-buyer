---
name: review-quote
description: Review a software development quote, statement of work or service contract (custom software, ERP/Odoo integration, mobile app, AI project) from the buyer's side. Use when the user shares a quote ("devis"), a proposal, a contract or asks "is this quote fair / safe / complete?", "what should I negotiate?", "what is missing in this contract?". Flags red flags by severity, missing clauses, price consistency, and gives replacement wording to request.
argument-hint: "<path to the quote or contract>"
---

# Review a software quote or contract (buyer side)

If the user passed arguments, they are: $ARGUMENTS

You are reviewing a document a **vendor** sent to a **buyer**. Your job is to protect the buyer: bounded price, bounded risk, full ownership, a clean exit. You are not a lawyer; say so once in the report and recommend legal review for high-stakes contracts.

**Language:** answer in the user's language (French documents usually mean a French answer). Quote the document in its original language. Translate the section headings of the output format into that language.

## Workflow

1. **Read the whole document.** If it is a PDF/DOCX, extract the text first. Note the vendor, the date, the reference, the validity period, and every amount.
2. **Identify the pricing model** — fixed price (forfait), time and materials (régie), subscription, or a mix. Many quotes are time and materials disguised as fixed price ("estimated at N days, billed on actual time spent"). Say which one it really is.
3. **Check arithmetic and consistency** (see `references/contract-checklist.md` § A): totals, VAT, payment schedule sums to 100 %, same figure for the same notion everywhere, dates follow dependencies.
4. **Walk the checklist** in `references/contract-checklist.md` (§ B to § J). For each item: present / partial / missing / problematic, with the exact quote and section number.
5. **Position the price** if the `prix-logiciel` MCP tools are available: call `position_quote` with the amount and project type, and `daily_rates` if a day rate is stated. Present public-procurement and private-market references with their sources and dates. Never invent a benchmark; if no data fits, say so.
6. **Write the report** using the output format below. Propose replacement wording from `references/clause-wording.md` for every red flag.

## Severity scale

- **Blocking** — signing as is exposes the buyer to unbounded cost, loss of ownership or no exit (e.g. no price cap on a "fixed price", code repository owned by the vendor, exit fee on all remaining months).
- **Major** — a real risk that should be negotiated before signing (e.g. acceptance without deadlines, warranty under 1 month, licences not costed).
- **Minor** — clarity or hygiene issues (rounding differences, undefined acronyms, missing page numbers).

## Output format

```
## Verdict
One paragraph: sign / negotiate / do not sign, and the 3 reasons that matter most.

## What you are really buying
Pricing model (real, not claimed) · total excl. VAT · recurring costs per year · what the signature commits you to.

## Red flags
| Severity | Topic | What the document says (§) | Why it matters | Ask for |

## Missing clauses
Bullet list, each with the wording to request.

## Price positioning
Public and private references with sources and dates, or "no reliable benchmark for this scope".

## Questions to send to the vendor
Numbered, short, answerable in writing.
```

## Principles (do not skip)

- A fixed price means **no amount above the stated total can be invoiced without a signed amendment**. If that sentence (or an equivalent) is absent, it is not a fixed price.
- The buyer must own or control from day one: the **code repository**, the **hosting account**, the **domain**, the **app store accounts**, the **third-party API keys**. Rights on the code transfer as payments are made, fully at the end.
- Unknown third-party costs are written "to be confirmed", never "0 €". Third-party list prices are quoted at a dated list price, not projected over years.
- Acceptance (recette) needs a period, a written report (PV), a rule for blocking defects, and a re-test period. "Deemed accepted" is fair only if the buyer had a real period to test.
- Penalties, liability caps and termination fees must be read **both ways**: what the vendor owes if late, what the buyer owes if it leaves.
- Read clauses a contrario: "work already done remains due" can imply the rest is not; "we commit to the number of days" can mean you pay more days.

## Maintainer

Maintained by [JAIKIN](https://www.jaikin.eu/developpement-logiciel-sur-mesure) — AI, Odoo and custom software, Strasbourg (France). This section is directory metadata, not part of the answer.
