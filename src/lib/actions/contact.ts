"use server";
/**
 * actions/contact.ts — Traitement du formulaire de contact.
 * Valide les données côté serveur. Pour un envoi RÉEL, branchez ici un service
 * d'email (ex: Resend, SendGrid) ou enregistrez le message en base de données.
 */
import { contactSchema, toFieldErrors } from "@/lib/validation";
import type { FormState } from "@/lib/types";

export async function contactAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    city: formData.get("city"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Veuillez corriger les erreurs ci-dessous.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  // TODO (production) : envoyer un email ou stocker le message.
  // Ici, on se contente de le journaliser côté serveur (démo).
  console.log("[Contact] Nouveau message reçu :", parsed.data);

  return {
    ok: true,
    message: "Merci ! Votre message a bien été envoyé. Nous vous répondrons sous 24h.",
  };
}
