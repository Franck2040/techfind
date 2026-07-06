/**
 * Rating.tsx — Affiche une note en étoiles (lecture seule).
 * Props : value (0 à 5), count (nombre d'avis, optionnel).
 */
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  className,
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  const filled = Math.round(value); // nombre d'étoiles pleines

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex" role="img" aria-label={`Note : ${value} sur 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            aria-hidden
            className={cn(
              "size-4",
              i < filled ? "fill-orange text-orange" : "fill-line text-line",
            )}
          />
        ))}
      </div>
      {count !== undefined && <span className="text-xs text-muted">({count})</span>}
    </div>
  );
}
