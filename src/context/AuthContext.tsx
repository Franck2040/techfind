"use client";
/**
 * AuthContext.tsx — Authentification en MODE DÉMO (côté navigateur).
 * -----------------------------------------------------------------------------
 * VERSION DÉMO (Vercel sans base de données) : les comptes sont stockés dans le
 * localStorage du navigateur. Les mots de passe ne sont PAS gardés en clair — on
 * enregistre uniquement leur empreinte SHA-256. Chaque visiteur peut ainsi créer
 * un compte et tester le parcours connecté, sans serveur.
 *
 * ⚠️ Ce mécanisme est volontairement simple (démo front-end). La version
 * full-stack (branche `full-stack`) utilise une vraie base + bcrypt côté serveur.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const USERS_KEY = "techfind_users";
const CURRENT_KEY = "techfind_current_email";

/** Utilisateur exposé à l'application (sans le mot de passe). */
export type DemoUser = { name: string; email: string; address?: string };
/** Utilisateur stocké (empreinte du mot de passe incluse). */
type StoredUser = DemoUser & { passwordHash: string };

type Result = { ok: boolean; error?: string };

type AuthContextValue = {
  user: DemoUser | null;
  isReady: boolean;
  register: (data: {
    name: string;
    email: string;
    password: string;
    address?: string;
  }) => Promise<Result>;
  login: (data: { email: string; password: string }) => Promise<Result>;
  logout: () => void;
  updateProfile: (data: {
    name: string;
    address?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<Result>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Empreinte SHA-256 du mot de passe (+ sel) — évite le stockage en clair. */
async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${password}::techfind-demo`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]") as StoredUser[];
  } catch {
    return [];
  }
}
function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Restaure la session au chargement.
  useEffect(() => {
    try {
      const email = localStorage.getItem(CURRENT_KEY);
      if (email) {
        const found = readUsers().find((u) => u.email === email);
        if (found) setUser({ name: found.name, email: found.email, address: found.address });
      }
    } catch {
      /* localStorage indisponible */
    }
    setIsReady(true);
  }, []);

  const register = useCallback(
    async (data: { name: string; email: string; password: string; address?: string }) => {
      const email = data.email.toLowerCase().trim();
      const users = readUsers();
      if (users.some((u) => u.email === email)) {
        return { ok: false, error: "Un compte existe déjà avec cet email." };
      }
      const stored: StoredUser = {
        name: data.name.trim(),
        email,
        address: data.address?.trim() || undefined,
        passwordHash: await hashPassword(data.password),
      };
      writeUsers([...users, stored]);
      localStorage.setItem(CURRENT_KEY, email);
      setUser({ name: stored.name, email: stored.email, address: stored.address });
      return { ok: true };
    },
    [],
  );

  const login = useCallback(async (data: { email: string; password: string }) => {
    const email = data.email.toLowerCase().trim();
    const found = readUsers().find((u) => u.email === email);
    const hash = await hashPassword(data.password);
    // Message générique : on ne révèle pas si l'email existe (bonne pratique).
    if (!found || found.passwordHash !== hash) {
      return { ok: false, error: "Email ou mot de passe incorrect." };
    }
    localStorage.setItem(CURRENT_KEY, email);
    setUser({ name: found.name, email: found.email, address: found.address });
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CURRENT_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (data: {
      name: string;
      address?: string;
      currentPassword?: string;
      newPassword?: string;
    }) => {
      if (!user) return { ok: false, error: "Non connecté." };
      const users = readUsers();
      const idx = users.findIndex((u) => u.email === user.email);
      if (idx === -1) return { ok: false, error: "Compte introuvable." };

      const current = users[idx];
      let passwordHash = current.passwordHash;

      // Changement de mot de passe : vérifier l'ancien.
      if (data.newPassword) {
        const oldHash = await hashPassword(data.currentPassword ?? "");
        if (oldHash !== current.passwordHash) {
          return { ok: false, error: "Mot de passe actuel incorrect." };
        }
        passwordHash = await hashPassword(data.newPassword);
      }

      const updated: StoredUser = {
        ...current,
        name: data.name.trim(),
        address: data.address?.trim() || undefined,
        passwordHash,
      };
      users[idx] = updated;
      writeUsers(users);
      setUser({ name: updated.name, email: updated.email, address: updated.address });
      return { ok: true };
    },
    [user],
  );

  const value = useMemo(
    () => ({ user, isReady, register, login, logout, updateProfile }),
    [user, isReady, register, login, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook d'accès à l'authentification. À utiliser sous <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé sous <AuthProvider>.");
  return ctx;
}
