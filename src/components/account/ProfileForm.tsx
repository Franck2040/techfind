"use client";
/**
 * ProfileForm.tsx — Formulaire "Mettre à jour mon profil" (mode démo).
 * Pré-rempli avec les infos du compte (via AuthContext). L'email est en lecture
 * seule (identifiant de connexion). Le changement de mot de passe exige l'ancien.
 */
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Label, Input, FieldError } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

export function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  if (!user) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setErrors({});

    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") ?? "").toString().trim();
    const address = (fd.get("address") ?? "").toString();
    const currentPassword = (fd.get("currentPassword") ?? "").toString();
    const newPassword = (fd.get("newPassword") ?? "").toString();
    const confirmPassword = (fd.get("confirmPassword") ?? "").toString();

    // Validations de base côté client
    const errs: Record<string, string[]> = {};
    if (name.length < 2) errs.name = ["Le nom doit contenir au moins 2 caractères"];
    if (newPassword && newPassword.length < 8)
      errs.newPassword = ["Le nouveau mot de passe doit faire 8 caractères min"];
    if (newPassword && newPassword !== confirmPassword)
      errs.confirmPassword = ["Les mots de passe ne correspondent pas"];
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setPending(true);
    const res = await updateProfile({
      name,
      address,
      currentPassword,
      newPassword: newPassword || undefined,
    });
    setPending(false);

    if (res.ok) {
      setMessage({ ok: true, text: "Votre profil a été mis à jour." });
    } else {
      setMessage({ ok: false, text: res.error ?? "Une erreur est survenue." });
      if (res.error?.toLowerCase().includes("actuel")) {
        setErrors({ currentPassword: [res.error] });
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-line p-6">
      <h2 className="font-heading text-lg font-semibold text-navy">Mettre à jour mon profil</h2>

      {message && (
        <p
          className={`mt-4 rounded-lg px-4 py-2 text-sm ${
            message.ok ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          }`}
          role="status"
        >
          {message.text}
        </p>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" defaultValue={user.name} />
          <FieldError messages={errors.name} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} readOnly disabled className="bg-surface text-muted" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="address">Adresse / Quartier / Ville</Label>
          <Input id="address" name="address" defaultValue={user.address ?? ""} />
        </div>
      </div>

      <h3 className="mt-6 font-heading font-semibold text-navy">Changer le mot de passe</h3>
      <p className="text-xs text-muted">Laissez vide si vous ne voulez pas le modifier.</p>
      <div className="mt-3 space-y-4">
        <div>
          <Input name="currentPassword" type="password" placeholder="Mot de passe actuel" autoComplete="current-password" />
          <FieldError messages={errors.currentPassword} />
        </div>
        <div>
          <Input name="newPassword" type="password" placeholder="Nouveau mot de passe" autoComplete="new-password" />
          <FieldError messages={errors.newPassword} />
        </div>
        <div>
          <Input name="confirmPassword" type="password" placeholder="Confirmer le nouveau mot de passe" autoComplete="new-password" />
          <FieldError messages={errors.confirmPassword} />
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
