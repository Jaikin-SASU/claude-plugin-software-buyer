# Critères de réussite des évaluations

## /review-quote evals/fixtures/devis-piege.md — doit détecter (blocking/major)
1. Régie déguisée : « estimation », facturation au temps passé, aucun plafond.
2. Échéancier à 110 % (40 + 40 + 30).
3. Code propriété du prestataire, licence liée à la maintenance ; hébergement au nom du prestataire.
4. Maintenance obligatoire 36 mois + tacite reconduction 36 mois + préavis 6 mois.
5. Résiliation = toutes les mensualités restantes.
6. « La mise en production vaut recette » : pas de recette.
7. « 0 € » sur l'hébergement et l'API d'IA.
8. RGPD : aucune DPA ; données envoyées à une API d'IA non précisée.
9. Périmètre marketing (« propulsée par l'IA », « complète ») non testable.

## /review-spec evals/fixtures/cahier-des-charges-piege.md — doit détecter
1. Hébergement non tranché (à décider avant chiffrage).
2. Aucun critère de recette.
3. Deux maîtres du stock (ERP + StockPro gardé) → règle « un seul maître ».
4. API de StockPro et du logiciel comptable non vérifiées (nom du logiciel comptable absent).
5. Exigences non testables (5, 9 : « rapide », « IA pour optimiser »), pas de priorités.
6. Migration « reprendre l'historique » non définie.
7. Pas de date métier ni de budget ; « devis ferme sous 10 jours » sur un périmètre non cartographié → recommander un cadrage.

## /compare-offers evals/fixtures/offres-a-comparer.md — doit conclure
- Offre B recommandée : A n'a pas de hors connexion ni de back-office (besoin exprimé), A est en régie non plafonnée, stores au nom d'A, engagement de maintenance.
- Coût sur 5 ans calculé à périmètre égal (A + back-office à chiffrer, maintenance 24 mois obligatoire).
