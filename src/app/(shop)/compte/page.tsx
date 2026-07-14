"use client";
/**
 * compte/page.tsx — Espace compte (mode démo). PAGE PROTÉGÉE.
 * -----------------------------------------------------------------------------
 * Réservé aux utilisateurs connectés (via AuthContext, côté navigateur) : si
 * personne n'est connecté, on redirige vers /connexion. Affiche le profil et
 * les commandes passées dans ce navigateur.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProfileForm } from "@/components/account/ProfileForm";
import { useAuth } from "@/context/AuthContext";
import { getOrders, type DemoOrder } from "@/lib/demoOrders";
import { formatPrice } from "@/lib/utils";

export default function AccountPage() {
  const { user, isReady, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<DemoOrder[]>([]);

  // Redirection si non connecté (une fois l'état chargé).
  useEffect(() => {
    if (isReady && !user) router.replace("/connexion");
  }, [isReady, user, router]);

  // Charge les commandes de l'utilisateur (ce navigateur).
  useEffect(() => {
    if (user) setOrders(getOrders().filter((o) => o.email === user.email));
  }, [user]);

  if (!isReady || !user) {
    return <Container className="py-20 text-center text-muted">Chargement…</Container>;
  }

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
            <div className="mt-3 border-t border-line pt-3">
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="text-sm text-danger hover:underline"
              >
                Se déconnecter
              </button>
            </div>
          </nav>
        </aside>

        {/* Contenu */}
        <div className="space-y-8">
          <div id="profil">
            <ProfileForm />
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
                      <p className="font-heading font-semibold text-navy">
                        Commande #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm text-muted">
                        {dateFmt.format(new Date(order.createdAt))} · {order.items.length} article(s)
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="rounded-full bg-sky-soft px-3 py-1 text-xs font-medium text-navy">
                        En attente
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
