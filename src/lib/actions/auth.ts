"use server";
/**
 * actions/auth.ts — Actions serveur d'authentification.
 * -----------------------------------------------------------------------------
 * "use server" en tête = toutes les fonctions exportées sont des Server Actions
 * (exécutées sur le serveur, appelées depuis les formulaires clients).
 *
 * ⚠️ Sécurité : ces fonctions sont atteignables par requête POST directe.
 * On (re)valide donc TOUJOURS les entrées côté serveur avec Zod.
 */
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { registerSchema, loginSchema, toFieldErrors } from "@/lib/validation";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
} from "@/lib/auth";
import type { FormState } from "@/lib/types";

/** Inscription : crée le compte (mot de passe hashé) puis connecte l'utilisateur. */
export async function registerAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    address: formData.get("address") ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Veuillez corriger les erreurs ci-dessous.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const { name, email, password, address } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  // Un seul compte par email.
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return { ok: false, message: "Un compte existe déjà avec cet email." };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      address: address ? address : null,
    },
  });

  await createSession(user.id);
  redirect("/compte"); // redirect() interrompt l'exécution (rien après ne s'exécute)
}

/** Connexion : vérifie l'email + mot de passe, puis ouvre une session. */
export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Veuillez corriger les erreurs ci-dessous.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  // Message VOLONTAIREMENT générique : on ne révèle pas si l'email existe
  // (empêche l'énumération des comptes).
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { ok: false, message: "Email ou mot de passe incorrect." };
  }

  await createSession(user.id);
  redirect("/compte");
}

/** Déconnexion : détruit la session puis renvoie à l'accueil. */
export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
