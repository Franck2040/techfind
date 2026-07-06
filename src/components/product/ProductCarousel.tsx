"use client";
/**
 * ProductCarousel.tsx — Carrousel horizontal de produits (accueil : "Nos
 * meilleures ventes", et "Produits similaires" sur la fiche produit).
 */
import { ScrollRow } from "@/components/product/ScrollRow";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@prisma/client";

export function ProductCarousel({ products }: { products: Product[] }) {
  return (
    <ScrollRow>
      {products.map((p) => (
        <div key={p.id} className="w-60 shrink-0 snap-start sm:w-64">
          <ProductCard product={p} />
        </div>
      ))}
    </ScrollRow>
  );
}
