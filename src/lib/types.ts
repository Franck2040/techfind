/**
 * types.ts — Types partagés dans toute l'application.
 */

/**
 * État renvoyé par une action de formulaire (utilisé avec `useActionState`).
 * - ok        : succès de l'opération
 * - message   : message global (erreur ou info) à afficher
 * - fieldErrors : erreurs par champ, ex { email: ["Email invalide"] }
 */
export type FormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

/** État initial vide pour useActionState. */
export const initialFormState: FormState = { ok: false };

/**
 * Un article dans le panier (stocké côté client, voir CartContext).
 * On y copie les infos produit utiles pour afficher le panier sans requête,
 * mais le PRIX EST TOUJOURS REVÉRIFIÉ côté serveur au paiement (sécurité).
 */
export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number; // FCFA
  image: string;
  quantity: number;
  stock: number;
  color?: string;
  size?: string;
};
