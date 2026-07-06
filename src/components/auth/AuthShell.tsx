/**
 * AuthShell.tsx — Mise en page commune aux pages Connexion / Inscription.
 * Illustration à gauche (desktop), carte de formulaire à droite. Flèche retour
 * vers l'accueil. Ces pages sont volontairement SANS header/footer (plein écran).
 */
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col lg:flex-row">
      {/* Retour à l'accueil */}
      <Link
        href="/"
        aria-label="Retour à l'accueil"
        className="absolute left-4 top-4 z-10 flex size-11 items-center justify-center rounded-full bg-white text-navy shadow ring-1 ring-black/5 hover:bg-surface"
      >
        <ArrowLeft className="size-5" aria-hidden />
      </Link>

      {/* Illustration (desktop) */}
      <div className="hidden items-center justify-center bg-white p-10 lg:flex lg:w-1/2">
        <div className="flex aspect-square w-full max-w-md items-center justify-center rounded-full bg-sky-soft">
          <ShoppingCart className="size-40 text-navy/30" aria-hidden />
        </div>
      </div>

      {/* Carte de formulaire */}
      <div className="flex flex-1 items-center justify-center bg-white p-6">
        <div className="w-full max-w-md">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-center font-heading text-2xl font-bold text-navy">{title}</h1>
            <p className="mt-1 text-center text-sm text-muted">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
