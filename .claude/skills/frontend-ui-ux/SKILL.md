---
name: frontend-ui-ux
description: Design system Techfind + règles UI/UX front-end pro. À charger avant de créer/modifier un composant, une page ou un style. Contient la palette exacte, la typo, l'espacement, les patterns de composants et les règles responsive/accessibilité du site e-commerce Techfind.
---

# Design System Techfind + règles front-end

Reproduis fidèlement la maquette Figma, mais harmonise les incohérences (la maquette n'est pas parfaite).
Objectif : moderne, épuré, responsive, cohérent.

## 1. Palette (tokens — codes tirés du Figma)
Définis-les en variables CSS / config Tailwind, ne les code jamais en dur ailleurs.
- `--navy` #003F62 — header, footer, titres, texte fort
- `--navy-2` #1B5A7D — liens, hover, sous-titres
- `--orange` #EDA415 — CTA principal, prix, accents
- `--orange-light` #FFAD33 — hover CTA, badges
- `--blue` #58A0E2 — texte promo
- `--sky` #B3D4E5 / `--sky-soft` #E2F4FF — fonds sections, checkbox, en-têtes tableau
- `--red` #DB4444 — actions destructives, erreurs
- `--green` #3AAE3F — logo « find », état « En stock »/succès
- Neutres : `--ink` #222222, `--muted` #606060, `--border` #D9D9D9, `--surface` #F5F5F5, `--white` #FFFFFF

## 2. Typographie
- Titres : **Poppins** (600/700), très arrondi, comme la maquette.
- Corps : **Inter** (400/500), lisible.
- Échelle : h1 ~40-56px, h2 ~28-32px, h3 ~20-22px, corps 16px, small 14px.
- Charger via `next/font/google` (perf + pas de FOUT).

## 3. Composants récurrents (à factoriser une seule fois)
- **Header** : barre navy (logo pilule blanche « Techfind » T noir + « find » vert, recherche centrale arrondie + bouton orange « Search », « se connecter » + « Panier » badge). 2e barre blanche : « Parcourir » (orange), Accueil, Qui sommes nous ?, Nous contacter, Nos Magasins, Suivez votre colis. → **une seule version cohérente** sur toutes les pages (la maquette varie, on unifie sur le header navy).
- **Footer** : navy, bloc newsletter blanc (input + bouton orange envoyer), 3 colonnes de liens (Parcourir / Besoin d'aide / Mieux nous connaître), adresse + réseaux, copyright.
- **ProductCard** : image, cœur (wishlist) + œil (aperçu rapide), barre « Ajouter au panier » (orange), nom (navy), prix (orange), étoiles + nb d'avis. Une seule implémentation, réutilisée partout.
- **Boutons** : primaire = orange plein, rayon large ; secondaire = contour ; danger = contour rouge. États hover/focus/disabled obligatoires.
- **Bandeau promo** : fond sombre, image produit, pill « Nouvelle arrivage », « Jusqu'à 50% De réduction » (bleu), bouton orange.
- **Auth** : illustration à gauche (cercle bleu clair), carte à droite (logo, Google/Facebook, séparateur OU, champs, bouton sombre, lien secondaire). Prix en FCFA partout.

## 4. Responsive (mobile-first)
- Breakpoints : mobile <640, tablette 640-1024, desktop >1024. Maquette de référence : mobile 440px, desktop 1728px.
- Carrousels horizontaux sur mobile (produits, catégories, témoignages) ; grilles sur desktop.
- Menu : barre complète en desktop, **tiroir hamburger** en mobile (voir écran « Menu Open Frame »).
- Filtres produits : sidebar gauche en desktop, **tiroir/bottom-sheet** en mobile.
- Jamais de scroll horizontal involontaire ; images `next/image` responsive.

## 5. Accessibilité & qualité (non négociable)
- HTML sémantique (`header/nav/main/section/footer`, `button` vs `a`).
- Tout élément interactif focusable, `:focus-visible` visible, navigable clavier.
- `alt` sur les images, `aria-label` sur les icônes seules, contrastes AA.
- Pas de valeur codée en dur dispersée : passe par les tokens et des composants réutilisables.
- Chaque composant : bloc d'en-tête commenté « rôle / props / où modifier » (voir [[senior-dev-discipline]]).
