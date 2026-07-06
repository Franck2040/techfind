"use client";
/**
 * paiement/page.tsx — Page de paiement (checkout).
 * -----------------------------------------------------------------------------
 * Composant client : rassemble les coordonnées de livraison + le panier, puis
 * appelle l'action serveur `createOrder`. Le serveur RECALCULE le total et
 * vérifie le stock avant de créer la commande (voir lib/actions/order.ts).
 */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Label, Input, FieldError } from "@/components/ui/FormField";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/actions/order";
import { formatPrice } from "@/lib/utils";

type Errors = Record<string, string[] | undefined>;

const paymentOptions = [
  { value: "livraison", label: "Payer à la livraison" },
  { value: "mobile", label: "Mobile Money (Orange / MTN)" },
  { value: "carte", label: "Carte bancaire" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, isReady, clearCart } = useCart();
  const [payment, setPayment] = useState("livraison");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (isReady && items.length === 0) {
    return (
      <Container className="py-8">
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Achat" }]} />
        <div className="mt-10 rounded-xl border border-dashed border-line py-20 text-center text-muted">
          Votre panier est vide.{" "}
          <Button href="/produits" variant="secondary" className="ml-2">
            Voir les produits
          </Button>
        </div>
      </Container>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setMessage(null);

    const fd = new FormData(e.currentTarget);
    const form = {
      firstName: fd.get("firstName"),
      company: fd.get("company") ?? "",
      address: fd.get("address"),
      apartment: fd.get("apartment") ?? "",
      city: fd.get("city"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      paymentMethod: payment,
    };
    // On n'envoie que l'ID, la quantité et la variante : le serveur fixe le prix.
    const payloadItems = items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      color: i.color,
      size: i.size,
    }));

    startTransition(async () => {
      const result = await createOrder({ form, items: payloadItems });
      if (result.ok) {
        clearCart();
        router.push(`/commande/${result.orderId}`);
      } else {
        setErrors(result.fieldErrors ?? {});
        setMessage(result.message ?? "Une erreur est survenue.");
      }
    });
  }

  return (
    <Container className="space-y-8 py-8">
      <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Achat" }]} />

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* ---------- Coordonnées de livraison ---------- */}
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-navy">Adresse de livraison</h2>

          <div>
            <Label htmlFor="firstName">Prénom *</Label>
            <Input id="firstName" name="firstName" autoComplete="given-name" />
            <FieldError messages={errors.firstName} />
          </div>
          <div>
            <Label htmlFor="company">Société (optionnel)</Label>
            <Input id="company" name="company" autoComplete="organization" />
          </div>
          <div>
            <Label htmlFor="address">Adresse *</Label>
            <Input id="address" name="address" autoComplete="street-address" />
            <FieldError messages={errors.address} />
          </div>
          <div>
            <Label htmlFor="apartment">Appartement, étage, etc. (optionnel)</Label>
            <Input id="apartment" name="apartment" />
          </div>
          <div>
            <Label htmlFor="city">Quartier / Ville *</Label>
            <Input id="city" name="city" autoComplete="address-level2" />
            <FieldError messages={errors.city} />
          </div>
          <div>
            <Label htmlFor="phone">Numéro de téléphone *</Label>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+237 6XX XX XX XX" />
            <FieldError messages={errors.phone} />
          </div>
          <div>
            <Label htmlFor="email">Adresse email *</Label>
            <Input id="email" name="email" type="email" autoComplete="email" />
            <FieldError messages={errors.email} />
          </div>

          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" name="save" className="size-4 accent-orange" />
            Sauvegarder ces informations pour mes prochains paiements
          </label>
        </div>

        {/* ---------- Récapitulatif + paiement ---------- */}
        <aside className="h-fit space-y-5 rounded-xl border border-line p-5">
          <h2 className="font-heading text-lg font-semibold text-navy">Votre commande</h2>

          <ul className="space-y-3">
            {items.map((i) => (
              <li key={`${i.productId}-${i.color}-${i.size}`} className="flex justify-between gap-3 text-sm">
                <span className="text-ink">
                  {i.name} <span className="text-muted">× {i.quantity}</span>
                </span>
                <span className="font-medium text-navy">{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>

          <hr className="border-line" />
          <div className="flex justify-between text-sm">
            <span className="text-muted">Total</span>
            <span className="font-bold text-navy">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Livraison</span>
            <span className="font-medium text-success">Gratuite</span>
          </div>

          {/* Mode de paiement */}
          <fieldset className="space-y-2">
            <legend className="mb-1 text-sm font-medium text-navy">Mode de paiement</legend>
            {paymentOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="radio"
                  name="payment"
                  value={opt.value}
                  checked={payment === opt.value}
                  onChange={() => setPayment(opt.value)}
                  className="size-4 accent-orange"
                />
                {opt.label}
              </label>
            ))}
            {payment !== "livraison" && (
              <p className="text-xs text-muted">
                Paiement en ligne bientôt disponible : votre commande sera enregistrée et un
                conseiller vous contactera pour finaliser.
              </p>
            )}
          </fieldset>

          {message && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
              {message}
            </p>
          )}

          <Button type="submit" loading={pending} className="w-full">
            Valider la commande
          </Button>
        </aside>
      </form>
    </Container>
  );
}
