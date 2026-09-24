## Recommandation

**Choisir l'offre B (Terrain Studio)**, sous réserve des points à négocier plus bas.

1. **B est la seule qui couvre le besoin exprimé.** Vos techniciens travaillent en zones rurales sans réseau, font signer le client sur place et sont suivis au bureau. A ne couvre ni le mode hors connexion, ni la signature, ni le back-office. Son prix de 28 000 € correspond donc à un périmètre plus petit, pas à une meilleure affaire.
2. **B a un risque borné.** Son forfait est plafonné, et toute somme supplémentaire exige un avenant signé. A facture au temps passé sur une « estimation » de 40 jours, sans plafond.
3. **B vous laisse la maîtrise.** Comptes stores, dépôt de code et hébergement sont à votre nom dès le démarrage, et la maintenance est résiliable avec 3 mois de préavis. Chez A, vous n'avez qu'une licence d'utilisation, les stores sont dans le compte du prestataire, et la maintenance à 900 € HT/mois vous engage 24 mois.

## Couverture du périmètre

| Besoin / lot | Offre A (AppFactory) | Offre B (Terrain Studio) |
|---|---|---|
| iOS + Android | Couvert | Couvert |
| Formulaire d'intervention | Couvert | **À confirmer** (non listé explicitement) |
| Photos | Couvert | Couvert |
| Mode hors connexion (besoin critique) | **Non couvert** | Couvert, avec synchronisation |
| Signature du client sur place | **Non couvert** (non mentionnée) | Couvert |
| Back-office / suivi au bureau | **Non couvert** (« à chiffrer ultérieurement ») | Couvert (web) |
| Export des données | Non mentionné | Couvert |
| Publication sur les stores | Compte d'AppFactory | Compte du client |
| Recette / garantie | Non mentionnées | 10 j ouvrés par lot + PV ; garantie 3 mois |

## Coût sur 5 ans

| | Offre A | Offre B |
|---|---|---|
| Ponctuel | 28 000 € (estimation de 40 j, non plafonnée) | 46 000 € (forfait) |
| Périmètre manquant à ajouter | **À chiffrer** (hors ligne, signature, back-office, export) | 0 € (formulaire d'intervention à confirmer) |
| Récurrent / an | 10 800 € (900 × 12) | 5 400 € (450 × 12), optionnel |
| Licences / an | Non chiffrées | Non chiffrées ; hébergement à votre nom, coût non indiqué |
| **Total 5 ans** | **82 000 €** + périmètre manquant + dépassements éventuels | **73 000 €** (46 000 € sans maintenance) |
| Prix plafonné ? | **Non** | **Oui** (avenant obligatoire) |

**Hypothèses**
- La maintenance est conservée 5 ans dans les deux cas, pour comparer à périmètre de service égal.
- Chez A, l'engagement ferme est de 28 000 + 24 × 900 = 49 600 €.
- Les comptes développeur Apple et Google (environ 99 USD/an et 25 USD une fois, prix catalogue à vérifier, susceptibles de changer) sont communs aux deux offres. Je les ai exclus des totaux.

**Les totaux ne sont pas comparables tels quels**, car les périmètres diffèrent. Voici le point d'équilibre :
- Le taux journalier implicite de A est de 28 000 / 40 = **700 €/j**.
- L'écart ponctuel avec B est de 18 000 €, soit environ **26 jours**. Si le périmètre manquant chez A représente plus de 26 jours, A dépasse B dès la livraison.
- Sur 5 ans, A est déjà 9 000 € au-dessus de B sans aucun ajout, à cause de la maintenance deux fois plus chère.
- Si vous arrêtiez la maintenance après 24 mois, l'écart serait de 7 200 € en faveur de A (49 600 € contre 56 800 € pour B avec 24 mois de maintenance). Il suffirait alors d'environ **10 jours** de périmètre manquant pour l'inverser.
- Le mode hors connexion avec synchronisation et un back-office web dépassent vraisemblablement 10 jours. C'est mon estimation, pas une donnée sourcée.

## Risque et propriété

| Critère | Offre A | Offre B |
|---|---|---|
| Plafond de prix | **Élevé** : régie, estimation non contractuelle | **Faible** : forfait, avenant obligatoire |
| Propriété | **Élevé** : licence d'utilisation, stores chez le prestataire | **Moyen-faible** : tout à votre nom, mais cession des droits « au fil des paiements » (donc partielle jusqu'au solde) |
| Recette | **Élevé** : rien de prévu | **Faible** : 10 j ouvrés par lot + PV (recette tacite non précisée) |
| Sortie | **Élevé** : 24 mois de maintenance obligatoires | **Faible** : résiliable avec 3 mois de préavis |
| Réversibilité | **Élevé** : rien de prévu | **Faible** : code, documentation et accès sous 15 j ouvrés (et déjà à votre nom) |
| Données | **Moyen-élevé** : rien de prévu, pas de back-office pour les recevoir | **Moyen** : export inclus, hébergement à votre nom, mais localisation et sous-traitance RGPD non précisées |
| **Synthèse** | 5 critères à risque élevé, 1 moyen-élevé | 0 élevé, 2 moyens, 4 faibles |

Aucune des deux offres n'indique de délai de livraison ni d'échéancier de paiement.

## Positionnement marché

**Pas de référence de marché fiable.** Le serveur MCP `prix-logiciel` n'a pas pu se connecter (`ENOTFOUND mcp.jaikin.eu`), donc je n'ai pas pu appeler `position_quote`. Vous pouvez relancer la comparaison une fois le serveur rétabli.

Je ne cite aucun prix de marché de mémoire. Le seul chiffre calculé est le taux implicite de A, 700 €/j. Pour B, je ne peux pas déduire de taux, car l'offre ne donne pas de nombre de jours.

## À négocier avant signature (avec B)

1. **Figer le périmètre par écrit.** Confirmer le formulaire d'intervention, qui n'est pas listé explicitement. Préciser aussi la gestion des conflits de synchronisation, le volume de photos, le nombre d'utilisateurs et les versions d'OS visées. Le plafond « sans avenant » ne protège que ce qui est défini.
2. **Cession des droits.** Remplacer « au fil des paiements » par une cession totale et exclusive au paiement du solde. Obtenir une licence perpétuelle et irrévocable pour les composants préexistants, et la liste des composants tiers et open source.
3. **Échéancier lié aux recettes.** Un paiement par lot validé par PV, avec une retenue de garantie (par exemple 10 %) jusqu'à la fin de la garantie.
4. **Recette.** Écrire noir sur blanc qu'il n'y a pas de recette tacite. Fixer la procédure de réserves et les délais de correction.
5. **Garantie.** Passer de 3 mois à 6-12 mois, avec correction gratuite des anomalies.
6. **Planning.** Ajouter des dates par lot et des pénalités de retard, car le délai est absent de l'offre.
7. **Hébergement et données.** Exiger une localisation dans l'UE, un contrat de sous-traitance RGPD (les signatures et photos sont des données personnelles), des sauvegardes et le coût d'hébergement chiffré. L'export doit se faire dans un format ouvert.
8. **Maintenance.** Préciser le contenu (correctif ou évolutif), les délais de prise en charge et un plafond d'indexation du tarif.
9. **Ventilation du forfait.** Demander les jours par lot et le tarif journalier, ce qui permettra un benchmark une fois `prix-logiciel` disponible. Fixer aussi un barème journalier applicable aux futurs avenants.

Si vous voulez garder AppFactory en concurrence, exigez qu'ils rechiffrent le même périmètre que B, à prix plafonné, avec le code et les comptes stores à votre nom. Sans cela, leur offre n'est pas comparable.
