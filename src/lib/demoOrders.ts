/**
 * demoOrders.ts — Stockage des commandes en MODE DÉMO (localStorage navigateur).
 * -----------------------------------------------------------------------------
 * À utiliser uniquement côté client. La commande est calculée et validée côté
 * serveur (voir lib/actions/order.ts), puis mémorisée ici pour l'afficher sur
 * la page de confirmation et dans l'espace compte.
 */

export type DemoOrderItem = {
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
};

export type DemoOrder = {
  id: string;
  createdAt: string; // ISO
  firstName: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  phone: string;
  email: string;
  total: number;
  paymentMethod: string;
  items: DemoOrderItem[];
};

const ORDERS_KEY = "techfind_orders";
const LAST_KEY = "techfind_last_order";

function read(): DemoOrder[] {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) ?? "[]") as DemoOrder[];
  } catch {
    return [];
  }
}

/** Enregistre une commande et la marque comme "dernière". */
export function saveOrder(order: DemoOrder): void {
  const all = read();
  all.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
  localStorage.setItem(LAST_KEY, order.id);
}

/** Toutes les commandes du navigateur, plus récentes d'abord. */
export function getOrders(): DemoOrder[] {
  return read().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Une commande par son identifiant. */
export function getOrder(id: string): DemoOrder | null {
  return read().find((o) => o.id === id) ?? null;
}

/** La dernière commande passée (page de confirmation). */
export function getLastOrder(): DemoOrder | null {
  try {
    const id = localStorage.getItem(LAST_KEY);
    return id ? getOrder(id) : null;
  } catch {
    return null;
  }
}
