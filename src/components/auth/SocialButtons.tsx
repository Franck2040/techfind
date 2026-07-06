"use client";
/**
 * SocialButtons.tsx — Boutons "Se connecter avec Google / Facebook" + séparateur.
 * -----------------------------------------------------------------------------
 * La connexion sociale (OAuth) nécessite des identifiants Google/Facebook
 * (voir .env.example). Tant qu'ils ne sont pas configurés, ces boutons affichent
 * un message. Pour l'activer : ajoutez un fournisseur OAuth et redirigez ici.
 */
import { useState } from "react";
import { GoogleIcon, FacebookIcon } from "@/components/ui/SocialIcons";

export function SocialButtons() {
  const [notice, setNotice] = useState(false);

  const buttonClass =
    "flex w-full items-center justify-center gap-3 rounded-lg border border-line py-2.5 text-sm font-medium text-ink hover:bg-surface";

  return (
    <div className="mt-6 space-y-3">
      <button type="button" onClick={() => setNotice(true)} className={buttonClass}>
        <GoogleIcon className="size-5" /> Se connecter avec Google
      </button>
      <button type="button" onClick={() => setNotice(true)} className={buttonClass}>
        <FacebookIcon className="size-5" /> Se connecter avec Facebook
      </button>

      {notice && (
        <p className="text-center text-xs text-muted">
          La connexion via un réseau social sera bientôt disponible.
        </p>
      )}

      {/* Séparateur "OU" */}
      <div className="relative py-2 text-center">
        <span className="absolute inset-x-0 top-1/2 h-px bg-line" aria-hidden />
        <span className="relative bg-white px-3 text-xs text-muted">OU</span>
      </div>
    </div>
  );
}
