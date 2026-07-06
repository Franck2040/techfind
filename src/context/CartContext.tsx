"use client";
/**
 * CartContext.tsx — Panier d'achat (état global côté client).
 * -----------------------------------------------------------------------------
 * Fournit le panier à toute l'application via React Context, avec persistance
 * dans le localStorage (le panier survit au rafraîchissement de la page).
 *
 * Utilisation dans un composant client :
 *     const { items, addItem, totalItems } = useCart();
 *
 * ⚠️ Le prix affiché ici vient du client : au moment du paiement, le serveur
 * RECALCULE le total à partir de la base (voir actions/order.ts). Ne jamais
 * faire confiance au total du panier pour encaisser.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "techfind_cart";

/** Identifiant unique d'une ligne : un même produit en couleur/taille
 *  différente compte comme deux lignes distinctes. */
export function cartLineKey(item: Pick<CartItem, "productId" | "color" | "size">): string {
  return `${item.productId}|${item.color ?? ""}|${item.size ?? ""}`;
}

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isReady: boolean; // true une fois le panier chargé depuis le localStorage
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Chargement initial depuis le localStorage (une seule fois, au montage).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // localStorage corrompu/indisponible : on repart d'un panier vide.
    }
    setIsReady(true);
  }, []);

  // Sauvegarde à chaque changement (après le chargement initial).
  useEffect(() => {
    if (!isReady) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Quota dépassé ou mode privé : on ignore silencieusement.
    }
  }, [items, isReady]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const key = cartLineKey(item);
      const existing = prev.find((i) => cartLineKey(i) === key);
      if (existing) {
        // Ligne déjà présente : on cumule les quantités (plafonné au stock).
        return prev.map((i) =>
          cartLineKey(i) === key
            ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
            : i,
        );
      }
      return [...prev, { ...item, quantity: Math.min(item.quantity, item.stock) }];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => cartLineKey(i) !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (cartLineKey(i) !== key) return [i];
        const q = Math.max(1, Math.min(quantity, i.stock)); // borné [1, stock]
        return [{ ...i, quantity: q }];
      }),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  // Valeurs dérivées (recalculées seulement si `items` change).
  const totalItems = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, totalItems, totalPrice, isReady, addItem, removeItem, updateQuantity, clearCart }),
    [items, totalItems, totalPrice, isReady, addItem, removeItem, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Hook d'accès au panier. Doit être utilisé sous <CartProvider>. */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart doit être utilisé à l'intérieur de <CartProvider>.");
  }
  return ctx;
}
