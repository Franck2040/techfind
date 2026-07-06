/**
 * Features.tsx — Bandeau "avantages" (livraison, qualité, garantie).
 * Fond bleu clair, 3 arguments de réassurance. Rendu côté serveur (statique).
 */
import { Truck, Crown, ShieldCheck } from "lucide-react";

const features = [
  {
    Icon: Truck,
    title: "Livraison dans les délais",
    text: "Livraison disponible pour les paiements de plus de 50 000 FCFA.",
  },
  {
    Icon: Crown,
    title: "Produits de qualité",
    text: "Nos produits de qualité à des prix incroyables.",
  },
  {
    Icon: ShieldCheck,
    title: "3 mois de garantie",
    text: "Disponible pour tous nos produits.",
  },
];

export function Features() {
  return (
    <section aria-label="Nos avantages" className="rounded-2xl bg-sky-soft p-6 sm:p-10">
      <div className="grid gap-8 sm:grid-cols-3">
        {features.map(({ Icon, title, text }) => (
          <div key={title} className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-orange/15 text-orange">
              <Icon className="size-6" aria-hidden />
            </span>
            <div>
              <h3 className="font-heading text-lg font-semibold text-navy">{title}</h3>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
