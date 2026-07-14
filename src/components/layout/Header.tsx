"use client";
/**
 * Header.tsx — En-tête du site (barre supérieure navy + barre de navigation).
 * -----------------------------------------------------------------------------
 * Affiché sur toutes les pages "boutique" (voir app/(shop)/layout.tsx).
 * Reçoit du serveur :
 *  - user       : l'utilisateur connecté (ou null)
 *  - categories : la liste des catégories (pour le menu "Parcourir")
 *
 * Interactivité (client) : badge du panier, menu mobile (tiroir), menu
 * déroulant "Parcourir", et la barre de recherche.
 *
 * Où modifier les liens de navigation : le tableau `navLinks` ci-dessous.
 */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  ChevronDown,
  MapPin,
  Truck,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Drawer } from "@/components/ui/Drawer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type Cat = { slug: string; name: string };

// Liens principaux de la barre de navigation.
const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Qui sommes nous ?", href: "/a-propos" },
  { label: "Nous contacter", href: "/contact" },
];

export function Header({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const { user } = useAuth();
  const { totalItems, isReady } = useCart();
  const [menuOpen, setMenuOpen] = useState(false); // tiroir mobile
  const [browseOpen, setBrowseOpen] = useState(false); // menu "Parcourir" desktop

  // Soumission de la recherche : redirige vers /produits?q=...
  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim() ?? "";
    router.push(q ? `/produits?q=${encodeURIComponent(q)}` : "/produits");
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      {/* ---------- Barre supérieure (navy) ---------- */}
      <div className="bg-navy text-white">
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6 lg:px-8">
          <Logo />

          {/* Recherche */}
          <form onSubmit={onSearch} className="relative flex flex-1 items-center" role="search">
            <input
              type="search"
              name="q"
              placeholder="Rechercher un produit"
              aria-label="Rechercher un produit"
              className="w-full rounded-full bg-white py-2.5 pl-4 pr-24 text-sm text-ink placeholder:text-faint focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 rounded-full bg-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-light sm:px-5"
            >
              <span className="hidden sm:inline">Search</span>
              <Search className="size-4 sm:hidden" aria-hidden />
            </button>
          </form>

          {/* Compte + Panier (desktop) */}
          <div className="hidden items-center gap-5 lg:flex">
            {user ? (
              <Link href="/compte" className="flex items-center gap-2 text-sm hover:text-orange-light">
                <User className="size-5" aria-hidden />
                <span className="max-w-28 truncate">{user.name}</span>
              </Link>
            ) : (
              <Link href="/connexion" className="flex items-center gap-2 text-sm hover:text-orange-light">
                <User className="size-5" aria-hidden />
                se connecter
              </Link>
            )}
            <CartLink totalItems={totalItems} isReady={isReady} />
          </div>

          {/* Bouton menu (mobile) */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className="lg:hidden"
          >
            <Menu className="size-7" aria-hidden />
          </button>
        </div>
      </div>

      {/* ---------- Barre de navigation (blanche, desktop) ---------- */}
      <div className="hidden border-b border-line bg-white lg:block">
        <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-4 sm:px-6 lg:px-8">
          {/* Menu "Parcourir" (catégories) */}
          <div
            className="relative"
            onMouseLeave={() => setBrowseOpen(false)}
          >
            <button
              type="button"
              onClick={() => setBrowseOpen((v) => !v)}
              onMouseEnter={() => setBrowseOpen(true)}
              aria-expanded={browseOpen}
              className="my-2 flex items-center gap-2 rounded-md bg-orange px-5 py-2.5 font-medium text-white"
            >
              Parcourir
              <ChevronDown className="size-4" aria-hidden />
            </button>
            {browseOpen && (
              <div className="absolute left-0 top-full z-50 w-60 rounded-lg border border-line bg-white py-2 shadow-lg">
                <Link
                  href="/produits"
                  className="block px-4 py-2 text-sm text-ink hover:bg-surface"
                >
                  Tous les produits
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/produits?categorie=${c.slug}`}
                    className="block px-4 py-2 text-sm text-ink hover:bg-surface"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <nav className="flex items-center gap-7 text-sm text-ink">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="py-3 hover:text-orange">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-6 text-sm text-ink">
            <Link href="/nos-magasins" className="flex items-center gap-2 hover:text-orange">
              <MapPin className="size-4" aria-hidden /> Nos Magasins
            </Link>
            <Link href="/compte" className="flex items-center gap-2 hover:text-orange">
              <Truck className="size-4" aria-hidden /> Suivez votre colis
            </Link>
          </div>
        </div>
      </div>

      {/* ---------- Menu mobile (tiroir) ---------- */}
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Menu">
        <nav className="flex flex-col gap-1">
          <Link
            href="/produits"
            onClick={() => setMenuOpen(false)}
            className="rounded-md bg-orange px-4 py-3 font-medium text-white"
          >
            Parcourir les produits
          </Link>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-4 py-3 text-ink hover:bg-surface"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/nos-magasins"
            onClick={() => setMenuOpen(false)}
            className="rounded-md px-4 py-3 text-ink hover:bg-surface"
          >
            Nos magasins
          </Link>

          <div className="my-2 h-px bg-line" />

          {/* Catégories */}
          <span className="px-4 pb-1 text-xs font-semibold uppercase text-muted">Catégories</span>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/produits?categorie=${c.slug}`}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-4 py-2 text-sm text-ink hover:bg-surface"
            >
              {c.name}
            </Link>
          ))}

          <div className="my-2 h-px bg-line" />

          {user ? (
            <Link
              href="/compte"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-4 py-3 text-ink hover:bg-surface"
            >
              <User className="size-5" aria-hidden /> {user.name}
            </Link>
          ) : (
            <Link
              href="/connexion"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-4 py-3 text-ink hover:bg-surface"
            >
              <User className="size-5" aria-hidden /> Se connecter
            </Link>
          )}
          <Link
            href="/panier"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-md px-4 py-3 text-ink hover:bg-surface"
          >
            <ShoppingCart className="size-5" aria-hidden /> Panier
            {isReady && totalItems > 0 && (
              <span className="ml-1 rounded-full bg-orange px-2 py-0.5 text-xs text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </Drawer>
    </header>
  );
}

/** Lien "Panier" avec pastille du nombre d'articles. */
function CartLink({ totalItems, isReady }: { totalItems: number; isReady: boolean }) {
  return (
    <Link href="/panier" className="relative flex items-center gap-2 text-sm hover:text-orange-light">
      <span className="relative">
        <ShoppingCart className="size-6" aria-hidden />
        {/* isReady évite un décalage d'hydratation (le panier vient du client) */}
        {isReady && totalItems > 0 && (
          <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-orange text-[11px] font-bold text-white">
            {totalItems}
          </span>
        )}
      </span>
      Panier
    </Link>
  );
}
