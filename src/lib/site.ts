/**
 * site.ts — Informations et constantes du site (source unique).
 * -----------------------------------------------------------------------------
 * Centralise les coordonnées et méta-infos réutilisées dans le footer, la page
 * contact, la page à propos, etc. MODIFIEZ ICI pour changer partout.
 */
export const SITE = {
  name: "Techfind",
  tagline: "Votre boutique high-tech au Cameroun",
  phone: "+237 686 85 05 54",
  email: "kenmeugnetchoupo@gmail.com",
  addressLine1: "Cameroun, Yaoundé Titi Garage",
  addressLine2: "En face de L'hôtel Freezia",
  cities: "Yaoundé & Douala",
} as const;

/** Colonnes de liens du pied de page (libellé + destination). */
export const FOOTER_LINKS = {
  parcourir: {
    title: "Parcourir",
    links: [
      { label: "Pc Portables", href: "/produits?categorie=laptop" },
      { label: "Téléphones", href: "/produits?categorie=phone" },
      { label: "Montres connectées", href: "/produits?categorie=smartwatch" },
      { label: "Pièces & Accessoires", href: "/produits?categorie=accessory" },
      { label: "Rechercher un produit", href: "/produits" },
    ],
  },
  aide: {
    title: "Besoin d'aide",
    links: [
      { label: "Notre Histoire", href: "/a-propos" },
      { label: "Nos services de livraison", href: "/a-propos" },
      { label: "Politique de remboursement", href: "/a-propos" },
    ],
  },
  connaitre: {
    title: "Mieux nous connaître",
    links: [
      { label: "Nous contacter", href: "/contact" },
      { label: "Nos magasins", href: "/nos-magasins" },
      { label: "Notre politique", href: "/a-propos" },
      { label: "Tous les produits", href: "/produits" },
    ],
  },
} as const;
