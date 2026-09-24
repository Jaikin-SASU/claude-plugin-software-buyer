## Verdict

**Ne pas signer en l'état. Il faut renégocier sur une base remaniée.** Trois raisons pèsent le plus :

1. **Aucun plafond de prix.** C'est de la régie déguisée en devis (§2), avec un total faux de +1 000 € et un échéancier à 110 %.
2. **Vous n'avez aucune sortie.** Le code reste au prestataire (§5) et l'hébergement est chez lui (§4). Une maintenance de 36 mois est imposée (§6). Partir coûte jusqu'à 43 200 € HT exigibles d'un coup (§7).
3. **Rien ne vous protège.** La recette est réputée acquise à la mise en production (§8). Il n'y a ni garantie ni délai. Le RGPD tient en une phrase (§9).

Je ne suis pas juriste. Pour un engagement d'environ 107 k€ HT sur 3 ans, faites relire le contrat par un juriste avant toute signature.

## Ce que vous achetez réellement

- **Modèle réel : régie.** « Estimation », « facturation sur la base du temps réellement passé » (§2). Le total affiché est une estimation.
- **Total HT recalculé : 63 750 €** (75 j × 850 €). Le devis affiche 64 750 €.
- **Récurrent : 14 400 € HT/an** (17 280 € TTC) de maintenance obligatoire dès la mise en production. Cela fait 43 200 € HT sur 36 mois, reconductibles par périodes de 36 mois.
- **Engagement minimal sur 3 ans : environ 106 950 € HT** (63 750 + 43 200). C'est hors dépassement de jours et hors coûts d'hébergement et d'IA, écrits « 0 € » sans garantie.
- **Ordre de grandeur du risque :** +30 % de jours donne 97,5 j, soit 82 875 € HT pour le développement (+19 125 €). C'est un scénario, pas une prévision.
- **Ce que la signature engage :**
  - un développement en régie ;
  - une maintenance de 36 mois ;
  - une simple licence d'usage, sans propriété du code ;
  - un hébergement chez le prestataire ;
  - une sortie facturée à 100 % des mensualités restantes.

## Red flags

| Sév. | Sujet | Ce que dit le document (§) | Pourquoi c'est un problème | À demander |
|---|---|---|---|---|
| **Bloquant** | R1 · Pas de plafond (régie déguisée) | §2 : « Le nombre de jours est une estimation. La facturation est établie mensuellement sur la base du temps réellement passé » | Vous portez 100 % du risque de dépassement. Le prestataire n'a aucun intérêt à finir vite. | Clause « Plafond de prix » et périmètre testable avant signature |
| **Bloquant** | R2 · Propriété du code | §5 : « Le code source reste la propriété de Digitalis. Le Client dispose d'une licence d'utilisation non exclusive pendant toute la durée du contrat de maintenance » | Vous payez plus de 63 k€ pour un droit d'usage. Lu a contrario, il s'éteint dès que la maintenance s'arrête. Le prestataire peut aussi réutiliser le code pour d'autres clients. | Clauses « Dépôt et comptes » et « Cession PI » |
| **Bloquant** | R3 · Maintenance imposée, 36 mois, tacite reconduction | §6 : « obligatoire… 36 mois à 1 200 € HT… reconduit tacitement par période de 36 mois, sauf dénonciation 6 mois avant » | Engagement de 43 200 €. Il faut dénoncer avant le mois 30, sinon 43 200 € de plus. La maintenance démarre à la mise en production, donc vous payez pour corriger les défauts de livraison. | Maintenance optionnelle et séparée, après une garantie d'au moins 3 mois. Durée de 12 mois maximum, préavis de 3 mois. |
| **Bloquant** | R4 · Sortie punitive | §7 : « la totalité des mensualités restantes… immédiatement exigible » | Jusqu'à 43 200 € HT exigibles dès le 1er jour. Rien n'est prévu si le prestataire est fautif. Avec §5, vous payez et vous perdez aussi le droit d'usage. Aucune résiliation pour manquement du prestataire n'est prévue. | Clause « Sortie » |
| **Bloquant** | R5 · Hébergement chez le prestataire, pas de réversibilité | §4 : « hébergée sur notre infrastructure (compte Digitalis) » | Code déployé, données et accès sont chez lui. Il n'y a ni export de données ni documentation. Si Digitalis disparaît ou se brouille avec vous, vous perdez la plateforme et les données. | Comptes à votre nom, clause « Réversibilité » |
| **Majeur** | R6 · Total faux | §2 : 5+40+20+5+5 = 75 j, mais les lignes font 63 750 € et non 64 750 € | L'écart de 1 000 € va dans le sens du prestataire. La TVA et le TTC sont calculés sur le faux total : 12 950 € et 77 700 € au lieu de 12 750 € et 76 500 €. | Devis corrigé et réémis |
| **Majeur** | R7 · Échéancier à 110 % | §3 : 40 % + 40 % + 30 % | Sur le total affiché, cela donne 71 225 € HT, soit 6 475 € de plus. Le jalon « livraison de la plateforme » n'est pas défini. 80 % sont versés avant toute recette. | Échéancier à 100 %, jalons adossés à un PV de recette signé, 30 % maximum à la commande |
| **Majeur** | R8 · Deux mécanismes de facturation | §2 (mensuel au temps passé) contre §3 (échéancier en % d'un forfait) | Risque de double facturation, ou de choix du mécanisme le plus favorable au prestataire. | Un seul mécanisme : forfait plafonné et jalons |
| **Majeur** | R9 · Recette | §8 : « La mise en production vaut recette. » | Pas de période de test, de PV, de niveaux de défauts ni de re-test. Le prestataire choisit la date de mise en production. Elle déclenche à la fois la recette, 30 % du prix et la maintenance à 1 200 €/mois. | Clause « Recette » et garantie de 3 mois |
| **Majeur** | R10 · Coûts tiers à « 0 € » | §4 : « Hébergement : 0 €. Licences de l'API d'IA : 0 € » | Un coût inconnu est écrit 0 € au lieu de « à confirmer ». Une API d'IA est en général facturée à l'usage, donc soit vous recevrez une refacturation, soit le coût est noyé dans la maintenance. On ne sait pas qui paie après les 36 mois. | Clause « Coûts tiers » |
| **Majeur** | R11 · RGPD déclaratif | §9 : « Digitalis est conforme au RGPD. » | Ni accord de sous-traitance (art. 28), ni sous-traitants (dont le fournisseur d'IA), ni lieu d'hébergement. Rien sur les données envoyées au modèle d'IA ni sur la supervision humaine. | Clause « Données personnelles » |
| **Majeur** | R12 · Périmètre marketing | §1 : « plateforme complète… propulsée par l'IA » | Aucune exigence testable, aucune exclusion, aucune hypothèse. Le logiciel comptable n'est pas nommé, et on ne sait pas si le connecteur est natif ou sur mesure. En régie, le flou se paie en jours. | Matrice d'exigences, exclusions et hypothèses écrites |
| **Majeur** | R13 · Absents du document | Aucun § sur les délais, les pénalités, la garantie, la responsabilité, la sécurité ou la sauvegarde | Aucune date de livraison, donc aucune pénalité possible. Aucun plafond de responsabilité, aucune RC Pro, aucun test de restauration. | Voir « Clauses manquantes » |
| **Mineur** | R14 · Devis expiré | Date du 02/09/2026, validité de 15 jours, soit jusqu'au 17/09/2026 (aujourd'hui : 24/09/2026) | Les conditions ne sont plus garanties. | Réémission avec les corrections |
| **Mineur** | R15 · Hygiène | Pas de SIREN/SIRET, de n° de TVA ni d'adresse complète. Pas de pagination. TJM unique de 850 € sans profils. « Bon pour accord » sans dire ce que la signature commande. | Identité non vérifiable. Impossible de savoir qui travaille, ni à quel niveau. | Mentions légales, profils par ligne, signature qui vise le forfait plafonné |

## Clauses manquantes

Les formulations 1 à 6 viennent de la bibliothèque du plugin. Les autres sont mes propositions (adaptez montants et délais).

1. **Plafond de prix** : « Aucune somme supérieure au montant total HT du présent contrat ne peut être facturée au Client sans un avenant préalablement accepté par écrit. Le nombre de jours indiqué est un engagement du Prestataire, pas une base de facturation en régie. »
2. **Dépôt et comptes** : « Le dépôt de code source, les comptes d'hébergement, le nom de domaine et les comptes des magasins d'applications sont ouverts au nom du Client dès le démarrage. Le Prestataire y dispose d'accès délégués, révocables par le Client. »
3. **Cession PI** : « Les droits patrimoniaux sur les développements spécifiques sont cédés au Client au fur et à mesure des paiements, pour le monde entier et pour la durée légale des droits. Les composants préexistants du Prestataire font l'objet d'une licence perpétuelle, irrévocable et transmissible. »
4. **Recette** : « Le Client dispose de 10 jours ouvrés pour recetter chaque lot. Les anomalies bloquantes sont corrigées sous 10 jours ouvrés, suivies d'une nouvelle recette de 5 jours ouvrés. La recette est prononcée par procès-verbal signé ; à défaut de réserve motivée dans le délai, elle est réputée acquise. »
5. **Réversibilité** : « À la fin du contrat, quelle qu'en soit la cause, le Prestataire remet sous 15 jours ouvrés le code source, la documentation d'exploitation, les accès et un export des données dans un format ouvert, et assure une période de transition de 10 jours ouvrés. »
6. **Sortie** : « Pendant les 3 premiers mois, chaque Partie peut résilier sans indemnité ; les sommes versées restent acquises et les livrables payés appartiennent au Client. »
7. **Coûts tiers** : « Les tarifs des éditeurs tiers sont indiqués au tarif public relevé le JJ/MM/AAAA, susceptibles d'évolution et confirmés à la souscription. Tout poste tiers dont la grille n'est pas connue est indiqué "à confirmer". »
8. **Données personnelles** : « Aucun accès aux données personnelles réelles n'intervient avant la signature d'un accord de sous-traitance conforme à l'article 28 du RGPD, listant les sous-traitants ultérieurs et les lieux d'hébergement. »
9. **Maintenance optionnelle** : « La maintenance est souscrite séparément à l'issue de la garantie, pour 12 mois, reconductible tacitement par période de 12 mois, résiliable par le Client avec un préavis de 3 mois sans indemnité. »
10. **Garantie** : « Pendant 3 mois à compter de la recette définitive, le Prestataire corrige gratuitement toute non-conformité. »
11. **Délais et pénalités** : « Livraison contractuelle au JJ/MM/AAAA. En cas de retard imputable au Prestataire, pénalité de 0,5 % du prix HT par semaine de retard, plafonnée à 10 %. »
12. **Responsabilité et assurance** : plafond de responsabilité au moins égal au montant du contrat, attestation RC Pro avec le montant garanti.
13. **Sécurité et IA** :
    - test de restauration des sauvegardes ;
    - revue de sécurité (OWASP) ;
    - authentification à deux facteurs ;
    - fournisseur d'IA, lieu de traitement et supervision humaine nommés ;
    - une IA d'aide à la décision, non décisionnaire.

## Positionnement prix

**Aucun repère fiable ni sourcé n'est disponible ici.** Le serveur MCP `prix-logiciel` n'a pas pu se connecter (`ENOTFOUND mcp.jaikin.eu`), donc ni `position_quote` ni `daily_rates` n'ont tourné. Je n'invente aucun benchmark.

Seuls les ratios calculés depuis le devis sont sûrs :
- La maintenance annuelle (14 400 €) représente environ 22,6 % du prix de développement recalculé.
- Les 36 mois de maintenance (43 200 €) représentent environ 68 % de ce prix.
- Le TJM de 850 € HT est uniforme sur toutes les lignes, sans distinction de profil.

Une fois le serveur rétabli, relancez `/software-buyer-france:review-quote` pour obtenir les références publiques et privées.

## Questions à envoyer au prestataire

1. Confirmez-vous un forfait plafonné, sans aucune facturation au-delà du total sans avenant signé ?
2. Le total est-il de 63 750 € ou de 64 750 € HT ? Pouvez-vous réémettre le devis, dont la validité a expiré le 17/09/2026 ?
3. Quel est l'échéancier exact, sachant que 40 + 40 + 30 font 110 % ? Quel événement précis déclenche « livraison de la plateforme » ?
4. Comment s'articulent la facturation mensuelle au temps passé (§2) et l'échéancier (§3) ?
5. Qui intervient (profils et séniorité) pour un TJM unique de 850 € ?
6. À quelle date et dans quelles conditions le code nous est-il cédé ? Le dépôt peut-il être ouvert à notre nom dès le démarrage ?
7. Pourquoi la maintenance est-elle obligatoire sur 36 mois ? Que couvre-t-elle (périmètre, délais de réponse, correctifs de sécurité, hébergement, IA) ?
8. Que recouvrent exactement « Hébergement : 0 € » et « Licences de l'API d'IA : 0 € » ? Quel fournisseur d'IA, quelle localisation, quel coût d'usage estimé, et qui le paie après la mise en production ?
9. Les comptes d'hébergement peuvent-ils être à notre nom ? Sinon, quel export de données et quelle documentation, dans quels délais ?
10. Pouvez-vous fournir un accord de sous-traitance (art. 28) avec la liste des sous-traitants ultérieurs et les lieux d'hébergement ?
11. Quelle date de livraison contractuelle, quelles pénalités de retard, quelle garantie après recette ?
12. Quel montant de RC Pro, et pouvez-vous fournir l'attestation ?
13. Quel logiciel comptable est visé ? Le connecteur est-il natif ou sur mesure, et pourquoi 5 jours ?
14. Quels sont votre SIREN et votre n° de TVA intracommunautaire ?

Je peux transformer ces points en e-mail de contre-proposition, ou lancer `/software-buyer-france:vendor-questions` pour préparer l'échange.
