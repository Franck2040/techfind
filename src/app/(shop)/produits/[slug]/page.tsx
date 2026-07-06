/**
 * produits/[slug]/page.tsx — Fiche d'un produit.
 * `[slug]` = segment dynamique (ex: /produits/casque-bluetooth).
 * En Next 16, `params` est asynchrone : on l'attend avec `await`.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductTabs } from "@/components/product/ProductTabs";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";

// Métadonnées dynamiques (titre = nom du produit) pour le SEO.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Produit introuvable" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // Produit inexistant -> page 404.
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  return (
    <Container className="space-y-12 py-8">
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Produits", href: "/produits" },
          { label: product.name },
        ]}
      />

      <ProductDetail product={product} categoryName={product.category.name} />

      <ProductTabs description={product.description} />

      {related.length > 0 && (
        <section>
          <h2 className="mb-6 font-heading text-2xl font-bold text-navy">Produits similaires</h2>
          <ProductCarousel products={related} />
        </section>
      )}
    </Container>
  );
}
