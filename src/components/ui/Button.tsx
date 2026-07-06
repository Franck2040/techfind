/**
 * Button.tsx — Bouton réutilisable (la SEULE définition de bouton du site).
 * -----------------------------------------------------------------------------
 * Rôle : garantir des boutons cohérents partout (couleurs, tailles, états).
 * Props principales :
 *  - variant : "primary" (orange) | "secondary" (contour) | "danger" (rouge)
 *              | "dark" (navy) | "black" | "ghost"
 *  - size    : "sm" | "md" | "lg"
 *  - href    : si fourni, le bouton devient un lien (<Link>) au lieu d'un <button>
 *  - loading : affiche un indicateur et désactive le bouton
 *
 * Où modifier l'apparence : les objets `variants` et `sizes` ci-dessous.
 */
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "dark" | "black" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary: "bg-orange text-white hover:bg-orange-light",
  secondary: "border border-line bg-white text-ink hover:bg-surface",
  danger: "border border-danger bg-white text-danger hover:bg-danger/10",
  dark: "bg-navy text-white hover:bg-navy-2",
  black: "bg-ink text-white hover:bg-black",
  ghost: "text-navy hover:text-navy-2 hover:underline",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
};

// Un bouton peut être soit un vrai <button>, soit un lien <Link href>.
type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };
type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };
type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  // On extrait les props "logiques" ; `rest` ne contient plus que des attributs
  // HTML valides (href + attributs <a> pour un lien, ou attributs <button>).
  const {
    variant = "primary",
    size = "md",
    loading = false,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </>
  );

  // Variante LIEN (href fourni)
  if ("href" in props && props.href) {
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    return (
      <Link className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  // Variante BOUTON
  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} disabled={loading || buttonProps.disabled} {...buttonProps}>
      {content}
    </button>
  );
}
