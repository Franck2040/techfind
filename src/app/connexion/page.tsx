"use client";
/**
 * connexion/page.tsx — Page de connexion (plein écran).
 * MODE DÉMO : la connexion se fait côté navigateur via AuthContext.
 */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { Label, Input, FieldError } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setErrors({});

    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") ?? "").toString().trim();
    const password = (fd.get("password") ?? "").toString();

    const errs: Record<string, string[]> = {};
    if (!email) errs.email = ["Email requis"];
    if (!password) errs.password = ["Mot de passe requis"];
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setPending(true);
    const res = await login({ email, password });
    setPending(false);
    if (res.ok) router.push("/compte");
    else setMessage(res.error ?? "Une erreur est survenue.");
  }

  return (
    <AuthShell title="Connectez-vous" subtitle="Accédez à votre compte en toute sécurité">
      <SocialButtons />

      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <p className="rounded-lg bg-danger/10 px-4 py-2 text-sm text-danger" role="alert">
            {message}
          </p>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="vous@exemple.com" />
          <FieldError messages={errors.email} />
        </div>
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" />
          <FieldError messages={errors.password} />
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
