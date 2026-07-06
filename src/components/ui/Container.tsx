/**
 * Container.tsx — Conteneur centré à largeur maximale.
 * Uniformise les marges latérales et la largeur du contenu sur tout le site.
 * Où modifier la largeur max : la classe `max-w-[1280px]`.
 */
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
