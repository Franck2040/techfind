/**
 * Testimonials.tsx — Section "Tout nos clients nous font confiance".
 * Avis clients (données statiques). Les avatars sont des initiales colorées
 * (pas de photo requise). Modifiez le tableau `testimonials` pour les avis.
 */

const testimonials = [
  {
    name: "Kamga Alain",
    color: "#58A0E2",
    text: "Commande livrée rapidement à Yaoundé, produit conforme et de bonne qualité. Je recommande Techfind !",
  },
  {
    name: "Esther Rita",
    color: "#EDA415",
    text: "Un service client très réactif et des prix corrects. Mon ordinateur portable fonctionne parfaitement.",
  },
  {
    name: "Fokoua Ariel",
    color: "#3AAE3F",
    text: "Bonne expérience d'achat, paiement à la livraison pratique et sécurisé. Merci pour le sérieux.",
  },
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  return (
    <section aria-label="Avis de nos clients">
      <h2 className="mb-8 font-heading text-2xl font-bold text-navy sm:text-3xl">
        Tout nos clients nous font confiance
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.name} className="rounded-xl border border-line bg-white p-6">
            <div className="flex items-center gap-3">
              <span
                className="flex size-12 items-center justify-center rounded-full font-heading font-semibold text-white"
                style={{ backgroundColor: t.color }}
                aria-hidden
              >
                {initials(t.name)}
              </span>
              <figcaption className="font-heading font-semibold text-navy">{t.name}</figcaption>
            </div>
            <blockquote className="mt-4 rounded-lg bg-sky-soft p-4 text-sm leading-relaxed text-muted">
              {t.text}
            </blockquote>
          </figure>
        ))}
      </div>
    </section>
  );
}
