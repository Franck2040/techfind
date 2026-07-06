---
name: senior-dev-discipline
description: Discipline d'un développeur senior. À charger AVANT toute écriture de code sur ce projet. Corrige les 3 échecs typiques des IA — hypothèses fausses silencieuses, sur-ingénierie, modifications hors-scope — et impose sécurité, lisibilité et vérification réelle.
---

# Discipline dev senior — règles non négociables

Ce projet doit être codé comme par une **équipe pro**, pas comme un dump de code d'IA.
Applique ces règles à chaque tâche.

## 1. Ne JAMAIS avancer sur une hypothèse non vérifiée
Les IA échouent surtout en devinant en silence puis en fonçant.
- Si une donnée manque (nom d'un champ, format d'API, comportement attendu), **vérifie dans le code** (Grep/Read) avant de coder. Si ce n'est pas trouvable, **demande** — ne devine pas.
- Avant de modifier une fonction, lis d'abord ses appelants. Un changement de signature casse le reste.
- Ne suppose jamais qu'une librairie existe : vérifie `package.json` avant d'`import`.

## 2. Anti sur-ingénierie (le piège du « 50 lignes → 500 »)
- Écris **le code le plus simple qui résout le besoin réel**. Pas d'abstraction « au cas où ».
- Pas de patterns inutiles (factory/manager/wrapper) tant qu'il n'y a pas 3 cas concrets qui le justifient.
- Pas de dépendance nouvelle si 15 lignes de code standard suffisent.
- Réutilise l'existant (composants, hooks, utils) avant d'en créer un nouveau.

## 3. Rester dans le scope
- Ne touche **que** ce que la tâche demande. Pas de refactor opportuniste d'un fichier voisin.
- Si tu repères un autre problème, **note-le** au lieu de le corriger en même temps.
- Ne reformate pas des fichiers entiers : garde les diffs petits et relisibles.

## 4. Sécurité par défaut (pas « ça marche donc c'est bon »)
Le piège classique : coder la fonctionnalité, voir que « ça marche », et négliger la sécu.
- **Jamais** de secret/clé API en dur ni côté client → variables d'environnement serveur uniquement.
- **Toute** entrée utilisateur est validée côté serveur (schéma Zod), jamais seulement côté client.
- Voir le skill `ecommerce-security` avant tout formulaire, auth, paiement ou appel API.

## 5. Lisibilité et maintenabilité (le code sera modifié par un humain)
- Commentaires **en français**, utiles : expliquent le *pourquoi*, pas le *quoi* évident.
- En tête de chaque composant/module : un bloc court « À quoi ça sert / Props / Où le modifier ».
- Noms explicites. Pas d'abréviations obscures. Une fonction = une responsabilité.
- TypeScript strict : pas de `any` silencieux ; typer les props et les retours d'API.

## 6. Vérifier réellement, ne pas prétendre
- Après une fonctionnalité : `npm run build` doit passer, `npm run lint` propre.
- Ne déclare jamais « c'est fait et testé » sans avoir lancé la vérification. Si un test échoue, le dire avec la sortie.
- Fais relire par `/code-review` puis `/security-review` avant de considérer une étape terminée.

## Checklist avant de dire « terminé »
- [ ] Répond exactement au besoin, rien de plus (scope).
- [ ] Aucune hypothèse non vérifiée restante.
- [ ] Entrées validées côté serveur, aucun secret exposé.
- [ ] `build` + `lint` passent.
- [ ] Code commenté (pourquoi) + bloc d'en-tête « où modifier ».
- [ ] Revue `/code-review` et `/security-review` faites.
