"use client";
/**
 * ProductDetail.tsx — Bloc principal de la fiche produit (image + achat).
 * -----------------------------------------------------------------------------
 * Gère l'interactivité : image active, choix de la couleur/taille, quantité,
 * ajout au panier et "passer à l'achat" (ajoute puis va au paiement).
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Truck, RotateCcw, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { ProductImage } from "@/components/product/ProductImage";
import { GoogleIcon, FacebookIcon, WhatsappIcon } from "@/components/ui/SocialIcons";
import { formatPrice, parseList } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/catalog";

export function ProductDetail({
  product,
  categoryName,
}: {
  product: Product;
  categoryName: string;
}) {
  const router = useRouter();
  const { addItem } = useCart();

  const colors = parseList(product.colors);
  const sizes = parseList(product.sizes);
  const gallery = [product.image, ...parseList(product.gallery)];

  const [activeImage, setActiveImage] = useState(gallery[0]);
  const [color, setColor] = useState<string | undefined>(colors[0]);
  const [size, setSize] = useState<string | undefined>(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const outOfStock = product.stock <= 0;
  const sku = `TF-${product.id.slice(-6).toUpperCase()}`;

  function buildCartItem() {
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      stock: product.stock,
      color,
      size,
    };
  }

  function handleAdd() {
    if (outOfStock) return;
    addItem(buildCartItem());
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    if (outOfStock) return;
    addItem(buildCartItem());
    router.push("/paiement");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* ---------- Galerie ---------- */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-xl border border-line bg-white">
          <ProductImage src={activeImage} alt={product.name} sizes="(max-width:1024px) 100vw, 45vw" />
        </div>
        {gallery.length > 1 && (
          <div className="mt-4 flex gap-3">
            {gallery.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(img)}
                aria-label={`Voir l'image ${i + 1}`}
                className={`relative size-20 overflow-hidden rounded-lg border bg-white ${
                  activeImage === img ? "border-navy" : "border-line"
                }`}
              >
                <ProductImage src={img} alt="" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Infos + achat ---------- */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy sm:text-3xl">{product.name}</h1>
        <p className="mt-3 text-2xl font-bold text-navy">{formatPrice(product.price)}</p>

        <div className="mt-3 flex items-center gap-3">
          <Rating value={product.rating} />
          <span className="text-sm text-muted">
            {product.reviewsCount > 0
              ? `${product.reviewsCount} avis`
              : "Aucun commentaire pour le moment"}
          </span>
        </div>

        {/* Disponibilité */}
        <p className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-ink">Disponibilité :</span>
          {outOfStock ? (
            <span className="font-medium text-danger">Rupture de stock</span>
          ) : (
            <span className="flex items-center gap-1 font-medium text-success">
              <Check className="size-4" aria-hidden /> En stock
            </span>
          )}
        </p>
        {!outOfStock && (
          <p className="mt-1 text-sm text-muted">
            Plus que {product.stock} de ce produit en stock !
          </p>
        )}

        <hr className="my-6 border-line" />

        {/* Couleur */}
        {colors.length > 0 && (
          <div className="mb-5 flex items-center gap-4">
            <span className="text-sm text-ink">Couleur :</span>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Couleur ${c}`}
                  aria-pressed={color === c}
                  style={{ backgroundColor: c }}
                  className={`size-7 rounded-full border ${
                    color === c ? "ring-2 ring-navy ring-offset-2" : "border-line"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Taille */}
        {sizes.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-4">
            <span className="text-sm text-ink">Taille :</span>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`rounded-md border px-3 py-1.5 text-sm ${
                    size === s ? "border-navy bg-navy text-white" : "border-line text-ink"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantité */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-sm text-ink">Quantité :</span>
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={Math.max(1, product.stock)}
          />
        </div>

        {/* Boutons d'achat */}
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleAdd} disabled={outOfStock}>
            {added ? "Ajouté ✓" : "Ajouter au panier"}
          </Button>
          <Button onClick={handleBuyNow} variant="primary" disabled={outOfStock} className="bg-orange-light">
            Passer à l&apos;achat
          </Button>
          <button
            type="button"
            onClick={() => setWished((v) => !v)}
            aria-pressed={wished}
            aria-label="Ajouter aux favoris"
            className="flex size-11 items-center justify-center rounded-full border border-line text-navy hover:bg-surface"
          >
            <Heart className={wished ? "size-5 fill-danger text-danger" : "size-5"} aria-hidden />
          </button>
        </div>

        {/* Métadonnées */}
        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="text-ink">Réf. (SKU) :</dt>
            <dd className="text-muted">{sku}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink">Catégorie :</dt>
            <dd className="text-muted">{categoryName}</dd>
          </div>
        </dl>

        {/* Partage */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-ink">Partager :</span>
          <GoogleIcon className="size-5" />
          <FacebookIcon className="size-5" />
          <WhatsappIcon className="size-5" />
        </div>

        {/* Réassurance livraison */}
        <div className="mt-6 space-y-4 rounded-xl border border-line p-4">
          <div className="flex items-start gap-3">
            <Truck className="mt-0.5 size-5 text-navy" aria-hidden />
            <div>
              <p className="font-medium text-navy">Livraison gratuite</p>
              <p className="text-sm text-muted">
                Renseignez votre lieu d&apos;habitation pour voir les détails de livraison.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RotateCcw className="mt-0.5 size-5 text-navy" aria-hidden />
            <div>
              <p className="font-medium text-navy">Retour de colis</p>
              <p className="text-sm text-muted">30 jours satisfait ou remboursé.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
