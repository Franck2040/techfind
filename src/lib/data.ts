/**
 * data.ts — Accès aux données du catalogue.
 * -----------------------------------------------------------------------------
 * VERSION DÉMO : lit les données statiques de `catalog.ts` (aucune base de
 * données). Les fonctions restent `async` pour garder la même interface que la
 * version full-stack (les pages n'ont pas besoin de changer).
 */
import {
  products,
  categories,
  stores,
  type Product,
  type Category,
  type ProductWithCategory,
  type Store,
} from "@/lib/catalog";

export type { Product, Category, ProductWithCategory, Store };

/** Options de filtrage/tri de la liste de produits (page Produits). */
export type ProductFilter = {
  categories?: string[]; // slugs de catégories à inclure
  inStock?: boolean;
  search?: string;
  sort?: "recent" | "price-asc" | "price-desc" | "rating";
};

/** Trie une liste de produits selon l'option choisie. */
function sortProducts(list: Product[], sort: ProductFilter["sort"]): Product[] {
  const copy = [...list];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    default:
      return copy; // ordre du catalogue par défaut
  }
}

/** Liste les produits selon les filtres. */
export async function getProducts(filter: ProductFilter = {}): Promise<Product[]> {
  let list = products;

  if (filter.categories && filter.categories.length > 0) {
    const set = new Set(filter.categories);
    list = list.filter((p) => set.has(p.categorySlug));
  }
  if (filter.inStock) {
    list = list.filter((p) => p.stock > 0);
  }
  if (filter.search) {
    const q = filter.search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }

  return sortProducts(list, filter.sort);
}

/** Produits mis en avant sur l'accueil (limités). */
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return products.filter((p) => p.featured).slice(0, limit);
}

/** Un produit + sa catégorie (ou null si introuvable). */
export async function getProductBySlug(
  slug: string,
): Promise<ProductWithCategory | null> {
  const product = products.find((p) => p.slug === slug);
  if (!product) return null;
  const category =
    categories.find((c) => c.slug === product.categorySlug) ?? categories[0];
  return { ...product, category };
}

/** Produits similaires (même catégorie, en excluant le produit courant). */
export async function getRelatedProducts(
  product: Pick<Product, "id" | "categorySlug">,
  limit = 4,
): Promise<Product[]> {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
}

/** Toutes les catégories. */
export async function getCategories(): Promise<Category[]> {
  return categories;
}

/** Catégories AVEC le nombre de produits (pour les filtres et l'accueil). */
export type CategoryWithCount = Category & { count: number };
export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  return categories.map((c) => ({
    ...c,
    count: products.filter((p) => p.categorySlug === c.slug).length,
  }));
}

/** Nombre total de produits. */
export async function getProductCount(): Promise<number> {
  return products.length;
}

/** Liste des magasins physiques (page "Nos Magasins"). */
export async function getStores(): Promise<Store[]> {
  return stores;
}
