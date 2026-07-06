"use server";
/**
 * actions/order.ts — Création de commande (étape critique et sécurisée).
 * -----------------------------------------------------------------------------
 * RÈGLE DE SÉCURITÉ CLÉ : on ne fait JAMAIS confiance aux prix envoyés par le
 * client. Le serveur recharge chaque produit depuis la base, RECALCULE le total,
 * et vérifie le stock avant de créer la commande. Cela empêche un client
 * malveillant de modifier les prix dans son navigateur.
 */
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkoutSchema, toFieldErrors } from "@/lib/validation";
import { getCurrentUser } from "@/lib/auth";

// On ne récupère du panier client QUE l'identifiant, la quantité et la variante.
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
  | { ok: true; orderId: string }
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

  // 3) Rechargement des produits + RECALCUL du total côté serveur
  const ids = [...new Set(parsedItems.data.map((i) => i.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const byId = new Map(products.map((p) => [p.id, p]));

  let total = 0;
  const orderItems: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    color?: string;
    size?: string;
  }[] = [];
  for (const item of parsedItems.data) {
    const product = byId.get(item.productId);
    if (!product) {
      return { ok: false, message: "Un produit de votre panier n'existe plus." };
    }
    if (product.stock < item.quantity) {
      return { ok: false, message: `Stock insuffisant pour « ${product.name} ».` };
    }
    total += product.price * item.quantity; // prix de confiance = celui de la base
    orderItems.push({
      productId: product.id,
      name: product.name, // copie figée (historique fiable même si le produit change)
      price: product.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
    });
  }

  // 4) Commande liée au compte si l'utilisateur est connecté (sinon invité)
  const user = await getCurrentUser();

  // 5) Création de la commande + décrément du stock dans UNE transaction
  //    (tout réussit, ou tout est annulé => cohérence des données).
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: user?.id ?? null,
        firstName: form.data.firstName,
        company: form.data.company || null,
        address: form.data.address,
        apartment: form.data.apartment || null,
        city: form.data.city,
        phone: form.data.phone,
        email: form.data.email,
        total,
        paymentMethod: form.data.paymentMethod,
        status: "en_attente",
        items: { create: orderItems },
      },
    });

    for (const item of parsedItems.data) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return created;
  });

  // NB : pour un paiement par carte/mobile money, c'est ICI qu'on redirigerait
  // vers le prestataire (Stripe / Orange Money / MTN MoMo) puis on confirmerait
  // le paiement via un webhook signé. Le "paiement à la livraison" est complet.
  return { ok: true, orderId: order.id };
}
