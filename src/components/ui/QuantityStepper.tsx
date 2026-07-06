"use client";
/**
 * QuantityStepper.tsx — Sélecteur de quantité  [ - | n | + ].
 * Composant CONTRÔLÉ : le parent fournit `value` et reçoit les changements
 * via `onChange`. La valeur est bornée entre `min` et `max` (le stock).
 */
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center rounded-md border border-line", className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Diminuer la quantité"
        className="px-3 py-2 text-muted transition-colors hover:text-navy disabled:opacity-40"
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <span className="min-w-9 text-center text-sm font-medium" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Augmenter la quantité"
        className="px-3 py-2 text-muted transition-colors hover:text-navy disabled:opacity-40"
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
