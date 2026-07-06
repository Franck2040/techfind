/**
 * a-propos/page.tsx — Page "À propos / Notre histoire".
 * Contenu statique : histoire, chiffres clés, équipe, réassurance.
 * Modifiez les tableaux `stats` / `team` pour changer les contenus.
 */
import { Store, Coins, Users, TrendingUp, Truck, Headphones, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SITE } from "@/lib/site";

export const metadata = { title: "À propos" };

const stats = [
  { value: "10.5k", label: "Clients actifs dans nos magasins", Icon: Store, highlight: false },
  { value: "33k", label: "Ventes mensuelles de nos produits", Icon: Coins, highlight: true },
  { value: "45.5k", label: "Clients actifs sur notre site", Icon: Users, highlight: false },
  { value: "25k", label: "Ventes annuelles", Icon: TrendingUp, highlight: false },
];

const team = [
  { name: "Kenmeugne Calixte", role: "Directeur / Fondateur", color: "#003F62" },
  { name: "Emma Watson", role: "Directrice Marketing Digital", color: "#EDA415" },
  { name: "Will Smith", role: "Designer", color: "#3AAE3F" },
];

const reassurance = [
  { Icon: Truck, title: "Livraison gratuite", text: "Pour tout achat de plus de 50 000 FCFA." },
  { Icon: Headphones, title: "Service client 24/7", text: "Une équipe à votre écoute à tout moment." },
  { Icon: ShieldCheck, title: "Satisfait ou remboursé", text: "Retour possible sous 30 jours." },
];

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function AboutPage() {
  return (
    <Container className="space-y-16 py-8">
      <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "À propos" }]} />

      {/* Histoire */}
      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy sm:text-4xl">Notre Histoire</h1>
          <p className="mt-6 leading-relaxed text-muted">
            Fondée en 2025 par M.&nbsp;Kenmeugne Calixte, {SITE.name} est une entreprise camerounaise
            passionnée par la technologie. Basée à {SITE.cities}, nous sommes spécialisés dans la vente
            d&apos;ordinateurs, de téléphones et d&apos;autres outils high-tech de qualité. Notre
            engagement : offrir des produits performants, durables et adaptés à tous les budgets.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Chez {SITE.name}, votre satisfaction est notre priorité. Nous vous accompagnons dans vos
            choix, vous conseillons au mieux et assurons un service après-vente de qualité. Profitez
            d&apos;une livraison rapide et sécurisée dans tout le Cameroun.
          </p>
        </div>
        <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-gradient-to-br from-sky to-sky-soft">
          <span className="font-heading text-4xl font-bold text-navy">
            Tech<span className="text-success">find</span>
          </span>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border p-6 text-center ${
              s.highlight ? "border-orange bg-orange text-white" : "border-line bg-white"
            }`}
          >
            <span
              className={`mx-auto flex size-12 items-center justify-center rounded-full ${
                s.highlight ? "bg-white/20 text-white" : "bg-navy text-white"
              }`}
            >
              <s.Icon className="size-6" aria-hidden />
            </span>
            <p className={`mt-4 font-heading text-2xl font-bold ${s.highlight ? "text-white" : "text-navy"}`}>
              {s.value}
            </p>
            <p className={`mt-1 text-sm ${s.highlight ? "text-white/90" : "text-muted"}`}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* Équipe */}
      <section>
        <h2 className="mb-8 text-center font-heading text-2xl font-bold text-navy sm:text-3xl">
          Notre équipe
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {team.map((m) => (
            <div key={m.name} className="rounded-xl border border-line p-6 text-center">
              <span
                className="mx-auto flex size-20 items-center justify-center rounded-full font-heading text-2xl font-bold text-white"
                style={{ backgroundColor: m.color }}
                aria-hidden
              >
                {initials(m.name)}
              </span>
              <h3 className="mt-4 font-heading font-semibold text-navy">{m.name}</h3>
              <p className="text-sm text-muted">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Réassurance */}
      <section className="grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
        {reassurance.map(({ Icon, title, text }) => (
          <div key={title} className="flex flex-col items-center gap-2 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-navy text-white">
              <Icon className="size-6" aria-hidden />
            </span>
            <h3 className="font-heading font-semibold text-navy">{title}</h3>
            <p className="text-sm text-muted">{text}</p>
          </div>
        ))}
      </section>
    </Container>
  );
}
