/**
 * page.tsx (accueil) — Page d'accueil "/".
 * -----------------------------------------------------------------------------
 * Composée de sections : héro (Black Friday), catégories, meilleures ventes,
 * bandeau promo, avantages, témoignages. Les données produits/catégories sont
 * chargées côté serveur depuis la base.
 */
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CategoryCarousel } from "@/components/product/CategoryCarousel";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { PromoBanner } from "@/components/product/PromoBanner";
import { Features } from "@/components/product/Features";
import { Testimonials } from "@/components/product/Testimonials";
import { getFeaturedProducts, getCategoriesWithCounts } from "@/lib/data";
import { SITE } from "@/lib/site";

/** Titre de section avec la petite barre verte de la maquette. */
function SectionTitle({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h2 className="flex items-center gap-3 font-heading text-2xl font-bold text-navy sm:text-3xl">
        <span className="h-6 w-1.5 rounded-full bg-success" aria-hidden />
        {children}
      </h2>
      {action}
    </div>
  );
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategoriesWithCounts(),
  ]);

  return (
    <Container className="space-y-16 py-8">
      {/* ---------- Héro : offre Black Friday ---------- */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1c1c] via-[#111] to-black px-6 py-12 text-white sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-orange/10 to-transparent" />
        <div className="relative max-w-xl">
          <p className="text-sm tracking-[0.3em] text-white/70">OFFRE SPÉCIALE</p>
          <h1 className="mt-2 font-heading text-5xl font-bold text-white sm:text-6xl">
            BLACK <span className="text-orange">FRIDAY</span>
          </h1>
          <p className="mt-4 max-w-md text-white/80">
            Préparez-vous à profiter des plus grosses réductions de l&apos;année. Ne manquez pas nos
            offres exceptionnelles !
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-lg border-2 border-orange px-5 py-3">
            <span className="text-sm text-white/70">Jusqu&apos;à</span>
            <span className="font-heading text-2xl font-bold text-orange">-50% DE RÉDUCTION</span>
          </div>
          <div className="mt-6">
            <Button href="/produits" size="lg">
              Commander maintenant
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/60">
            {SITE.addressLine1} · {SITE.phone}
          </p>
        </div>
      </section>

      {/* ---------- Catégories ---------- */}
      <section>
        <SectionTitle
          action={
            <Button href="/produits" variant="ghost" size="sm">
              Voir tout
            </Button>
          }
        >
          Nos différents produits
        </SectionTitle>
        <CategoryCarousel
          categories={categories.map((c) => ({
            slug: c.slug,
            name: c.name,
            icon: c.icon,
            count: c.count,
          }))}
        />
      </section>

      {/* ---------- Meilleures ventes ---------- */}
      <section>
        <SectionTitle>Nos meilleures ventes</SectionTitle>
        <ProductCarousel products={featured} />
      </section>

      {/* ---------- Bandeau promo ---------- */}
      <PromoBanner />

      {/* ---------- Avantages ---------- */}
      <Features />

      {/* ---------- Témoignages ---------- */}
      <Testimonials />
    </Container>
  );
}
