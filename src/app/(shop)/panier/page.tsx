"use client";
/**
 * panier/page.tsx — Page du panier.
 * -----------------------------------------------------------------------------
 * Composant client : lit/modifie le panier (CartContext). Les quantités se
 * mettent à jour instantanément. Le bouton mène au paiement où le total est
 * RECALCULÉ côté serveur (le total affiché ici est indicatif).
 */
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { ProductImage } from "@/components/product/ProductImage";
import { useCart, cartLineKey } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

export default function CartPage() {
  const { items, totalPrice, isReady, updateQuantity, removeItem, clearCart } = useCart();
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  // Tant que le panier n'est pas chargé (localStorage), on évite d'afficher
  // "panier vide" par erreur.
  if (!isReady) {
    return (
      <Container className="py-20 text-center text-muted">Chargement du panier…</Container>
    );
  }

  // Panier vide
  if (items.length === 0) {
    return (
      <Container className="py-8">
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Panier" }]} />
        <div className="mt-10 flex flex-col items-center gap-4 rounded-xl border border-dashed border-line py-20 text-center">
          <ShoppingBag className="size-12 text-faint" aria-hidden />
          <p className="text-muted">Votre panier est vide.</p>
          <Button href="/produits">Découvrir nos produits</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="space-y-8 py-8">
      <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Panier" }]} />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* ---------- Liste des articles ---------- */}
        <div>
          {/* En-tête (desktop) */}
          <div className="hidden rounded-t-lg bg-sky-soft px-4 py-3 text-sm font-medium text-navy sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_auto] sm:gap-4">
            <span>Produits</span>
            <span>Prix</span>
            <span>Quantité</span>
            <span>Total</span>
            <span className="sr-only">Retirer</span>
          </div>

          <ul className="divide-y divide-line border border-line sm:rounded-b-lg sm:border-t-0">
            {items.map((item) => {
              const key = cartLineKey(item);
              return (
                <li
                  key={key}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4 sm:grid-cols-[2fr_1fr_1fr_1fr_auto]"
                >
                  {/* Produit */}
                  <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
                    <div className="relative size-16 shrink-0 rounded-md border border-line bg-white">
                      <ProductImage src={item.image} alt={item.name} sizes="64px" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/produits/${item.slug}`}
                        className="font-heading font-semibold text-navy hover:text-orange"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted">
                        {item.color && (
                          <span className="mr-2 inline-flex items-center gap-1">
                            Couleur
                            <span
                              className="inline-block size-3 rounded-full border border-line align-middle"
                              style={{ backgroundColor: item.color }}
                            />
                          </span>
                        )}
                        {item.size && <span>Taille : {item.size}</span>}
                      </p>
                    </div>
                  </div>

                  {/* Prix unitaire */}
                  <div className="text-sm text-ink sm:text-base">
                    <span className="text-muted sm:hidden">Prix : </span>
                    {formatPrice(item.price)}
                  </div>

                  {/* Quantité */}
                  <div>
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(q) => updateQuantity(key, q)}
                      min={1}
                      max={Math.max(1, item.stock)}
                    />
                  </div>

                  {/* Total ligne */}
                  <div className="font-semibold text-navy">
                    {formatPrice(item.price * item.quantity)}
                  </div>

                  {/* Retirer */}
                  <button
                    type="button"
                    onClick={() => removeItem(key)}
                    aria-label={`Retirer ${item.name} du panier`}
                    className="justify-self-end rounded-full p-1.5 text-muted hover:bg-danger/10 hover:text-danger"
                  >
                    <X className="size-5" aria-hidden />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button href="/produits" variant="secondary">
              Continuer mes achats
            </Button>
            <Button onClick={clearCart} variant="danger">
              Vider le panier
            </Button>
          </div>
        </div>

        {/* ---------- Récapitulatif ---------- */}
        <aside className="h-fit rounded-xl border border-line">
          <h2 className="rounded-t-xl bg-sky-soft px-5 py-3 text-center font-heading font-semibold text-navy">
            Total de l&apos;achat
          </h2>
          <div className="space-y-4 p-5">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Sous-total</span>
              <span className="font-medium text-ink">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Livraison</span>
              <span className="font-medium text-success">Gratuite</span>
            </div>

            {/* Code promo (démo) */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Code promo"
                aria-label="Code promo"
                className="min-w-0 flex-1 rounded-lg border border-line px-3 py-2 text-sm focus:border-navy focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setCouponMsg("Aucun code promotionnel actif pour le moment.")}
                className="rounded-lg border border-line px-3 py-2 text-sm font-medium text-navy hover:bg-surface"
              >
                Appliquer
              </button>
            </div>
            {couponMsg && <p className="text-xs text-muted">{couponMsg}</p>}

            <hr className="border-line" />
            <div className="flex justify-between">
              <span className="font-semibold text-navy">Total</span>
              <span className="font-bold text-navy">{formatPrice(totalPrice)}</span>
            </div>

            <Button href="/paiement" className="w-full">
              Poursuivre vers le paiement
            </Button>
          </div>
        </aside>
      </div>
    </Container>
  );
}
