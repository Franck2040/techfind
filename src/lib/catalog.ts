/**
 * catalog.ts — Catalogue de la boutique (données statiques).
 * -----------------------------------------------------------------------------
 * VERSION DÉMO : pour un déploiement instantané sur Vercel sans base de données,
 * le catalogue est défini ici en dur (produits, catégories, magasins). Tout est
 * chargé en mémoire — rapide et fiable, idéal pour une vitrine.
 *
 * 👉 POUR AJOUTER/MODIFIER UN PRODUIT : éditez le tableau `products` ci-dessous.
 *    Les images se trouvent dans /public/products/<slug>.jpg
 *
 * (La version full-stack avec vraie base de données Prisma est sur la branche
 *  git `full-stack`.)
 */

export type Category = {
  slug: string;
  name: string;
  icon: string; // nom d'une icône lucide (voir categoryIcon.tsx)
};

export type Product = {
  id: string; // ici = slug (identifiant stable)
  slug: string;
  name: string;
  description: string;
  price: number; // en FCFA
  image: string; // chemin dans /public
  gallery?: string; // images secondaires (CSV) — optionnel
  stock: number;
  rating: number; // 0 à 5
  reviewsCount: number;
  brand?: string | null;
  colors?: string | null; // CSV de codes hex
  sizes?: string | null; // CSV
  featured: boolean; // mis en avant sur l'accueil
  categorySlug: string;
};

export type ProductWithCategory = Product & { category: Category };

// --- Catégories --------------------------------------------------------------
export const categories: Category[] = [
  { slug: "laptop", name: "Ordinateurs", icon: "Laptop" },
  { slug: "phone", name: "Téléphones", icon: "Smartphone" },
  { slug: "tablet", name: "Tablettes", icon: "Tablet" },
  { slug: "headphones", name: "Casques & Écouteurs", icon: "Headphones" },
  { slug: "console", name: "Consoles & Jeux", icon: "Gamepad2" },
  { slug: "speaker", name: "Enceintes", icon: "Speaker" },
  { slug: "camera", name: "Appareils photo", icon: "Camera" },
  { slug: "smartwatch", name: "Montres connectées", icon: "Watch" },
  { slug: "accessory", name: "Accessoires", icon: "Mouse" },
];

// Palette de couleurs réutilisable pour les variantes.
const C = {
  noir: "#111111",
  argent: "#C7CCD1",
  blanc: "#F4F4F5",
  bleu: "#1B5A7D",
  vert: "#3AAE3F",
};

// --- Produits ----------------------------------------------------------------
// (prix en FCFA, adaptés au marché camerounais)
const raw: Omit<Product, "id" | "image">[] = [
  {
    slug: "macbook-air-m3",
    name: 'MacBook Air M3 13"',
    description:
      "Ultraportable extrêmement fin et puissant grâce à la puce M3. Écran Liquid Retina, autonomie exceptionnelle et silence total (sans ventilateur). Parfait pour le travail nomade.",
    price: 850000,
    stock: 8,
    rating: 5,
    reviewsCount: 124,
    brand: "Apple",
    colors: [C.argent, C.noir].join(","),
    sizes: "256 Go,512 Go",
    featured: true,
    categorySlug: "laptop",
  },
  {
    slug: "pc-portable-pro-15",
    name: 'PC Portable Pro 15"',
    description:
      "Ordinateur portable polyvalent avec grand écran Full HD, SSD rapide et clavier confortable. Idéal pour les études, le travail et le multimédia.",
    price: 420000,
    stock: 15,
    rating: 4.5,
    reviewsCount: 88,
    brand: "TechPro",
    colors: [C.noir].join(","),
    sizes: "8 Go,16 Go",
    featured: true,
    categorySlug: "laptop",
  },
  {
    slug: "ordinateur-tout-en-un",
    name: 'Ordinateur tout-en-un 27"',
    description:
      "Un ordinateur de bureau élégant, tout intégré dans un écran 27 pouces haute résolution. Gain de place et design épuré pour la maison ou le bureau.",
    price: 650000,
    stock: 5,
    rating: 4.5,
    reviewsCount: 41,
    brand: "TechPro",
    colors: [C.argent].join(","),
    featured: false,
    categorySlug: "laptop",
  },
  {
    slug: "smartphone-galaxy-s24",
    name: "Smartphone Galaxy S24",
    description:
      "Smartphone haut de gamme : écran AMOLED lumineux, triple caméra performante, grande batterie et charge rapide. Un concentré de technologie.",
    price: 380000,
    stock: 22,
    rating: 4.5,
    reviewsCount: 156,
    brand: "Samsung",
    colors: [C.noir, C.bleu].join(","),
    sizes: "128 Go,256 Go",
    featured: true,
    categorySlug: "phone",
  },
  {
    slug: "tablette-pro-11",
    name: 'Tablette Pro 11"',
    description:
      "Tablette 11 pouces fine et puissante, idéale pour dessiner, travailler ou regarder des vidéos. Compatible stylet et clavier (vendus séparément).",
    price: 320000,
    stock: 10,
    rating: 4.5,
    reviewsCount: 63,
    brand: "TechPro",
    colors: [C.argent].join(","),
    sizes: "64 Go,256 Go",
    featured: false,
    categorySlug: "tablet",
  },
  {
    slug: "casque-bluetooth-premium",
    name: "Casque Bluetooth Premium",
    description:
      "Casque sans fil à réduction de bruit active, son riche et immersif. Coussinets confortables et jusqu'à 30h d'autonomie. Le compagnon idéal au quotidien.",
    price: 45000,
    stock: 30,
    rating: 5,
    reviewsCount: 210,
    brand: "SoundMax",
    colors: [C.noir].join(","),
    featured: true,
    categorySlug: "headphones",
  },
  {
    slug: "casque-gamer-pro",
    name: "Casque Gamer Pro RGB",
    description:
      "Casque gaming avec son surround 7.1, micro antibruit et éclairage RGB. Conçu pour de longues sessions de jeu confortables et immersives.",
    price: 32000,
    stock: 18,
    rating: 4.5,
    reviewsCount: 97,
    brand: "GamePro",
    colors: [C.noir].join(","),
    featured: false,
    categorySlug: "headphones",
  },
  {
    slug: "ecouteurs-tws",
    name: "Écouteurs sans fil TWS",
    description:
      "Écouteurs true wireless compacts avec boîtier de charge. Son clair, appairage instantané et résistance à la transpiration pour le sport.",
    price: 18000,
    stock: 40,
    rating: 4,
    reviewsCount: 132,
    brand: "SoundMax",
    colors: [C.blanc, C.noir].join(","),
    featured: false,
    categorySlug: "headphones",
  },
  {
    slug: "console-manette",
    name: "Console de jeux + Manette",
    description:
      "Console nouvelle génération livrée avec une manette sans fil. Jeux fluides en haute définition, chargement ultra-rapide. Le plaisir du jeu à la maison.",
    price: 280000,
    stock: 7,
    rating: 5,
    reviewsCount: 74,
    brand: "GameBox",
    colors: [C.blanc].join(","),
    featured: true,
    categorySlug: "console",
  },
  {
    slug: "enceinte-bluetooth",
    name: "Enceinte Bluetooth Hi-Fi",
    description:
      "Enceinte compacte au son puissant et équilibré, avec basses profondes. Parfaite pour la maison comme pour les soirées entre amis.",
    price: 55000,
    stock: 14,
    rating: 4.5,
    reviewsCount: 58,
    brand: "BoomAudio",
    colors: [C.noir].join(","),
    featured: false,
    categorySlug: "speaker",
  },
  {
    slug: "appareil-photo-reflex",
    name: "Appareil photo Reflex",
    description:
      "Appareil photo reflex pour des clichés nets et professionnels. Objectif interchangeable, mode manuel complet et vidéo Full HD.",
    price: 350000,
    stock: 6,
    rating: 5,
    reviewsCount: 39,
    brand: "PixPro",
    colors: [C.noir].join(","),
    featured: false,
    categorySlug: "camera",
  },
  {
    slug: "montre-connectee",
    name: "Montre connectée Sport",
    description:
      "Montre connectée avec suivi d'activité, fréquence cardiaque, GPS et notifications. Étanche et compatible Android/iOS. Restez connecté et en forme.",
    price: 65000,
    stock: 20,
    rating: 4.5,
    reviewsCount: 118,
    brand: "FitWatch",
    colors: [C.noir, C.bleu].join(","),
    sizes: "40mm,44mm",
    featured: true,
    categorySlug: "smartwatch",
  },
  {
    slug: "clavier-mecanique",
    name: "Clavier mécanique sans fil",
    description:
      "Clavier mécanique rétroéclairé au toucher réactif et satisfaisant. Sans fil, autonomie longue durée. Idéal pour la frappe et le jeu.",
    price: 25000,
    stock: 25,
    rating: 4.5,
    reviewsCount: 66,
    brand: "KeyTech",
    colors: [C.blanc, C.noir].join(","),
    featured: false,
    categorySlug: "accessory",
  },
  {
    slug: "souris-gamer",
    name: "Souris Gamer sans fil",
    description:
      "Souris gaming sans fil ultra-précise, légère et réactive. Capteur haute performance et clics durables pour prendre l'avantage.",
    price: 22000,
    stock: 28,
    rating: 4.5,
    reviewsCount: 84,
    brand: "GamePro",
    colors: [C.noir].join(","),
    featured: false,
    categorySlug: "accessory",
  },
  {
    slug: "disque-dur-2to",
    name: "Disque dur externe 2 To",
    description:
      "Stockez et sauvegardez toutes vos données en toute sécurité. 2 To d'espace, transfert rapide et format compact à emporter partout.",
    price: 48000,
    stock: 16,
    rating: 4.5,
    reviewsCount: 52,
    brand: "DataStore",
    colors: [C.noir].join(","),
    featured: false,
    categorySlug: "accessory",
  },
];

// On complète chaque produit avec son id (= slug) et le chemin de son image.
export const products: Product[] = raw.map((p) => ({
  ...p,
  id: p.slug,
  image: `/products/${p.slug}.jpg`,
}));

// --- Magasins physiques (page "Nos Magasins") --------------------------------
export type Store = {
  city: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  mapsQuery: string; // pour un lien Google Maps
};

export const stores: Store[] = [
  {
    city: "Yaoundé",
    name: "Techfind Yaoundé — Mimboman",
    address: "Titi Garage, en face de l'hôtel Freezia, Mimboman, Yaoundé",
    phone: "+237 686 85 05 54",
    hours: "Lun – Sam : 8h00 – 19h00",
    mapsQuery: "Mimboman Yaoundé Cameroun",
  },
  {
    city: "Yaoundé",
    name: "Techfind Yaoundé — Centre",
    address: "Avenue Kennedy, centre-ville, Yaoundé",
    phone: "+237 686 85 05 54",
    hours: "Lun – Sam : 8h30 – 18h30",
    mapsQuery: "Avenue Kennedy Yaoundé Cameroun",
  },
  {
    city: "Douala",
    name: "Techfind Douala — Akwa",
    address: "Boulevard de la Liberté, Akwa, Douala",
    phone: "+237 686 85 05 54",
    hours: "Lun – Sam : 8h00 – 19h00",
    mapsQuery: "Boulevard de la Liberté Akwa Douala Cameroun",
  },
];
