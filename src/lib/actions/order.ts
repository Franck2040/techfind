"use server";
/**
 * actions/order.ts — Validation & calcul de commande (Server Action).
 * -----------------------------------------------------------------------------
 * Même en MODE DÉMO, la commande est traitée CÔTÉ SERVEUR : on valide le
 * formulaire (Zod) et on RECALCULE le total à partir du catalogue — on ne fait
 * jamais confiance aux prix envoyés par le navigateur. La commande obtenue est
 * ensuite mémorisée côté client (localStorage) pour l'affichage.
 *
 * (La version full-stack enregistre en base + décrémente le stock : branche
 *  git `full-stack`.)
 */
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { checkoutSchema, toFieldErrors } from "@/lib/validation";
import { products } from "@/lib/catalog";
import type { DemoOrder, DemoOrderItem } from "@/lib/demoOrders";

// Du panier client, on n'accepte que l'identifiant, la quantité et la variante.
const itemsSchema = z
  .array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive().max(99),
      color: z.string().max(40).optional(),
      size: z.string().max(40).optional(),
    }),
  )
  .min(1, "Le panier est vide.")
  .max(100);

export type CreateOrderResult =
  | { ok: true; order: DemoOrder }
  | { ok: false; message?: string; fieldErrors?: Record<string, string[]> };

export async function createOrder(payload: {
  form: unknown;
  items: unknown;
}): Promise<CreateOrderResult> {
  // 1) Validation des coordonnées de livraison
  const form = checkoutSchema.safeParse(payload.form);
  if (!form.success) {
    return {
      ok: false,
      message: "Veuillez corriger les erreurs du formulaire.",
      fieldErrors: toFieldErrors(form.error),
    };
  }

  // 2) Validation de la structure du panier
  const parsedItems = itemsSchema.safeParse(payload.items);
  if (!parsedItems.success) {
    return { ok: false, message: "Votre panier est invalide ou vide." };
  }

  // 3) RECALCUL du total à partir du catalogue (source de vérité)
  const byId = new Map(products.map((p) => [p.id, p]));
  let total = 0;
  const items: DemoOrderItem[] = [];
  for (const it of parsedItems.data) {
    const product = byId.get(it.productId);
    if (!product) {
      return { ok: false, message: "Un produit de votre panier n'existe plus." };
    }
    total += product.price * it.quantity; // prix de confiance = celui du catalogue
    items.push({
      name: product.name,
      price: product.price,
      quantity: it.quantity,
      color: it.color,
      size: it.size,
    });
  }

  const order: DemoOrder = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    firstName: form.data.firstName,
    company: form.data.company || undefined,
    address: form.data.address,
    apartment: form.data.apartment || undefined,
    city: form.data.city,
    phone: form.data.phone,
    email: form.data.email,
    total,
    paymentMethod: form.data.paymentMethod,
    items,
  };

  return { ok: true, order };
}
