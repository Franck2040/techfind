/**
 * compte/page.tsx — Espace compte (profil + commandes). PAGE PROTÉGÉE.
 * -----------------------------------------------------------------------------
 * Si l'utilisateur n'est pas connecté, on le redirige vers /connexion.
 * On y affiche : bienvenue + déconnexion, le formulaire de profil, et la liste
 * des commandes réelles de l'utilisateur.
 */
import { redirect } from "next/navigation";
import { User } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProfileForm } from "@/components/account/ProfileForm";
import { getCurrentUser } from "@/lib/auth";
import { getUserOrders } from "@/lib/data";
import { logoutAction } from "@/lib/actions/auth";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Mon compte" };

const STATUS_LABELS: Record<string, string> = {
  en_attente: "En attente",
  payee: "Payée",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion"); // protection : réservé aux connectés

  const orders = await getUserOrders(user.id);
  const dateFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

  return (
    <Container className="space-y-8 py-8">
      <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Compte" }]} />

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="h-fit space-y-6">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-line p-6 text-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-surface text-faint">
              <User className="size-10" aria-hidden />
            </span>
            <p className="text-lg">
              Bienvenue ! <span className="font-semibold text-orange">{user.name}</span>
            </p>
          </div>

          <nav className="rounded-xl border border-line p-4 text-sm">
            <p className="mb-2 font-heading font-semibold text-navy">Gérer mon compte</p>
            <ul className="space-y-1">
              <li>
                <a href="#profil" className="block rounded px-2 py-1 text-orange">
                  Mon profil
                </a>
              </li>
              <li>
                <a href="#commandes" className="block rounded px-2 py-1 text-ink hover:bg-surface">
                  Mes commandes
                </a>
              </li>
            </ul>
            {/* Déconnexion via une action serveur */}
            <form action={logoutAction} className="mt-3 border-t border-line pt-3">
              <button type="submit" className="text-sm text-danger hover:underline">
                Se déconnecter
              </button>
            </form>
          </nav>
        </aside>

        {/* Contenu */}
        <div className="space-y-8">
          <div id="profil">
            <ProfileForm name={user.name} email={user.email} address={user.address ?? ""} />
          </div>

          <section id="commandes">
            <h2 className="mb-4 font-heading text-lg font-semibold text-navy">Mes commandes</h2>
            {orders.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line py-12 text-center text-muted">
                Vous n&apos;avez pas encore de commande.
              </p>
            ) : (
              <ul className="space-y-3">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line p-4"
                  >
                    <div>
                      <a
                        href={`/commande/${order.id}`}
                        className="font-heading font-semibold text-navy hover:text-orange"
                      >
                        Commande #{order.id.slice(-8).toUpperCase()}
                      </a>
                      <p className="text-sm text-muted">
                        {dateFmt.format(order.createdAt)} · {order.items.length} article(s)
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="rounded-full bg-sky-soft px-3 py-1 text-xs font-medium text-navy">
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                      <span className="font-semibold text-navy">{formatPrice(order.total)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </Container>
  );
}
