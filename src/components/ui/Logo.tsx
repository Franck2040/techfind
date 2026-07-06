/**
 * Logo.tsx — Logo Techfind (pastille blanche, "Tech" foncé + "find" vert).
 * Cliquable : ramène à l'accueil. `onLight` adapte l'ombre sur fond clair.
 */
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Techfind — Accueil"
      className={cn(
        "inline-flex items-center rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-black/5",
        className,
      )}
    >
      <span className="font-heading text-xl font-bold tracking-tight">
        <span className="text-ink">Tech</span>
        <span className="text-success">find</span>
      </span>
    </Link>
  );
}
