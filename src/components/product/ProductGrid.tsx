/**
 * ProductGrid.tsx — Grille responsive de produits.
 * Le nombre de colonnes par défaut : 2 (mobile) → 3 → 4 (desktop).
 * Passez `className` pour l'adapter (ex: page produits avec sidebar).
 */
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/catalog";

export function ProductGrid({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4", className)}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
