## Maturité

**6/30. Le cahier des charges n'est pas encore chiffrable.** Il liste neuf souhaits, mais aucun processus, volume, priorité ni critère d'acceptation. Deux exigences se contredisent (le stock, voir décision 1). Le « devis ferme sous 10 jours » ne peut donc pas être tenu. Les prestataires refuseront, ajouteront une marge de risque, ou chiffreront chacun un projet différent.

## Décisions à prendre avant chiffrage

1. **Qui est le maître du stock ?** Le besoin 2 (« Gérer le stock de bois et de quincaillerie ») contredit le besoin 6 (« on garde StockPro »). Deux systèmes de stock donnent deux maîtres.
   - **A. StockPro maître, l'ERP le lit.** Pas de module stock à payer ni à paramétrer côté ERP, mais tout dépend de l'API de StockPro (voir Intégrations).
   - **B. ERP maître, StockPro abandonné.** Il faut chiffrer la reprise et l'accompagnement du changement. On économise la licence StockPro, et le besoin 6 disparaît.
   - **C. Synchronisation bidirectionnelle.** C'est l'option la plus chère et la plus fragile (règles de conflit, écarts permanents). Je la déconseille.
2. **ERP standard configuré ou développement sur mesure ?**
   - Le standard se chiffre en licences par utilisateur, paramétrage et adaptations. Le sur mesure coûte un ordre de grandeur de plus et crée une dépendance au prestataire (code, maintenance).
   - Trois exigences risquent de sortir du standard : l'application poseurs (mode hors ligne), la planification d'atelier avec charge/capacité, et l'IA.
   - Demandez aux prestataires « standard + écarts chiffrés séparément », plutôt que de laisser ces exigences se diluer dans un « ERP complet ».
3. **IA : pour résoudre quel problème ?** « Avec de l'IA » (Contexte) et « optimiser la production » (§9) ne sont pas une exigence.
   - **Option 1 :** la sortir du lot 1 et la mettre au backlog V2, une fois l'historique nettoyé.
   - **Option 2 :** la limiter à un cas d'usage mesurable, en lot optionnel séparé.
   - Sans cette décision, l'IA devient une ligne de marge dans les devis. Elle soulève aussi la question du rôle Boisel au sens du règlement européen sur l'IA (déployeur, supervision humaine) et du lieu d'exécution de l'inférence.
4. **Quel historique migrer ?** « Reprendre l'historique » est un projet à part entière.
   - **Minimal :** clients, articles, tarifs, commandes et devis en cours.
   - **Étendu :** plusieurs années de factures et de mouvements de stock, depuis des sources non précisées.
   - Le périmètre étendu est le premier poste de dérive de coût. Pour l'ancien historique, une archive en lecture seule peut suffire. Les pièces comptables ont une durée de conservation légale (10 ans). Il faut aussi décider qui nettoie les données.
5. **Comptabilité et facturation électronique.** Le logiciel comptable n'est même pas nommé (besoin 7).
   - Il faut décider quel outil est maître pour la facturation et la comptabilité, et par quelle plateforme agréée (PA) passent l'émission et la réception des factures.
   - Selon le calendrier légal que je connais (réception pour toutes les entreprises depuis le 1er septembre 2026, émission pour les PME au 1er septembre 2027), c'est structurant pour les besoins 1 et 7. **À confirmer avec votre expert-comptable.**
   - Avec un flux structuré via la PA, la « saisie automatique » des factures fournisseurs n'a plus forcément besoin d'OCR.
6. **Hébergement : rien n'est dit.**
   - Les données en jeu : clients (particuliers ?), salariés (planning, éventuellement géolocalisation et photos de chantiers), données financières. Pas de donnée de santé a priori, donc pas d'obligation HDS.
   - Options : SaaS éditeur, cloud souverain UE, hyperscaler, on-premise (à chiffrer séparément si demandé). Avec 2 sites et des poseurs mobiles, l'on-premise coûte cher (accès externe, sauvegarde hors site, exploitation).
   - Je manque d'éléments pour trancher (exigences de vos clients, compétences IT internes). Je peux lancer le skill `hosting-decision`.
7. **Budget et modèle de réponse.** « À définir selon les propositions » et « devis ferme sous 10 jours » ne vont pas ensemble.
   - Donnez au minimum une enveloppe ou un plafond. Sinon les offres ne portent pas sur le même projet et ne sont pas comparables.
   - Remplacez la demande en deux temps : sous 10 jours, une estimation en fourchette par lot avec les hypothèses listées. Ensuite, après un cadrage payé, un devis ferme par lot.
   - Précisez aussi la propriété du code et des comptes (au nom de Boisel), la maintenance attendue et la réversibilité.
8. **Quelle échéance métier, et quels lots ?** « Dès que possible » n'est pas une date. Est-ce une saison de pose, une clôture, la fin de contrat de StockPro, ou une échéance légale de facturation électronique ? La réponse fixe l'ordre des lots et le mois de bascule. Évitez une bascule comptable en période chargée.

## Scores par rubrique

| Rubrique | Score | Preuve (§) | Ce qui manque |
|---|---|---|---|
| 1. Contexte et objectif | 1 | « ERP moderne, simple et complet, avec de l'IA » (Contexte) | Résultat mesurable attendu, 3 indicateurs de succès |
| 2. Utilisateurs et rôles | 1 | « 45 salariés, 2 sites », « poseurs » (Contexte, §4) | Utilisateurs nommés/simultanés par profil, droits, sites |
| 3. Processus | 0 | Aucun ; §1 à 4 sont des intitulés de fonctions | Processus actuel et cible, volumes (devis, commandes, factures par mois) |
| 4. Exigences fonctionnelles | 1 | 9 besoins numérotés (Besoins) | Priorités (must/should/could), critères testables |
| 5. Données | 0 | Aucune entité ni volume ; « Reprendre l'historique » (Données) | Entités, volumes, sources, propriétaire, maître par donnée (stock : contradiction §2/§6) |
| 6. Migration | 1 | « Reprendre l'historique » (Données) | Périmètre, source, qualité, nettoyage, répétition à blanc, bascule et retour arrière |
| 7. Intégrations | 1 | StockPro (§6), logiciel comptable non nommé (§7) | Sens, fréquence, disponibilité d'API vérifiée, outil comptable à nommer |
| 8. Non-fonctionnel | 1 | « rapide et intuitif » (§5) | Seuils mesurables, usage hors ligne poseurs, appareils, disponibilité |
| 9. Hébergement et sécurité | 0 | Absent | Modèle d'hébergement, authentification, sauvegardes et test de restauration |
| 10. Conformité | 0 | Absent | RGPD, rôle règlement IA (§9), facturation électronique, conservation légale |
| **Total (1 à 10)** | **6/30** | | |
| 11. Recette (non comptée) | 0 | Absent | Cas réels, testeurs métier disponibles, procès-verbal de recette |
| 12. Planning et gouvernance (non compté) | 1 | « dès que possible » (Planning) | Échéance métier et sa raison, jalons, décideur joignable, accès aux données en semaine 1 |
| 13. Budget et contrat (non compté) | 1 | « devis ferme » (Réponse attendue), budget « à définir » | Fourchette ou plafond, forfait par lot, propriété du code et des comptes, maintenance, réversibilité |

## Intégrations

| Système | Besoin | API / import / connecteur natif | Statut | Question à poser |
|---|---|---|---|---|
| StockPro | §6 : synchronisation automatique du stock | Inconnu. Je n'ai aucune information vérifiée, et je ne suppose pas qu'une API existe. | **À vérifier auprès de l'éditeur de StockPro** | Existe-t-il une API (lecture et écriture) ou un import/export ? Quelles entités (articles, niveaux, mouvements, 2 sites) ? Quelle édition de licence donne accès à l'API ? Y a-t-il un connecteur natif vers l'ERP visé ? Quelle taille d'éditeur et quel contrat de support ? |
| Logiciel comptable (non nommé) | §7 : saisie automatique des factures fournisseurs | Inconnu, l'outil n'est pas identifié | **À vérifier, l'outil est à nommer d'abord** | Quel logiciel, quelle version, cloud ou poste ? Import d'écritures ou API ? Module de capture natif ? L'expert-comptable est-il d'accord et qui administre l'outil ? |
| Plateforme agréée de facturation électronique | §1 et §7 (implicite, non citée) | Inconnu | **À vérifier** | Quelle PA (celle de l'ERP, du logiciel comptable, une autre) ? Quels formats de factures ? |
| Autres outils non cités | Non mentionnés | Inconnu | **À inventorier** | Y a-t-il de la CAO/optimisation de débit, des machines à commande numérique, de la paie, un CRM, un site web, une banque à interfacer ? |

**Plan de repli à demander pour chaque outil sans API :** le prestataire vérifie en semaine 1. Sinon il propose un fichier d'import (plan B), un passage par un autre outil connecté (plan C), ou une saisie manuelle assistée (plan D). Ce constat doit être livré dans le devis.

## Exigences à réécrire

Les valeurs entre `[ ]` sont à fixer par Boisel. Les priorités sont des propositions à confirmer.

| Original (§) | Version testable | Critère d'acceptation | Priorité |
|---|---|---|---|
| Besoins 1 : « Gérer les devis, les commandes et la facturation » | Le chargé d'affaires crée un devis depuis un catalogue et l'envoie en PDF. Un devis accepté devient une commande sans ressaisie. Le système émet les factures (types à lister : acompte, solde…) au format et via la PA choisie. | 10 cas réels fournis par Boisel : prix conformes à la grille, 0 champ ressaisi devis→commande, facture de test acceptée par la PA | Must |
| Besoins 2 + 6 : stock et « synchronisation automatique avec StockPro » (selon décision 1, option A) | Tout mouvement de stock saisi dans StockPro (entrée, sortie, transfert entre sites) est visible dans l'ERP en ≤ `[X]` min. Un rejet apparaît dans un journal consultable. | 100 mouvements de test : 0 écart, 0 doublon. Un rejet volontaire est visible dans le journal. | Must, sous réserve de la vérification d'API |
| Besoins 3 : « Planifier l'atelier » | Le chef d'atelier voit la charge par poste et par semaine. Il réaffecte une commande et voit la date de livraison recalculée. | Semaine témoin reconstituée à partir de `[N]` commandes réelles. Recalcul en ≤ `[X]` s. | Should |
| Besoins 4 : « Une application pour les poseurs » | Le poseur consulte ses chantiers du jour (adresse, contact, plans), fonctionne hors réseau `[oui/non, à décider]`, clôture l'intervention avec photos et signature client. L'ERP la reçoit ≤ `[X]` min après retour du réseau. | Test sur 3 chantiers réels dont un en zone sans réseau, avec `[N]` poseurs | Should (à confirmer) |
| Besoins 5 : « rapide et intuitif » | **Performance :** les listes (devis, commandes, stock) s'affichent en ≤ `[2]` s pour `[N]` utilisateurs simultanés. **Prise en main :** après `[2]` h de formation, un utilisateur réalise seul 5 tâches types en ≤ `[X]` min. | Test avec 3 utilisateurs réels, taux de réussite ≥ `[80]` % | Must |
| Besoins 7 : « Saisie automatique des factures fournisseurs » | Une facture fournisseur (PDF ou flux structuré) crée une écriture pré-remplie (fournisseur, date, HT/TVA/TTC, échéance, compte proposé) dans `[logiciel]`. Validation humaine `[obligatoire / au-dessus de X €]`. | Lot de 50 factures réelles : ≥ `[90]` % des champs corrects sans correction, 0 écriture créée sans la validation prévue | Should |
| Besoins 8 : « Tableau de bord pour la direction » | Le dirigeant voit sur une page `[5 à 8]` indicateurs listés (par exemple CA facturé du mois, carnet de commandes, marge par affaire, charge atelier), filtrables par site, mis à jour `[chaque nuit]`. | Formule de chaque indicateur écrite et validée. Valeurs du dernier mois clos = chiffres de l'expert-comptable à ±`[1]` %. | Should |
| Besoins 9 : « IA pour optimiser la production » | Hors lot 1. Si retenu : un cas d'usage unique (par exemple prédire le délai de fabrication d'une commande). Supervision humaine, données traitées dans l'UE. | Erreur moyenne ≤ `[X]` jours sur `[N]` commandes non vues, meilleure que l'estimation actuelle du chef d'atelier | Could |
| Données : « Reprendre l'historique » | Les `[clients, articles, tarifs, commandes en cours, devis des N dernières années]` depuis `[source]` sont importés. Les rejets sont listés. Répétition à blanc puis bascule avec retour arrière prévu. | À blanc : 100 % des clients actifs importés, totaux par année = comptabilité à ±`[X]` %, rapport de rejets validé par Boisel avant bascule | Must (données en cours), Could (ancien historique) |

## Risques

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Deux maîtres pour le stock (§2 contre §6) | Certaine telle qu'écrite | Élevé | Trancher la décision 1, une seule source de vérité, l'autre système lit |
| Outil sans API ni import (StockPro, logiciel comptable) | Élevée : rien n'est vérifié | Élevé | Question à l'éditeur en semaine 1, plans B/C/D, constat livré dans le devis |
| Dérive de périmètre et devis incomparables (« complet », « IA », pas de priorités, pas de budget) | Élevée | Élevé | Priorités must/should/could, backlog V2, journal de décisions, avenant pour tout ajout |
| Qualité des données et migration de l'historique | Moyenne à élevée | Élevé | Référentiel v0 tôt, règles de nommage, import avec rejets explicites, répétition à blanc |
| Bascule comptable et facturation électronique mal calée | Moyenne | Élevé | Bascule en mois calme, un cycle en parallèle, contrôle de l'expert-comptable, PA choisie avant le développement |
| Testeurs métier indisponibles (chef d'atelier, direction) et accès non fournis | Moyenne | Moyen | Créneaux courts sur cas réels de la semaine, recette hors période de pointe, liste d'accès envoyée avec la commande |
| Engagement financier trop tôt (gros lot avant toute valeur livrée) | Moyenne | Moyen | Phases courtes payables séparément, pas d'engagement au-delà de 3 mois sans jalon payé |

## Suite proposée

1. Boisel tranche au minimum les décisions 1, 3, 4, 5 et 7. Ce sont elles qui font varier le prix.
2. Vérification, à faire par Boisel dès maintenant : StockPro et le logiciel comptable (API ou import).
3. Je peux produire un plan corrigé du cahier des charges à partir de ces décisions, lancer `hosting-decision` pour l'hébergement, ou préparer les questions aux prestataires avec `/software-buyer-france:vendor-questions`.
