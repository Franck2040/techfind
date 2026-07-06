/**
 * Breadcrumb.tsx — Fil d'Ariane (ex : Accueil > Produits > ...).
 * Props : items = [{ label, href? }]. Le dernier élément n'a pas de lien.
 */
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Fil d'Ariane" className={cn("flex flex-wrap items-center gap-2", className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="font-heading text-lg font-semibold text-navy hover:text-orange sm:text-xl"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className="font-heading text-lg font-semibold text-muted sm:text-xl"
              >
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="size-4 text-muted" aria-hidden />}
          </span>
        );
      })}
    </nav>
  );
}
