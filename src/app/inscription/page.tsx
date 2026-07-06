"use client";
/**
 * inscription/page.tsx — Page de création de compte (plein écran).
 * Utilise l'action serveur `registerAction` via `useActionState`.
 */
import Link from "next/link";
import { useActionState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { Label, Input, FieldError } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { registerAction } from "@/lib/actions/auth";
import { initialFormState } from "@/lib/types";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, initialFormState);

  return (
    <AuthShell title="Créer un compte" subtitle="Créez un compte et achetez en toute sécurité">
      <SocialButtons />

      <form action={action} className="space-y-4">
        {!state.ok && state.message && (
          <p className="rounded-lg bg-danger/10 px-4 py-2 text-sm text-danger" role="alert">
            {state.message}
          </p>
        )}

        <div>
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" autoComplete="name" placeholder="Votre nom" />
          <FieldError messages={state.fieldErrors?.name} />
        </div>
        <div>
          <Label htmlFor="address">Adresse / Quartier / Ville (optionnel)</Label>
          <Input id="address" name="address" autoComplete="street-address" placeholder="Ex : Mimboman, Yaoundé" />
          <FieldError messages={state.fieldErrors?.address} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="vous@exemple.com" />
          <FieldError messages={state.fieldErrors?.email} />
        </div>
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" placeholder="8 caractères minimum" />
          <FieldError messages={state.fieldErrors?.password} />
        </div>

        <p className="text-xs text-muted">
          En poursuivant, vous acceptez nos conditions d&apos;utilisation et notre politique de
          confidentialité.
        </p>

        <Button type="submit" variant="black" loading={pending} className="w-full rounded-lg">
          Créer le compte
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        Vous avez déjà un compte ?{" "}
        <Link href="/connexion" className="font-semibold text-[#7c3aed] hover:underline">
          Se connecter
        </Link>
      </p>
    </AuthShell>
  );
}
