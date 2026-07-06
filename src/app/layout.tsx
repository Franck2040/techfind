/**
 * layout.tsx — Layout RACINE de l'application (obligatoire).
 * -----------------------------------------------------------------------------
 * Rôle : définit <html>/<body>, charge les polices et les métadonnées SEO
 * communes à TOUTES les pages. Il ne contient PAS le header/footer : ceux-ci
 * sont dans le layout du groupe (shop) pour que les pages d'authentification
 * (connexion/inscription) puissent s'afficher en plein écran sans header.
 *
 * Où modifier :
 *  - Polices : constantes `poppins` / `inter` ci-dessous.
 *  - Titre/description par défaut du site : objet `metadata`.
 */
import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

// Police des TITRES : Poppins (arrondie, fidèle à la maquette).
// On ne charge que les graisses utilisées pour alléger le site.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Police du CORPS de texte : Inter (très lisible).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Métadonnées par défaut (référencement / partage). Surchargées par page si besoin.
export const metadata: Metadata = {
  title: {
    default: "Techfind — Boutique high-tech au Cameroun",
    template: "%s | Techfind",
  },
  description:
    "Techfind : ordinateurs, téléphones, accessoires et matériel informatique de qualité au Cameroun. Livraison rapide et paiement sécurisé.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // lang="fr" : important pour l'accessibilité et le SEO (site en français).
    <html lang="fr" className={`${poppins.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
