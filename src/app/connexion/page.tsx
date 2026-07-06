"use client";
/**
 * connexion/page.tsx — Page de connexion (plein écran, hors groupe (shop)).
 * Utilise l'action serveur `loginAction` via `useActionState`.
 */
import Link from "next/link";
import { useActionState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { Label, Input, FieldError } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { loginAction } from "@/lib/actions/auth";
import { initialFormState } from "@/lib/types";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, initialFormState);

  return (
    <AuthShell title="Connectez-vous" subtitle="Accédez à votre compte en toute sécurité">
      <SocialButtons />

      <form action={action} className="space-y-4">
        {!state.ok && state.message && (
          <p className="rounded-lg bg-danger/10 px-4 py-2 text-sm text-danger" role="alert">
            {state.message}
          </p>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="vous@exemple.com" />
          <FieldError messages={state.fieldErrors?.email} />
        </div>
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" />
          <FieldError messages={state.fieldErrors?.password} />
        </div>

        <Button type="submit" variant="black" loading={pending} className="w-full rounded-lg">
          Se connecter
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-semibold text-[#7c3aed] hover:underline">
          Créer un compte
        </Link>
      </p>
    </AuthShell>
  );
}
