/**
 * categoryIcon.tsx — Associe un nom de catégorie à son icône (lucide).
 * On garde une petite table explicite pour ne PAS importer toute la librairie
 * d'icônes dans le bundle client. `name` = champ `icon` de la catégorie en base.
 */
import {
  Laptop,
  Smartphone,
  Tablet,
  Headphones,
  Gamepad2,
  Speaker,
  Camera,
  Watch,
  Mouse,
  Package,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Laptop,
  Smartphone,
  Tablet,
  Headphones,
  Gamepad2,
  Speaker,
  Camera,
  Watch,
  Mouse,
};

export function CategoryIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const Icon = (name && ICONS[name]) || Package; // Package = icône par défaut
  return <Icon className={className} aria-hidden />;
}
