/**
 * Badge.tsx — Petite pastille (étiquette) arrondie.
 * Par défaut orange ; passez `className` pour changer la couleur.
 */
import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-orange px-3 py-1 text-xs font-medium text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
