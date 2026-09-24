# Specification rubric (score each 0–3)

0 = absent · 1 = mentioned, not usable · 2 = usable with questions · 3 = a vendor can price and test it

1. **Context and goal** — why the project exists, the measurable outcome expected (time saved, errors avoided, revenue), the 3 metrics that will prove success.
2. **Users and roles** — who uses what, how many (named users, concurrent users, external users), permissions.
3. **Processes** — current process (as-is) and target process (to-be) for each flow, with volumes (orders/month, documents/day).
4. **Functional requirements** — numbered, prioritised (must/should/could), testable.
5. **Data** — main entities, volumes, sources, data owner, which system is the master for each shared data (customers, products, stock, prices).
6. **Migration** — what history is migrated, from where, quality, who cleans, dry run, cut-over date and rollback.
7. **Integrations** — each external system, direction of the flow, frequency, API/import availability verified.
8. **Non-functional** — performance, availability, offline use (field apps), accessibility, languages, devices.
9. **Hosting and security** — hosting decision (or explicit "to decide"), health or sensitive data, authentication (SSO, 2FA), backups and restore test, audit/pentest expectations.
10. **Compliance** — GDPR (personal data inventory, DPA expected), EU AI Act role if AI is involved (deployer, human oversight), sector rules (health data hosting HDS, e-invoicing, accessibility).
11. **Acceptance** — how each lot will be tested, by whom, with which real cases, acceptance report, availability of business testers.
12. **Planning and governance** — business deadline and why, milestones, buyer availability (a decision-maker reachable daily, data accessible in week 1), steering meetings.
13. **Budget and contract expectations** — budget range or ceiling, pricing model expected (fixed price per lot), ownership of code and accounts, maintenance expectations, reversibility.

Readiness = sum of the first 10 rubrics (/30). Rubrics 11–13 are reported but not scored in the total; flag them if 0.
