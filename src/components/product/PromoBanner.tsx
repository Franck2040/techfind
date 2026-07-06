/**
 * PromoBanner.tsx — Bandeau promotionnel sombre (accueil + liste produits).
 * Texte personnalisable via les props ; bouton d'action vers /produits.
 */
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function PromoBanner({
  badge = "Nouvelle arrivée",
  title = "Jusqu'à 50% De réduction",
  subtitle = "Écran 12 pouces HD",
  ctaLabel = "Acheter",
  ctaHref = "/produits",
}: {
  badge?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section
      aria-label="Offre promotionnelle"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-[#062b3f] to-black px-6 py-12 sm:px-12 sm:py-16"
    >
      {/* Cercles décoratifs subtils en arrière-plan */}
      <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-orange/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 size-56 rounded-full bg-blue-accent/10 blur-2xl" />

      <div className="relative max-w-md">
        <Badge>{badge}</Badge>
        <h2 className="mt-4 font-heading text-3xl font-bold text-blue-accent sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 text-white/80">{subtitle}</p>
        <Button href={ctaHref} className="mt-6">
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
}
