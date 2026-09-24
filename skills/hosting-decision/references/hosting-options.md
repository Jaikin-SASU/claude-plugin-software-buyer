# Hosting decision tree

1. **Health data** (patient or care data processed on behalf of a health actor)?
   → French law requires a certified health data host (HDS). Check the certified scope of each service used. Go to 4 for the model.
2. **Customer or regulatory requirement** for sovereignty (public sector, defence supply chain, sensitive industrial data)?
   → EU-headquartered provider; SecNumCloud-qualified offer when explicitly required. Ask for the requirement in writing.
3. **Personal data only (standard GDPR)**?
   → EU hosting, DPA with sub-processor list. Any EU provider works; the CLOUD Act question is a business choice, not a legal obligation.
4. **Choose the model**
   - **Vendor SaaS** (standard software hosted by its editor): lowest operating effort; check data location, export capabilities, and price increases at renewal.
   - **Managed cloud in the buyer's account** (sovereign EU provider or hyperscaler): the default for custom software; the buyer owns the account, the vendor operates with delegated access.
   - **On-premise** (buyer's own servers): justified by hard constraints (no internet on site, very sensitive data, customer requirement, existing IT team). Priced as a separate option.
5. **Offline / field use** — mobile apps working without network sync to any of the above; hosting is not the answer to offline needs.

## On-premise cost items (list them all)
- Servers, storage, network, UPS; virtualisation or OS licences.
- Backups with an off-site copy and periodic restore tests.
- Monitoring, security patching, certificate renewals, incident response — who does it, at what hours.
- Installation and hardening by the vendor; remote access for maintenance (and its security).
- Hardware renewal every 4–5 years.
- Impact on the software contract: deployment procedure, SLA limited to what the vendor can reach.

## Questions for the specification
1. Which data categories will the application process (personal, HR, health, financial)?
2. Does any customer, regulator or insurer impose a hosting location or qualification?
3. Who will operate the servers if hosted on-premise, and during which hours?
4. In whose name are the cloud account, domain and backups?
5. What is the maximum acceptable downtime and data loss (RTO / RPO)?
6. Where does AI inference run, and is data pseudonymised before it?
