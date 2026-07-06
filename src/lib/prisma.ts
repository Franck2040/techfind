/**
 * prisma.ts — Client de base de données (unique, partagé).
 * -----------------------------------------------------------------------------
 * Toujours importer `prisma` DEPUIS CE FICHIER pour parler à la base :
 *     import { prisma } from "@/lib/prisma";
 *
 * Le "singleton" évite d'ouvrir trop de connexions pendant le rechargement à
 * chaud en développement (piège classique de Next.js).
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// En dev, on réutilise la même instance entre les rechargements.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
