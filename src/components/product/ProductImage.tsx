/**
 * ProductImage.tsx — Image d'un produit (via next/image).
 * -----------------------------------------------------------------------------
 * S'utilise dans un conteneur `relative` : l'image remplit l'espace (fill).
 * `unoptimized` sert nos vignettes SVG locales. Si vous mettez de VRAIES photos
 * (jpg/png), vous pouvez retirer `unoptimized` pour profiter de l'optimisation.
 */
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductImage({
  src,
  alt,
  sizes = "(max-width: 768px) 50vw, 25vw",
  className,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized
      className={cn("object-contain", className)}
    />
  );
}
