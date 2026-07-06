/**
 * validation.ts — Schémas de validation (Zod).
 * -----------------------------------------------------------------------------
 * SOURCE DE VÉRITÉ pour toutes les données saisies par l'utilisateur.
 * On valide TOUJOURS côté serveur avec ces schémas (sécurité) — jamais
 * uniquement côté client, qui peut être contourné.
 *
 * Où modifier : ajoutez/ajustez un champ ici, la validation se propage à
 * l'action serveur et au formulaire qui l'utilisent.
 */
import { z } from "zod";

/**
 * Convertit une erreur Zod en { champ: [messages] }.
 * On lit `error.issues` (stable) plutôt que `.flatten()` pour rester compatible
 * entre les versions de Zod.
 */
export function toFieldErrors(error: z.ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_");
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

// Téléphone camerounais/international : chiffres, +, espaces (8 à 15 caractères).
const phone = z
  .string()
  .trim()
  .regex(/^[+0-9\s]{8,15}$/, "Numéro de téléphone invalide");

// --- Inscription -------------------------------------------------------------
export const registerSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(80),
  email: z.email("Adresse email invalide").max(120),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100),
  address: z.string().trim().max(200).optional().or(z.literal("")),
});
export type RegisterInput = z.infer<typeof registerSchema>;

// --- Connexion ---------------------------------------------------------------
export const loginSchema = z.object({
  email: z.email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// --- Paiement / commande -----------------------------------------------------
export const checkoutSchema = z.object({
  firstName: z.string().trim().min(2, "Prénom requis").max(80),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  address: z.string().trim().min(3, "Adresse requise").max(200),
  apartment: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().min(2, "Quartier / Ville requis").max(120),
  phone,
  email: z.email("Adresse email invalide"),
  paymentMethod: z.enum(["livraison", "carte", "mobile"]),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

// --- Contact -----------------------------------------------------------------
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Votre nom est requis").max(80),
  city: z.string().trim().min(2, "Votre ville est requise").max(120),
  phone,
  message: z.string().trim().min(10, "Message trop court (10 caractères min)").max(2000),
});
export type ContactInput = z.infer<typeof contactSchema>;

// --- Mise à jour du profil ---------------------------------------------------
// Le changement de mot de passe est optionnel : si un champ est rempli, on
// vérifie la cohérence (voir .refine).
export const profileSchema = z
  .object({
    name: z.string().trim().min(2, "Nom requis").max(80),
    address: z.string().trim().max(200).optional().or(z.literal("")),
    currentPassword: z.string().optional().or(z.literal("")),
    newPassword: z.string().optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (d) => !d.newPassword || d.newPassword.length >= 8,
    { path: ["newPassword"], message: "Le nouveau mot de passe doit faire 8 caractères min" },
  )
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  })
  .refine((d) => !d.newPassword || !!d.currentPassword, {
    path: ["currentPassword"],
    message: "Mot de passe actuel requis pour le changer",
  });
export type ProfileInput = z.infer<typeof profileSchema>;
