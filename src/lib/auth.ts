/**
 * auth.ts — Authentification maison (sessions + mots de passe).
 * -----------------------------------------------------------------------------
 * Approche volontairement SIMPLE, TRANSPARENTE et SÛRE (facile à maintenir) :
 *  - Mot de passe HASHÉ avec bcrypt (jamais stocké en clair).
 *  - Session = jeton aléatoire opaque stocké en base ; le navigateur ne reçoit
 *    qu'un cookie httpOnly (inaccessible au JavaScript => anti-XSS).
 *
 * IMPORTANT : `cookies()` ne peut ÉCRIRE un cookie que dans une Server Action
 * ou une Route Handler. Donc createSession/destroySession s'appellent depuis
 * les actions (voir lib/actions/auth.ts). getCurrentUser() se lit partout.
 */
import "server-only";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "techfind_session";
const SESSION_TTL_DAYS = 30; // Durée de vie d'une session

/** Version "sûre" de l'utilisateur : SANS le hash du mot de passe. */
export type SafeUser = {
  id: string;
  name: string;
  email: string;
  address: string | null;
  createdAt: Date;
};

/** Hache un mot de passe (coût 12 = bon compromis sécurité/perf). */
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/** Compare un mot de passe en clair avec son hash. */
export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Crée une session pour un utilisateur et pose le cookie httpOnly. */
export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("hex"); // 256 bits, non devinable
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 86_400_000);

  await prisma.session.create({ data: { token, userId, expiresAt } });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true, // inaccessible au JS côté client
    secure: process.env.NODE_ENV === "production", // HTTPS only en prod
    sameSite: "lax", // protège contre le CSRF sur les navigations cross-site
    path: "/",
    expires: expiresAt,
  });
}

/**
 * Retourne l'utilisateur connecté (sans données sensibles) ou null.
 * Utilisable dans les Server Components pour protéger/adapter l'affichage.
 */
export async function getCurrentUser(): Promise<SafeUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    select: {
      expiresAt: true,
      user: {
        select: { id: true, name: true, email: true, address: true, createdAt: true },
      },
    },
  });

  if (!session) return null;

  // Session expirée : on nettoie et on considère l'utilisateur déconnecté.
  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.deleteMany({ where: { token } });
    return null;
  }

  return session.user;
}

/** Détruit la session courante (déconnexion) : supprime en base + le cookie. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
    store.delete(SESSION_COOKIE);
  }
}
