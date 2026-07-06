/**
 * produits/page.tsx — Liste des produits avec filtres.
 * -----------------------------------------------------------------------------
 * Les filtres sont lus depuis l'URL (?categorie=...&stock=1&tri=...&q=...).
 * En Next 16, `searchParams` est asynchrone : on l'attend avec `await`.
 */
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { MobileFilters } from "@/components/product/MobileFilters";
import { PromoBanner } from "@/components/product/PromoBanner";
import {
  getProducts,
  getCategoriesWithCounts,
  getProductCount,
  type ProductFilter,
} from "@/lib/data";

export const metadata = { title: "Produits" };

const ALLOWED_SORT = ["recent", "price-asc", "price-desc", "rating"] as const;

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  // Lecture sûre des paramètres (on ne garde que des chaînes).
  const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);
  const categorie = str(sp.categorie) ?? "";
  const selectedCats = categorie.split(",").filter(Boolean);
  const inStock = str(sp.stock) === "1";
  const search = str(sp.q);
  const rawSort = str(sp.tri);
  const sort = (ALLOWED_SORT as readonly string[]).includes(rawSort ?? "")
    ? (rawSort as ProductFilter["sort"])
    : undefined;

  const [products, categories, total] = await Promise.all([
    getProducts({ categories: selectedCats, inStock, search, sort }),
    getCategoriesWithCounts(),
    getProductCount(),
  ]);

  const catList = categories.map((c) => ({ slug: c.slug, name: c.name, count: c.count }));

  return (
    <Container className="space-y-10 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Produits" }]} />
        <MobileFilters categories={catList} totalCount={total} />
      </div>

      {search && (
        <p className="text-muted">
          Résultats pour «&nbsp;<span className="font-medium text-navy">{search}</span>&nbsp;»
        </p>
      )}

      <div className="flex gap-8">
        {/* Filtres (colonne fixe, desktop) */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-28 rounded-xl border border-line p-5">
            <FilterSidebar categories={catList} totalCount={total} />
          </div>
        </aside>

        {/* Liste */}
        <div className="min-w-0 flex-1">
          {products.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line py-20 text-center text-muted">
              Aucun produit ne correspond à votre recherche.
            </div>
          ) : (
            <ProductGrid products={products} className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3" />
          )}
        </div>
      </div>

      <PromoBanner />
    </Container>
  );
}
