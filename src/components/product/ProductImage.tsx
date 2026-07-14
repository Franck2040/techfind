/**
 * ProductImage.tsx — Image d'un produit (via next/image).
 * -----------------------------------------------------------------------------
 * S'utilise dans un conteneur `relative` : l'image remplit l'espace (fill) et
 * recouvre le cadre (object-cover) pour un rendu de vraie boutique. Vercel
 * optimise automatiquement les images. Pour changer une photo, remplacez le
 * fichier /public/products/<slug>.jpg.
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
    <Image src={src} alt={alt} fill sizes={sizes} className={cn("object-cover", className)} />
  );
}
