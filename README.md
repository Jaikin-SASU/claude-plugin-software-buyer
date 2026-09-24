# Software Buyer France — Claude plugin

**Buy custom software in France without surprises.** Sourced price benchmarks, specification review, quote and contract review, vendor questions, offer comparison, hosting decision, legacy takeover.

[Français plus bas](#français)

## What it does

| Skill (invoke as `/software-buyer-france:<name>`) | You get |
|---|---|
| `estimate` | A low / likely / high budget range with its sources, an effort table and a 5-year total cost including licences |
| `review-spec` | A readiness score for your specification (cahier des charges), the decisions to take before pricing, testable rewrites of weak requirements, integration checks |
| `review-quote` | A verdict, red flags ranked by severity, missing clauses with wording to request (FR/EN), price positioning |
| `vendor-questions` | 12–20 questions adapted to your project and situation, each with the good answer and the red flag |
| `compare-offers` | A like-for-like comparison: scope coverage, 5-year cost, risk and ownership, recommendation |
| `hosting-decision` | Cloud, sovereign cloud, SaaS or on-premise (priced as a separate option), decided before pricing |
| `legacy-takeover` | A takeover plan when the previous developer or agency is gone: secure, audit, stabilise, then evolve or migrate |

Skills also trigger on their own when you ask things like *"is this quote fair?"*, *"combien coûte une application mobile ?"* or *"what should I ask this agency?"*.

## Price data (MCP server `prix-logiciel`)

The plugin connects to a read-only MCP server that serves:

- **French public procurement contracts (DECP)** already awarded for ERP, mobile apps, digital transformation / project management assistance, production management (GPAO/MES) and digital twins — about 480 qualified contracts, with medians and quartiles published only above minimum sample sizes (median ≥ 5 contracts, quartiles ≥ 12). Source: data.economie.gouv.fr, Etalab 2.0 licence. Building/engineering false positives (CPV 45 and 71) and republished modifications are removed.
- **Verified private-market figures**: surveys, day-rate barometers and published price grids, each with URL, quote and date of check. Figures that could not be verified at the source are excluded.

Tools: `search_public_contracts`, `price_statistics`, `private_market_prices`, `daily_rates`, `position_quote`, `sources_and_method`. All are read-only; no account is needed.

There is no reliable public dataset for AI projects yet: the tools say so rather than invent a number.

## The method behind the checklists

The review grids encode a buyer-protective standard used in real French software contracts:

1. **Map before you quote** — a paid framing phase beats a firm price on a vague scope.
2. **Fixed price means capped** — nothing invoiced above the total without a signed amendment; days are the vendor's commitment, not a billing base.
3. **Everything in your name from day one** — code repository, hosting, domain, store accounts; rights transferred as you pay.
4. **Acceptance by written report**, with deadlines on both sides; warranty after acceptance.
5. **A clean exit** — bounded termination cost, reversibility (code, documentation, data, accesses) within a stated delay.
6. **Decide hosting before pricing** — on-premise is a separately priced option, never an afterthought.
7. **Third-party costs at dated list prices**, never "0 €" when unknown.

Not legal advice: have high-stakes contracts reviewed by a lawyer.

## Install

```
/plugin marketplace add JAIKIN-SASU/claude-plugin-software-buyer
/plugin install software-buyer-france@jaikin
```

Once listed in the community marketplace: `/plugin marketplace add anthropics/claude-plugins-community` then `/plugin install software-buyer-france@claude-community`.

## Privacy

See [PRIVACY.md](PRIVACY.md). The MCP server stores nothing about your conversations; the documents you review are read by Claude locally and never sent to the server.

## Maintainer

Built and maintained by [JAIKIN](https://www.jaikin.eu/), Strasbourg (France). Issues and pull requests welcome.

---

## Français

**Acheter un logiciel sur mesure en France sans mauvaise surprise.** Repères de prix sourcés, relecture de cahier des charges, de devis et de contrat, questions à poser au prestataire, comparaison d'offres, choix de l'hébergement, reprise d'un existant.

| Skill (invoquer `/software-buyer-france:<name>`) | Ce que vous obtenez |
|---|---|
| `estimate` | Une fourchette basse / probable / haute avec ses sources, le détail de l'effort et le coût complet sur 5 ans, licences comprises |
| `review-spec` | La maturité de votre cahier des charges, les décisions à prendre avant tout chiffrage, les exigences réécrites pour être testables |
| `review-quote` | Un verdict, les signaux d'alerte classés par gravité, les clauses manquantes avec leur formulation, le positionnement du prix |
| `vendor-questions` | Les questions à poser au prestataire, avec la bonne réponse attendue et le signal d'alerte |
| `compare-offers` | Une comparaison à périmètre égal : couverture, coût sur 5 ans, risque, propriété, recommandation |
| `hosting-decision` | Cloud, cloud souverain, SaaS ou sur site (option chiffrée à part), tranché avant le chiffrage |
| `legacy-takeover` | Un plan de reprise quand le développeur ou l'agence précédente a disparu : sécuriser, auditer, stabiliser, puis faire évoluer ou migrer |

**Données de prix** : marchés publics attribués (DECP, licence Etalab 2.0) pour l'ERP, les applications mobiles, la transformation numérique et l'AMOA, la GPAO/MES et le jumeau numérique ; chiffres du marché privé vérifiés à la source, avec URL et date.

**La méthode** : cartographier avant de chiffrer ; un forfait est plafonné ; tout est au nom du client dès le premier jour ; recette par procès-verbal ; sortie bornée et réversibilité ; hébergement tranché avant le chiffrage (le sur site est une option chiffrée à part) ; coûts tiers au tarif public daté, jamais « 0 € ».

Ceci n'est pas un conseil juridique. Plugin conçu et maintenu par [JAIKIN](https://www.jaikin.eu/), Strasbourg.
