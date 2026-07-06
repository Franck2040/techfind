"use client";
/**
 * Drawer.tsx — Panneau coulissant (tiroir) pour le mobile.
 * Sert au menu de navigation et au panneau de filtres sur petit écran.
 * Accessibilité : rôle "dialog", fermeture par la touche Échap et par clic sur
 * le fond, blocage du défilement de la page quand le tiroir est ouvert.
 */
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Drawer({
  open,
  onClose,
  title,
  side = "left",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: "left" | "right";
  children: React.ReactNode;
}) {
  // Fermeture au clavier (Échap) + blocage du scroll de fond.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      {/* Fond semi-transparent (clic = fermeture) */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Panneau */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Menu"}
        className={cn(
          "absolute top-0 h-full w-[85%] max-w-sm bg-white shadow-xl transition-transform duration-300",
          side === "left" ? "left-0" : "right-0",
          open
            ? "translate-x-0"
            : side === "left"
              ? "-translate-x-full"
              : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-4">
          <span className="font-heading text-lg font-semibold text-navy">{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-full p-1 text-muted hover:bg-surface hover:text-navy"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="h-[calc(100%-4rem)] overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
