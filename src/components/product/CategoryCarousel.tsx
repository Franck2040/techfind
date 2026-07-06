"use client";
/**
 * CategoryCarousel.tsx — Carrousel des catégories (accueil : "Nos différents
 * produits"). Chaque carte mène à la liste filtrée sur la catégorie.
 */
import Link from "next/link";
import { ScrollRow } from "@/components/product/ScrollRow";
import { CategoryIcon } from "@/components/product/categoryIcon";

type Cat = { slug: string; name: string; icon: string | null; count: number };

export function CategoryCarousel({ categories }: { categories: Cat[] }) {
  return (
    <ScrollRow>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/produits?categorie=${c.slug}`}
          className="flex w-56 shrink-0 snap-start items-center gap-3 rounded-xl border border-line bg-white p-4 transition-colors hover:border-orange"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-surface text-navy">
            <CategoryIcon name={c.icon} className="size-6" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-heading font-semibold text-navy">{c.name}</span>
            <span className="text-xs text-muted">{c.count} produits</span>
          </span>
        </Link>
      ))}
    </ScrollRow>
  );
}
