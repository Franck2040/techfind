"use server";
/**
 * actions/profile.ts — Mise à jour du profil utilisateur.
 * -----------------------------------------------------------------------------
 * Sécurité : on vérifie que l'utilisateur est connecté (l'action est
 * appelable par POST direct), et le changement de mot de passe exige le mot de
 * passe ACTUEL. L'email (identifiant de connexion) n'est pas modifiable ici.
 */
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { profileSchema, toFieldErrors } from "@/lib/validation";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import type { FormState } from "@/lib/types";

export async function updateProfileAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, message: "Vous devez être connecté." };
  }

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address") ?? "",
    currentPassword: formData.get("currentPassword") ?? "",
    newPassword: formData.get("newPassword") ?? "",
    confirmPassword: formData.get("confirmPassword") ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Veuillez corriger les erreurs ci-dessous.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const data: { name: string; address: string | null; passwordHash?: string } = {
    name: parsed.data.name,
    address: parsed.data.address ? parsed.data.address : null,
  };

  // Changement de mot de passe (optionnel) : vérifier l'ancien d'abord.
  if (parsed.data.newPassword) {
    const full = await prisma.user.findUnique({ where: { id: user.id } });
    if (!full || !(await verifyPassword(parsed.data.currentPassword ?? "", full.passwordHash))) {
      return {
        ok: false,
        message: "Mot de passe actuel incorrect.",
        fieldErrors: { currentPassword: ["Mot de passe actuel incorrect"] },
      };
    }
    data.passwordHash = await hashPassword(parsed.data.newPassword);
  }

  await prisma.user.update({ where: { id: user.id }, data });
  revalidatePath("/compte");

  return { ok: true, message: "Votre profil a été mis à jour." };
}
