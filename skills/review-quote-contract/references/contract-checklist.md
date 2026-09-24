# Contract checklist — software quotes and service contracts

Each item: what good looks like, then the red flag. Cite the section of the document for every finding.

## A. Arithmetic and consistency
- Line totals = quantity × unit price; total excl. VAT, VAT rate (20 % in France for services), total incl. VAT.
- Payment schedule sums to exactly 100 % and to the total; each instalment tied to a verifiable event (order, milestone accepted, go-live), not to a calendar date alone.
- The same notion has **one figure** everywhere (recurring cost on page 1 = recurring cost in the summary table).
- Rounding: sub-totals by lot add up to the total to the euro. A 1 € gap between two tables is a signal of a hand-made document.
- Calendar is a dependency chain: validation before build, training before acceptance, acceptance report before final invoice; buyer inputs (accesses, data exports) requested before the lot that needs them.
- The contractual deadline matches the buyer's business constraint (e.g. "live before fiscal year end"), not "target + comfortable margin".
- Cross-references ("see § 4", "article 9") point to something that exists and says that.
- Issuer identity: legal name, registration number (SIREN/SIRET), VAT number, address match an official registry. Verify at annuaire-entreprises.data.gouv.fr.

## B. Pricing model
- Good: fixed price per lot with an explicit cap: "No amount above the total can be invoiced without a prior amendment accepted by the client." Days are the vendor's commitment, not a billing base.
- Red flag: "estimated", "indicative", "billed on time spent", "subject to adjustment", day counts without a cap, "change requests at our current rates" without a change procedure.
- Monthly capacity contracts (N days per month): check what happens to unused days — carried over when the vendor caused it, capped carry-over when the client caused it, never silently lost.

## C. Scope
- A line-by-line matrix answering the buyer's requirements (covered / conditional / option / not covered), with the **condition written** for each conditional line.
- An explicit "what we do not commit to" / exclusions section.
- Assumptions listed (data quality, number of users, integrations, volumes).
- Third-party connectors: the quote says whether the native connector of the third-party tool is used or a custom one is built, and why.
- Red flag: scope described in marketing terms ("complete platform", "AI-powered") with no testable requirements.

## D. Ownership and accounts
- Code repository (GitHub/GitLab) **in the buyer's name from day one**, with read access at least.
- Transfer of IP rights as payments are made; full ownership at the end; no licence fee on the delivered code.
- Pre-existing vendor components: perpetual, irrevocable, transferable licence to the buyer.
- Only permissive open-source licences in dependencies (MIT, Apache 2.0, BSD); any copyleft or proprietary dependency is disclosed.
- Hosting account, domain, app store accounts (Apple, Google), API keys: in the buyer's name.
- Warranty against third-party IP claims (garantie d'éviction).
- Red flag: vendor keeps the repository, "licence to use" instead of transfer, proprietary framework of the vendor with no exit.

## E. Acceptance (recette) and warranty
- Acceptance period stated (e.g. 10 business days), written acceptance report (PV) per lot, definition of blocking / major / minor defects, correction delay for blocking defects, re-test period.
- "Deemed accepted" only after the acceptance period without motivated reservations.
- Warranty (garantie de conformité) after acceptance: at least 3 months is common for custom software; free correction of non-conformities.
- Red flag: no acceptance procedure, warranty of a few weeks, acceptance tied to invoice payment.

## F. Service levels and maintenance
- Maintenance optional, priced separately, with its own term and notice period. "Maintenance must be earned, not locked in the contract."
- Incident priorities (P1 blocking … P3 minor), response time commitments in business hours; restoration times as objectives or commitments — know which.
- Security patches: critical patches applied within a stated delay.
- Red flag: mandatory multi-year maintenance, auto-renewal with long notice, SLA only "best effort".

## G. Delays and penalties
- One clear contractual deadline, the events that move it (late buyer inputs, scope change), penalties for vendor delay (e.g. % per week) with a cap.
- Red flag: no deadline at all, or penalties that only apply to the buyer.

## H. Liability and insurance
- Liability cap (often the contract amount), exclusions (indirect damages), professional liability insurance (RC Pro) with amount; ask for the certificate.
- Red flag: cap at "amounts paid in the last month", no insurance mentioned for a large project.

## I. Data, security and compliance
- GDPR: data processing agreement (DPA, article 28) signed **before** access to real personal data; sub-processors listed; hosting location.
- AI features: who is the "deployer" under the EU AI Act, human oversight, the AI is a decision-support tool, data sent to model providers (pseudonymisation, location).
- Security: tests (internal OWASP review, external pentest if exposed), access control, 2FA, backups and a **tested restore**.
- Hosting decision made before pricing (see the hosting-decision skill).
- Red flag: "compliant with GDPR" with no DPA, personal data sent to non-EU AI APIs without mention, backups without restore test.

## J. Exit and reversibility
- Trial or first-phase exit without penalty; after that, a bounded termination fee.
- Reversibility: delivery of code, documentation, data export in open formats and accesses within a stated delay (e.g. 15–30 days), plus a transition period.
- Business continuity: what happens if the vendor disappears (escrow, infrastructure in the buyer's name, documentation standard allowing another team to redeploy).
- Red flag: termination fee = all remaining months, data export "on request, at our rates", no documentation deliverable.

## K. Document hygiene (minor)
- Reference, date, validity period, page numbering "n / N", defined terms, no vendor jargon or undefined acronyms, internal notes absent ("to complete before sending"), signature block that says what the signature orders.
