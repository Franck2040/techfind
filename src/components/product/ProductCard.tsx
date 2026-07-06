"use client";
/**
 * ProductCard.tsx — Vignette d'un produit (UNE seule définition, réutilisée
 * sur l'accueil, la liste produits, les produits similaires...).
 * -----------------------------------------------------------------------------
 * Affiche : image, favori (cœur), aperçu (œil), nom, prix, note, et un bouton
 * "Ajouter au panier" (ajoute la 1re variante par défaut, quantité 1).
 *
 * NB : le favori (cœur) est un simple état visuel local (non enregistré). Pour
 * une vraie liste de souhaits, il faudrait le persister (base + compte).
 */
import { useState } from "react";
import Link from "next/link";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { ProductImage } from "@/components/product/ProductImage";
import { Rating } from "@/components/ui/Rating";
import { useCart } from "@/context/CartContext";
import { formatPrice, parseList, cn } from "@/lib/utils";
import type { Product } from "@prisma/client";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const href = `/produits/${product.slug}`;
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    if (outOfStock) return;
    const colors = parseList(product.colors);
    const sizes = parseList(product.sizes);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: product.stock,
      color: colors[0], // variante par défaut
      size: sizes[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-md">
      {/* Zone image */}
      <div className="relative aspect-square bg-white p-4">
        <ProductImage src={product.image} alt={product.name} className="p-2" />

        {/* Lien invisible couvrant l'image (navigation vers la fiche) */}
        <Link href={href} className="absolute inset-0 z-10" aria-label={product.name} />

        {/* Favori + aperçu */}
        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setWished((v) => !v)}
            aria-pressed={wished}
            aria-label="Ajouter aux favoris"
            className="flex size-8 items-center justify-center rounded-full bg-sky-soft text-navy transition-colors hover:bg-sky"
          >
            <Heart className={cn("size-4", wished && "fill-danger text-danger")} aria-hidden />
          </button>
          <Link
            href={href}
            aria-label={`Aperçu de ${product.name}`}
            className="flex size-8 items-center justify-center rounded-full bg-sky-soft text-navy transition-colors hover:bg-sky"
          >
            <Eye className="size-4" aria-hidden />
          </Link>
        </div>

        {/* Barre "Ajouter au panier" */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-2 disabled:opacity-60"
        >
          <span>{outOfStock ? "Rupture de stock" : added ? "Ajouté ✓" : "Ajouter au panier"}</span>
          {!outOfStock && (
            <span className="flex size-6 items-center justify-center rounded-full bg-orange">
              <ShoppingCart className="size-3.5" aria-hidden />
            </span>
          )}
        </button>
      </div>

      {/* Infos */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Link href={href} className="font-heading font-semibold text-navy hover:text-orange">
          {product.name}
        </Link>
        <p className="font-semibold text-orange">{formatPrice(product.price)}</p>
        <Rating value={product.rating} count={product.reviewsCount} className="mt-auto pt-1" />
      </div>
    </div>
  );
}
