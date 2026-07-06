/**
 * data.ts — Accès aux données (lecture) côté serveur.
 * -----------------------------------------------------------------------------
 * Centralise toutes les REQUÊTES de lecture (produits, catégories). Les
 * composants serveur importent ces fonctions au lieu d'appeler Prisma
 * directement : plus lisible, réutilisable et facile à faire évoluer.
 *
 * `server-only` empêche d'importer ce fichier (et donc la base) côté client.
 */
import "server-only";
import { prisma } from "@/lib/prisma";
import type { Product, Category } from "@prisma/client";

export type { Product, Category };

/** Options de filtrage/tri de la liste de produits (page Produits). */
export type ProductFilter = {
  categories?: string[]; // slugs de catégories à inclure
  inStock?: boolean; // uniquement les produits en stock
  search?: string; // recherche par nom
  sort?: "recent" | "price-asc" | "price-desc" | "rating";
};

/** Traduit l'option de tri en clause Prisma `orderBy`. */
function orderByFromSort(sort: ProductFilter["sort"]) {
  switch (sort) {
    case "price-asc":
      return { price: "asc" as const };
    case "price-desc":
      return { price: "desc" as const };
    case "rating":
      return { rating: "desc" as const };
    default:
      return { createdAt: "desc" as const };
  }
}

/** Liste les produits selon les filtres. */
export async function getProducts(filter: ProductFilter = {}): Promise<Product[]> {
  return prisma.product.findMany({
    where: {
      ...(filter.categories && filter.categories.length > 0
        ? { category: { slug: { in: filter.categories } } }
        : {}),
      ...(filter.inStock ? { stock: { gt: 0 } } : {}),
      // NB: SQLite fait un LIKE insensible à la casse pour l'ASCII.
      ...(filter.search ? { name: { contains: filter.search } } : {}),
    },
    orderBy: orderByFromSort(filter.sort),
  });
}

/** Produits mis en avant sur l'accueil (limités). */
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/** Un produit + sa catégorie (utile sur la fiche produit). */
export type ProductWithCategory = Product & { category: Category };
export async function getProductBySlug(
  slug: string,
): Promise<ProductWithCategory | null> {
  return prisma.product.findUnique({ where: { slug }, include: { category: true } });
}

/** Produits similaires (même catégorie, en excluant le produit courant). */
export async function getRelatedProducts(
  product: Pick<Product, "id" | "categoryId">,
  limit = 4,
): Promise<Product[]> {
  return prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    take: limit,
  });
}

/** Toutes les catégories. */
export async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

/** Catégories AVEC le nombre de produits (pour les filtres et l'accueil). */
export type CategoryWithCount = Category & { count: number };
export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const cats = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return cats.map(({ _count, ...c }) => ({ ...c, count: _count.products }));
}

/** Nombre total de produits (pour "Toutes les catégories"). */
export async function getProductCount(): Promise<number> {
  return prisma.product.count();
}

/** Une commande avec ses lignes (page de confirmation). */
export async function getOrderById(id: string) {
  return prisma.order.findUnique({ where: { id }, include: { items: true } });
}

/** Les commandes d'un utilisateur (page compte), plus récentes d'abord. */
export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}
