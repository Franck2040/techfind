"use client";
/**
 * ProfileForm.tsx — Formulaire "Mettre à jour mon profil".
 * Pré-rempli avec les infos de l'utilisateur. L'email est en lecture seule
 * (c'est l'identifiant de connexion). Utilise l'action `updateProfileAction`.
 */
import { useActionState } from "react";
import { updateProfileAction } from "@/lib/actions/profile";
import { initialFormState } from "@/lib/types";
import { Label, Input, FieldError } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

export function ProfileForm({
  name,
  email,
  address,
}: {
  name: string;
  email: string;
  address: string;
}) {
  const [state, action, pending] = useActionState(updateProfileAction, initialFormState);

  return (
    <form action={action} className="rounded-xl border border-line p-6">
      <h2 className="font-heading text-lg font-semibold text-navy">Mettre à jour mon profil</h2>

      {state.ok && (
        <p className="mt-4 rounded-lg bg-success/10 px-4 py-2 text-sm text-success" role="status">
          {state.message}
        </p>
      )}
      {!state.ok && state.message && (
        <p className="mt-4 rounded-lg bg-danger/10 px-4 py-2 text-sm text-danger" role="alert">
          {state.message}
        </p>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" defaultValue={name} />
          <FieldError messages={state.fieldErrors?.name} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          {/* Lecture seule : l'email sert d'identifiant de connexion. */}
          <Input id="email" value={email} readOnly disabled className="bg-surface text-muted" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="address">Adresse / Quartier / Ville</Label>
          <Input id="address" name="address" defaultValue={address} />
          <FieldError messages={state.fieldErrors?.address} />
        </div>
      </div>

      <h3 className="mt-6 font-heading font-semibold text-navy">Changer le mot de passe</h3>
      <p className="text-xs text-muted">Laissez vide si vous ne voulez pas le modifier.</p>
      <div className="mt-3 space-y-4">
        <div>
          <Input
            name="currentPassword"
            type="password"
            placeholder="Mot de passe actuel"
            autoComplete="current-password"
          />
          <FieldError messages={state.fieldErrors?.currentPassword} />
        </div>
        <div>
          <Input
            name="newPassword"
            type="password"
            placeholder="Nouveau mot de passe"
            autoComplete="new-password"
          />
          <FieldError messages={state.fieldErrors?.newPassword} />
        </div>
        <div>
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirmer le nouveau mot de passe"
            autoComplete="new-password"
          />
          <FieldError messages={state.fieldErrors?.confirmPassword} />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit" loading={pending}>
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
}
