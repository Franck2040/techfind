"use client";
/**
 * ScrollRow.tsx — Ligne de défilement horizontal avec flèches (carrousel).
 * Utilisée pour les catégories et les "meilleures ventes". Sur mobile on fait
 * défiler au doigt ; les flèches apparaissent sur écran large.
 */
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ScrollRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={ref}
        className="no-scrollbar flex snap-x gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {children}
      </div>

      {/* Flèches (masquées sur mobile, où l'on fait défiler au doigt) */}
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Précédent"
        className="absolute -left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-line bg-white p-2 text-navy shadow-sm hover:bg-surface lg:flex"
      >
        <ChevronLeft className="size-5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Suivant"
        className="absolute -right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-line bg-white p-2 text-navy shadow-sm hover:bg-surface lg:flex"
      >
        <ChevronRight className="size-5" aria-hidden />
      </button>
    </div>
  );
}
