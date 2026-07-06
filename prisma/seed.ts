/**
 * seed.ts — Remplissage initial de la base (catégories + produits).
 * -----------------------------------------------------------------------------
 * Lancer avec :  npm run db:seed
 * Le script est IDEMPOTENT (upsert par `slug`) : on peut le relancer sans créer
 * de doublons. Pour ajouter/modifier un produit, éditez le tableau `products`.
 * Les images pointent vers /public/products/<slug>.svg (générées par
 * scripts/generate-placeholders.mjs). Remplacez-les par vos vraies photos.
 */
import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const prisma = new PrismaClient();

/* ---------------------------------------------------------------------------
 * Génération d'images placeholder (SVG) — propres et à la charte Techfind.
 * Chaque produit sans photo reçoit une vignette avec ses initiales.
 * Remplacez simplement le fichier /public/products/<slug>.svg par une photo.
 * ------------------------------------------------------------------------- */
const ACCENT_BY_CATEGORY: Record<string, string> = {
  laptop: "#003F62",
  phone: "#58A0E2",
  tablet: "#1B5A7D",
  headphones: "#EDA415",
  console: "#3AAE3F",
  speaker: "#DB4444",
  camera: "#1B5A7D",
  smartwatch: "#58A0E2",
  accessory: "#EDA415",
};

function escapeXml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] ?? c);
}

function initials(name: string): string {
  const words = name.replace(/["'\d]/g, "").split(/\s+/).filter(Boolean);
  return ((words[0]?.[0] ?? "T") + (words[1]?.[0] ?? "F")).toUpperCase();
}

function placeholderSvg(name: string, accent: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" role="img" aria-label="${escapeXml(name)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#E2F4FF"/>
      <stop offset="1" stop-color="#F5F5F5"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bg)"/>
  <circle cx="300" cy="250" r="96" fill="#FFFFFF" stroke="${accent}" stroke-width="3"/>
  <text x="300" y="250" font-family="Poppins, Arial, sans-serif" font-size="76" font-weight="700" fill="${accent}" text-anchor="middle" dominant-baseline="central">${escapeXml(initials(name))}</text>
  <text x="300" y="404" font-family="Poppins, Arial, sans-serif" font-size="30" font-weight="600" fill="#003F62" text-anchor="middle">${escapeXml(name)}</text>
  <text x="300" y="446" font-family="Inter, Arial, sans-serif" font-size="18" fill="#606060" text-anchor="middle">Techfind</text>
</svg>`;
}

function ensurePlaceholder(slug: string, name: string, categorySlug: string): void {
  const dir = join(process.cwd(), "public", "products");
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${slug}.svg`);
  // On n'écrase PAS une image déjà présente (au cas où vous avez mis une vraie photo).
  if (!existsSync(file)) {
    writeFileSync(file, placeholderSvg(name, ACCENT_BY_CATEGORY[categorySlug] ?? "#003F62"), "utf8");
  }
}

// --- Catégories (icon = nom d'une icône lucide-react) ---
const categories = [
  { slug: "laptop", name: "Ordinateurs", icon: "Laptop" },
  { slug: "phone", name: "Téléphones", icon: "Smartphone" },
  { slug: "tablet", name: "Tablettes", icon: "Tablet" },
  { slug: "headphones", name: "Casques & Écouteurs", icon: "Headphones" },
  { slug: "console", name: "Consoles & Manettes", icon: "Gamepad2" },
  { slug: "speaker", name: "Enceintes", icon: "Speaker" },
  { slug: "camera", name: "Appareils photo", icon: "Camera" },
  { slug: "smartwatch", name: "Montres connectées", icon: "Watch" },
  { slug: "accessory", name: "Accessoires", icon: "Mouse" },
];

// Couleurs réutilisables (codes hex) pour les variantes produit.
const C = { noir: "#000000", blanc: "#FFFFFF", vert: "#3AAE3F", bleu: "#1B5A7D", orange: "#EDA415", rouge: "#DB4444" };

// --- Produits ---
const products = [
  {
    slug: "pc-portable-probook-14",
    name: "PC Portable ProBook 14\"",
    description:
      "Ordinateur portable fin et léger, écran 14 pouces Full HD, idéal pour le travail et les études. Autonomie longue durée et stockage SSD rapide.",
    price: 120000,
    stock: 12,
    rating: 4.5,
    reviewsCount: 88,
    brand: "ProBook",
    colors: [C.noir, C.blanc].join(","),
    sizes: "8Go RAM,16Go RAM",
    featured: true,
    categorySlug: "laptop",
  },
  {
    slug: "pc-gamer-rtx",
    name: "PC Gamer RTX",
    description:
      "Tour Gamer puissante avec carte graphique dédiée pour le jeu en haute résolution. Refroidissement optimisé et éclairage RGB.",
    price: 250000,
    stock: 6,
    rating: 4,
    reviewsCount: 75,
    brand: "TechFind",
    colors: [C.noir].join(","),
    sizes: "16Go RAM,32Go RAM",
    featured: true,
    categorySlug: "laptop",
  },
  {
    slug: "samsung-galaxy-a17",
    name: "Samsung Galaxy A17",
    description:
      "Smartphone Android élégant avec grand écran, triple caméra et grande batterie. Parfait équilibre entre performance et prix.",
    price: 80000,
    stock: 20,
    rating: 4.5,
    reviewsCount: 99,
    brand: "Samsung",
    colors: [C.noir, C.bleu].join(","),
    sizes: "64Go,128Go,256Go",
    featured: true,
    categorySlug: "phone",
  },
  {
    slug: "casque-bluetooth",
    name: "Casque Bluetooth",
    description:
      "Casque sans fil confortable avec réduction de bruit et son puissant. Jusqu'à 20h d'autonomie et micro intégré.",
    price: 10000,
    stock: 34,
    rating: 5,
    reviewsCount: 99,
    brand: "SoundMax",
    colors: [C.noir, C.blanc].join(","),
    featured: true,
    categorySlug: "headphones",
  },
  {
    slug: "manette-pc-console",
    name: "Manette PC / Console",
    description:
      "Manette sans fil ergonomique compatible PC et consoles. Prise en main précise, vibrations et longue autonomie.",
    price: 7000,
    stock: 34,
    rating: 4,
    reviewsCount: 40,
    brand: "GamePro",
    colors: [C.vert, C.noir].join(","),
    featured: false,
    categorySlug: "console",
  },
  {
    slug: "tablette-tab-x10",
    name: "Tablette Tab X10",
    description:
      "Tablette 10 pouces polyvalente pour naviguer, regarder des vidéos et travailler. Écran lumineux et batterie longue durée.",
    price: 95000,
    stock: 9,
    rating: 4.5,
    reviewsCount: 51,
    brand: "TabX",
    colors: [C.noir].join(","),
    sizes: "64Go,128Go",
    featured: false,
    categorySlug: "tablet",
  },
  {
    slug: "enceinte-bluetooth-boom",
    name: "Enceinte Bluetooth Boom",
    description:
      "Enceinte portable puissante et résistante aux éclaboussures. Son riche, basses profondes et autonomie généreuse.",
    price: 25000,
    stock: 15,
    rating: 4.5,
    reviewsCount: 63,
    brand: "Boom",
    colors: [C.noir, C.rouge].join(","),
    featured: false,
    categorySlug: "speaker",
  },
  {
    slug: "appareil-photo-dslr",
    name: "Appareil photo DSLR",
    description:
      "Appareil photo reflex pour des clichés nets et professionnels. Objectif interchangeable et enregistrement vidéo Full HD.",
    price: 180000,
    stock: 5,
    rating: 5,
    reviewsCount: 27,
    brand: "PixPro",
    colors: [C.noir].join(","),
    featured: false,
    categorySlug: "camera",
  },
  {
    slug: "casque-gamer-rgb",
    name: "Casque Gamer RGB",
    description:
      "Casque gaming avec son surround, micro antibruit et éclairage RGB. Coussinets confortables pour de longues sessions.",
    price: 22000,
    stock: 18,
    rating: 4.5,
    reviewsCount: 72,
    brand: "GamePro",
    colors: [C.noir, C.orange].join(","),
    featured: false,
    categorySlug: "headphones",
  },
  {
    slug: "montre-connectee-smart",
    name: "Montre connectée Smart",
    description:
      "Montre connectée avec suivi d'activité, fréquence cardiaque et notifications. Étanche et compatible Android/iOS.",
    price: 35000,
    stock: 14,
    rating: 4,
    reviewsCount: 58,
    brand: "SmartWatch",
    colors: [C.noir, C.bleu].join(","),
    sizes: "S,M,L",
    featured: false,
    categorySlug: "smartwatch",
  },
  {
    slug: "clavier-mecanique",
    name: "Clavier mécanique",
    description:
      "Clavier mécanique rétroéclairé au toucher réactif. Idéal pour la frappe et le jeu, construction robuste.",
    price: 18000,
    stock: 22,
    rating: 4.5,
    reviewsCount: 44,
    brand: "KeyTech",
    colors: [C.noir].join(","),
    featured: false,
    categorySlug: "accessory",
  },
  {
    slug: "ecran-24-pouces-hd",
    name: "Écran 24 pouces HD",
    description:
      "Moniteur 24 pouces Full HD aux couleurs fidèles. Bords fins, confortable pour le bureau comme pour le multimédia.",
    price: 75000,
    stock: 10,
    rating: 4.5,
    reviewsCount: 39,
    brand: "ViewMax",
    colors: [C.noir].join(","),
    featured: false,
    categorySlug: "accessory",
  },
];

async function main() {
  console.log("→ Insertion des catégories...");
  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: c, create: c });
  }

  // On récupère la correspondance slug -> id pour lier les produits.
  const catMap = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id]),
  );

  console.log("→ Insertion des produits + génération des vignettes...");
  for (const p of products) {
    const { categorySlug, ...rest } = p;
    ensurePlaceholder(p.slug, p.name, categorySlug); // crée /public/products/<slug>.svg si absent
    const data = {
      ...rest,
      image: `/products/${p.slug}.svg`, // image locale (placeholder généré)
      categoryId: catMap[categorySlug],
    };
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    });
  }

  console.log(`✔ Seed terminé : ${categories.length} catégories, ${products.length} produits.`);
}

main()
  .catch((e) => {
    console.error("Erreur de seed :", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
