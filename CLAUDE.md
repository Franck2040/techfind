# Techfind — Guide du projet (à lire à chaque session)

E-commerce **Techfind** (produits tech, Cameroun). Objectif : site **pro, sécurisé, commenté, maintenable, responsive, épuré et moderne**, codé comme par une vraie équipe — pas un dump d'IA.

## Stack
- **Next.js 16 (App Router) + React 19 + TypeScript strict + Tailwind CSS v4**
- Base de données : **Prisma + SQLite** (commutable PostgreSQL). Auth : **session maison + bcrypt** (cookie httpOnly).
- Validation : **Zod**. État panier : React Context + `localStorage`.
- Polices : Poppins (titres) + Inter (corps) via `next/font`.

## ⚠️ Next.js 16 — pièges (voir AGENTS.md ; doc dans node_modules/next/dist/docs)
- **Tailwind v4** : configuration **CSS** via `@import "tailwindcss"` + `@theme { --color-...; --font-... }`. **Pas** de `tailwind.config.js`.
- **`cookies()`, `headers()`, `params`** sont **async** → toujours `await`.
- **Middleware renommé `proxy.ts`** (racine `src/`). Ne pas y gérer la session complète.
- **Server Actions** : `'use server'`, vérifier l'**auth/permission DANS chaque action** (elles sont appelables par POST direct). `redirect` depuis `next/navigation`, `revalidatePath` depuis `next/cache`.
- En-têtes de sécurité : via `headers()` dans `next.config.ts`.

## Skills projet — les CHARGER selon la tâche
- `senior-dev-discipline` → avant toute écriture de code (anti hypothèses fausses, anti sur-ingénierie, anti hors-scope).
- `frontend-ui-ux` → avant tout composant/page/style (design system Techfind : palette, typo, patterns, responsive).
- `ecommerce-security` → avant tout formulaire, auth, panier, paiement, API, données.

## Conventions non négociables
1. **Commentaires en français**, orientés « pourquoi » + un bloc d'en-tête par composant : *rôle / props / où modifier*. Le code sera modifié à la main par le propriétaire.
2. **Réutilisation** : Header, Footer, ProductCard, Button, etc. définis **une seule fois**, importés partout. Pas de copier-coller.
3. **Tokens de design** centralisés (Tailwind config / CSS vars). Jamais de hex en dur dispersé.
4. **Sécurité par défaut** : entrées validées côté serveur, aucun secret côté client, montants recalculés serveur.
5. **Vérifier vraiment** : `npm run build` + `npm run lint` doivent passer ; puis `/code-review` et `/security-review` avant de dire « terminé ».
6. **Scope** : ne modifier que ce que la tâche demande ; noter les autres idées au lieu de les coder.

## Données maquette (Figma)
- Réf. web 1728px, mobile 440px. La maquette n'est pas parfaite → harmoniser (header unifié navy, etc.) en gardant l'essentiel.
- Contact réel : tél +237 686 85 05 54, email kenmeugnetchoupo@gmail.com, Yaoundé (Titi Garage) & Douala. Prix en **FCFA**.

## Pages
Accueil · Produits (+filtres) · Aperçu produit · Panier · Paiement · Profil/Compte · Création de compte · Connexion · À propos · Nous contacter.

## Structure (cible)
```
src/
  app/            # routes (App Router)
  components/     # UI réutilisable (ui/, layout/, product/, ...)
  lib/            # utils, validation zod, données mock
  context/        # panier, etc.
  styles/         # tokens globaux
```
