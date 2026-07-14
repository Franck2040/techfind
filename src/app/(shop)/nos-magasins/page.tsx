/**
 * nos-magasins/page.tsx — Page "Nos Magasins".
 * Liste les boutiques physiques Techfind (Yaoundé, Douala) avec adresse,
 * téléphone, horaires et lien Google Maps. Données : src/lib/catalog.ts (stores).
 */
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { getStores } from "@/lib/data";
import { SITE } from "@/lib/site";

export const metadata = { title: "Nos magasins" };

export default async function StoresPage() {
  const stores = await getStores();

  return (
    <Container className="space-y-10 py-8">
      <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Nos magasins" }]} />

      {/* En-tête */}
      <section className="rounded-2xl bg-sky-soft p-8 sm:p-12">
        <h1 className="font-heading text-3xl font-bold text-navy sm:text-4xl">Nos magasins</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Retrouvez nos boutiques à {SITE.cities}. Nos conseillers vous accueillent pour découvrir,
          tester et repartir avec votre matériel high-tech. Passez nous voir !
        </p>
      </section>

      {/* Cartes magasins */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <div
            key={store.name}
            className="flex flex-col rounded-xl border border-line p-6 transition-shadow hover:shadow-md"
          >
            <span className="mb-3 inline-flex w-fit items-center rounded-full bg-orange/15 px-3 py-1 text-xs font-medium text-orange">
              {store.city}
            </span>
            <h2 className="font-heading text-lg font-semibold text-navy">{store.name}</h2>

            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />
                <span>{store.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-navy" aria-hidden />
                <a href={`tel:${store.phone.replace(/\s/g, "")}`} className="hover:text-orange">
                  {store.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="size-4 shrink-0 text-navy" aria-hidden />
                <span>{store.hours}</span>
              </li>
            </ul>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapsQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-navy hover:text-orange"
            >
              Voir sur Google Maps <ExternalLink className="size-4" aria-hidden />
            </a>
          </div>
        ))}
      </section>

      {/* CTA contact */}
      <section className="flex flex-col items-center gap-4 rounded-2xl border border-line p-8 text-center">
        <h2 className="font-heading text-xl font-semibold text-navy">Une question ?</h2>
        <p className="max-w-xl text-muted">
          Notre service client est disponible 24/7 pour vous renseigner sur nos produits, la
          disponibilité en magasin ou la livraison.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/contact">Nous contacter</Button>
          <Button href={`tel:${SITE.phone.replace(/\s/g, "")}`} variant="secondary">
            {SITE.phone}
          </Button>
        </div>
      </section>
    </Container>
  );
}
