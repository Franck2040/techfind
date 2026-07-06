/**
 * (shop)/layout.tsx — Layout des pages "boutique".
 * -----------------------------------------------------------------------------
 * Le dossier (shop) est un "groupe de routes" : les parenthèses N'AJOUTENT PAS
 * de segment à l'URL. Toutes les pages ici partagent le Header + Footer + panier.
 * Les pages d'authentification (/connexion, /inscription) sont HORS de ce groupe
 * pour s'afficher en plein écran, sans header.
 *
 * On récupère ici (côté serveur) l'utilisateur connecté et les catégories,
 * transmis au Header.
 */
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCurrentUser } from "@/lib/auth";
import { getCategories } from "@/lib/data";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Chargées en parallèle pour la performance.
  const [user, categories] = await Promise.all([getCurrentUser(), getCategories()]);
  const cats = categories.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <CartProvider>
      <Header user={user} categories={cats} />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartProvider>
  );
}
