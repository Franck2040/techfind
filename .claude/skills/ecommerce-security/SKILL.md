---
name: ecommerce-security
description: Checklist de sécurité e-commerce (OWASP) pour Techfind. À charger AVANT tout formulaire, authentification, panier, paiement, API route ou manipulation de données/argent. Empêche les failles classiques que les IA laissent passer en privilégiant « ça marche » à « c'est sûr ».
---

# Sécurité e-commerce — règles Techfind

Le piège à éviter : coder la fonctionnalité, voir que « ça marche », et négliger la sécurité.
Ici la sécurité fait partie de « terminé ». Applique selon le contexte.

## 1. Secrets & configuration
- **Aucun** secret/clé API dans le code ou côté client. Uniquement variables d'env serveur.
- Préfixe `NEXT_PUBLIC_` = exposé au navigateur → n'y mettre QUE du public.
- Commit un `.env.example` (sans valeurs) ; `.env*` dans `.gitignore`. Vérifier avant chaque push qu'aucun secret ne part sur GitHub.

## 2. Validation des entrées (côté serveur = source de vérité)
- Valider **toute** entrée avec un schéma **Zod**, y compris ce qui vient du client déjà « validé ».
- Ne jamais faire confiance aux prix/quantités venant du client : recalculer le total **côté serveur** à partir du catalogue.
- Bornes strictes : quantités > 0 et plafonnées, emails/téléphones au bon format, longueurs limitées.

## 3. Auth & sessions (quand back-end réel)
- Mots de passe hashés (bcrypt/argon2), jamais en clair, jamais loggés.
- Sessions httpOnly + secure + sameSite ; ne pas stocker de token sensible dans `localStorage`.
- Rate-limiting sur login/inscription/reset ; messages d'erreur génériques (pas « email inexistant »).
- Autorisation vérifiée à chaque route protégée (un utilisateur ne lit/modifie que SES données).

## 4. Anti-injection / XSS / CSRF
- Jamais de `dangerouslySetInnerHTML` avec du contenu non assaini.
- Requêtes DB paramétrées / ORM (jamais de SQL concaténé).
- CSRF : tokens ou vérif d'origine sur les mutations (Server Actions Next gèrent en partie, vérifier).
- Échapper/encoder les données utilisateur affichées.

## 5. En-têtes & transport
- HTTPS partout. En-têtes via `next.config` / middleware : `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Strict-Transport-Security`.
- CORS restrictif sur les API. Pas de stack trace/détail d'erreur renvoyé au client en prod.

## 6. Paiement
- Ne jamais manipuler ni stocker de numéro de carte soi-même → déléguer à un prestataire (Stripe, ou Mobile Money : Orange Money / MTN MoMo pour le Cameroun).
- Vérifier le montant et le statut côté serveur via webhook signé, pas sur la confiance du client.
- Idempotence sur la création de commande (éviter double paiement).

## 7. Dépendances & données
- Dépendances à jour, `npm audit` sans vuln critique. Le moins de dépendances possible.
- Minimiser les données personnelles collectées ; ne rien logger de sensible.

## Checklist avant de livrer une feature sensible
- [ ] Entrées validées côté serveur (Zod), montants recalculés serveur.
- [ ] Aucun secret exposé ; `.env` ignoré par git.
- [ ] Auth/permissions vérifiées si route protégée.
- [ ] Pas de XSS/injection ; en-têtes de sécurité en place.
- [ ] Paiement délégué à un prestataire, statut vérifié serveur.
- [ ] `/security-review` passé sans finding critique.
