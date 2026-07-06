"use client";
/**
 * MobileFilters.tsx — Bouton "Filtrer" + tiroir contenant les filtres (mobile).
 * Sur desktop, les filtres sont affichés directement dans une colonne (aside).
 */
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { FilterSidebar } from "@/components/product/FilterSidebar";

type Cat = { slug: string; name: string; count: number };

export function MobileFilters({
  categories,
  totalCount,
}: {
  categories: Cat[];
  totalCount: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-medium text-navy"
      >
        <SlidersHorizontal className="size-4" aria-hidden /> Filtrer
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Filtres">
        <FilterSidebar categories={categories} totalCount={totalCount} />
      </Drawer>
    </div>
  );
}
