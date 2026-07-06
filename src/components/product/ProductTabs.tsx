"use client";
/**
 * ProductTabs.tsx — Onglets "Description" / "Commentaire" de la fiche produit.
 * La zone d'avis est un espace réservé (aucun avis pour l'instant) ; le bouton
 * renvoie vers la page contact pour donner son avis.
 */
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function ProductTabs({ description }: { description: string }) {
  const [tab, setTab] = useState<"description" | "avis">("description");

  const tabClass = (active: boolean) =>
    cn(
      "rounded-full px-6 py-2.5 text-sm font-medium transition-colors",
      active ? "bg-navy text-white" : "border border-line text-navy hover:bg-surface",
    );

  return (
    <div>
      <div className="flex justify-center gap-4">
        <button type="button" onClick={() => setTab("description")} className={tabClass(tab === "description")}>
          Description
        </button>
        <button type="button" onClick={() => setTab("avis")} className={tabClass(tab === "avis")}>
          Commentaire
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-line p-6">
        {tab === "description" ? (
          <p className="leading-relaxed text-muted">{description}</p>
        ) : (
          <div>
            <h3 className="font-heading text-lg font-semibold text-navy">Avis des clients</h3>
            <p className="mt-2 text-muted">Aucun commentaire pour le moment.</p>
            <Button href="/contact" variant="dark" className="mt-4">
              Donner votre avis
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
