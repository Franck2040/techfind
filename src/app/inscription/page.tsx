"use client";
/**
 * inscription/page.tsx — Création de compte (plein écran).
 * MODE DÉMO : le compte est créé côté navigateur via AuthContext.
 */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { Label, Input, FieldError } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setErrors({});

    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") ?? "").toString().trim();
    const address = (fd.get("address") ?? "").toString().trim();
    const email = (fd.get("email") ?? "").toString().trim();
    const password = (fd.get("password") ?? "").toString();

    const errs: Record<string, string[]> = {};
    if (name.length < 2) errs.name = ["Le nom doit contenir au moins 2 caractères"];
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = ["Adresse email invalide"];
    if (password.length < 8) errs.password = ["Le mot de passe doit contenir au moins 8 caractères"];
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setPending(true);
    const res = await register({ name, email, password, address });
    setPending(false);
    if (res.ok) router.push("/compte");
    else setMessage(res.error ?? "Une erreur est survenue.");
  }

  return (
    <AuthShell title="Créer un compte" subtitle="Créez un compte et achetez en toute sécurité">
      <SocialButtons />

      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <p className="rounded-lg bg-danger/10 px-4 py-2 text-sm text-danger" role="alert">
            {message}
          </p>
        )}

        <div>
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" autoComplete="name" placeholder="Votre nom" />
          <FieldError messages={errors.name} />
        </div>
        <div>
          <Label htmlFor="address">Adresse / Quartier / Ville (optionnel)</Label>
          <Input id="address" name="address" autoComplete="street-address" placeholder="Ex : Mimboman, Yaoundé" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="vous@exemple.com" />
          <FieldError messages={errors.email} />
        </div>
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" placeholder="8 caractères minimum" />
          <FieldError messages={errors.password} />
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
