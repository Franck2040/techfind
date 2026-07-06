import type { NextConfig } from "next";

/**
 * next.config.ts — Configuration Next.js.
 * -----------------------------------------------------------------------------
 * On y définit surtout les EN-TÊTES DE SÉCURITÉ (protègent contre le
 * clickjacking, le MIME-sniffing, les fuites d'infos...) et la configuration
 * des images distantes.
 *
 * Où modifier :
 *  - Ajouter un domaine d'images externes : `images.remotePatterns`.
 *  - Ajuster la politique de sécurité : `securityHeaders` ci-dessous.
 */

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy (CSP) : whitelist des sources autorisées.
 * NB : 'unsafe-inline' pour les styles est nécessaire à Next/Tailwind.
 *      'unsafe-eval' n'est requis qu'en développement (Fast Refresh) — on
 *      l'exclut en production pour un CSP plus strict.
 * Pour une prod exigeante, passez à un CSP à base de "nonce".
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'", // Interdit l'inclusion du site dans une iframe
  "base-uri 'self'",
  "form-action 'self'",
]
  .join("; ")
  .concat(";");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" }, // Anti-clickjacking (compat. anciens navigateurs)
  { key: "X-Content-Type-Options", value: "nosniff" }, // Empêche le MIME-sniffing
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()", // Bloque des API sensibles par défaut
  },
  // HSTS : force le HTTPS (n'a d'effet qu'en HTTPS, sans danger en local).
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  // Applique les en-têtes de sécurité à toutes les routes.
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  images: {
    // Autorise l'optimisation d'images externes. Ajoutez ici l'hôte de vos
    // vraies photos produit (ex : votre CDN). Par défaut le site utilise des
    // images locales dans /public, donc rien n'est requis pour démarrer.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
