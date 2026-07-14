/**
 * (shop)/layout.tsx — Layout des pages "boutique" (header + footer).
 * -----------------------------------------------------------------------------
 * Le dossier (shop) est un "groupe de routes" : les parenthèses N'AJOUTENT PAS
 * de segment à l'URL. Les providers (auth/panier) sont dans le layout racine.
 * On charge ici les catégories (statiques) pour le menu du header.
 */
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCategories } from "@/lib/data";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();
  const cats = categories.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <>
      <Header categories={cats} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
