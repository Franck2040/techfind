/**
 * utils.ts — Petites fonctions utilitaires réutilisables.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn(...) — Fusionne des classes Tailwind proprement.
 * Permet de combiner des classes conditionnelles sans conflit
 * (ex: cn("px-2", isActive && "bg-orange", className)).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * formatPrice(120000) -> "120 000 FCFA".
 * Format français (séparateur de milliers). Les prix sont des entiers en FCFA.
 */
export function formatPrice(amount: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA`;
}

/**
 * parseList("a,b, c") -> ["a", "b", "c"].
 * Sert à lire les champs stockés en CSV (couleurs, tailles, galerie d'images).
 */
export function parseList(csv: string | null | undefined): string[] {
  if (!csv) return [];
  return csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
