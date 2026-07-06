/**
 * commande/[id]/page.tsx — Confirmation de commande.
 * Affiche le récapitulatif après un achat. L'identifiant est un cuid non
 * devinable (sert de lien de confirmation).
 */
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getOrderById } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Confirmation de commande" };

const PAYMENT_LABELS: Record<string, string> = {
  livraison: "Paiement à la livraison",
  mobile: "Mobile Money",
  carte: "Carte bancaire",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  // Sécurité : si la commande est rattachée à un compte, seul son propriétaire
  // peut la consulter (évite qu'un autre utilisateur voie des données perso).
  // Les commandes "invité" (sans compte) restent accessibles via leur lien
  // unique et non devinable (l'identifiant sert de jeton de confirmation).
  if (order.userId) {
    const user = await getCurrentUser();
    if (!user || user.id !== order.userId) notFound();
  }

  return (
    <Container className="max-w-2xl space-y-8 py-12">
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-14 text-success" aria-hidden />
        <h1 className="mt-4 font-heading text-3xl font-bold text-navy">Merci pour votre commande !</h1>
        <p className="mt-2 text-muted">
          Votre commande <span className="font-medium text-navy">#{order.id.slice(-8).toUpperCase()}</span>{" "}
          a bien été enregistrée. Nous vous contacterons au {order.phone}.
        </p>
      </div>

      <div className="rounded-xl border border-line">
        <h2 className="border-b border-line px-5 py-3 font-heading font-semibold text-navy">
          Récapitulatif
        </h2>
        <ul className="divide-y divide-line">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3 px-5 py-3 text-sm">
              <span className="text-ink">
                {item.name} <span className="text-muted">× {item.quantity}</span>
                {item.size && <span className="text-muted"> · {item.size}</span>}
              </span>
              <span className="font-medium text-navy">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-line px-5 py-3">
          <span className="font-semibold text-navy">Total</span>
          <span className="font-bold text-navy">{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="grid gap-4 rounded-xl border border-line p-5 text-sm sm:grid-cols-2">
        <div>
          <h3 className="font-heading font-semibold text-navy">Livraison</h3>
          <p className="mt-1 text-muted">
            {order.firstName}
            <br />
            {order.address}
            {order.apartment ? `, ${order.apartment}` : ""}
            <br />
            {order.city}
          </p>
        </div>
        <div>
          <h3 className="font-heading font-semibold text-navy">Paiement</h3>
          <p className="mt-1 text-muted">{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</p>
          <p className="mt-1 text-muted">Statut : en attente de traitement</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button href="/produits">Continuer mes achats</Button>
        <Button href="/compte" variant="secondary">
          Voir mon compte
        </Button>
      </div>
    </Container>
  );
}
