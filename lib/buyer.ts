export const BUYER_APP_URL =
  process.env.BUYER_APP_URL ?? "";

export type OrderStatus = "PENDING" | "PAID" | "REJECTED";

export type BuyerUser = {
  clerkId: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type ShadowOrder = {
  id: string;
  clerkId: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export type Analytics = {
  buyers: {
    total: number;
    recent: Array<{ clerkId: string; email: string; name: string; createdAt: string }>;
  };
  carts: {
    total: number;
    active: number;
    totalItemsInActive: number;
  };
  orders: {
    total: number;
    volume: number;
    byStatus: Record<OrderStatus, number>;
    recent: Array<{ id: string; clerkId: string; totalAmount: number; status: OrderStatus; createdAt: string }>;
  };
};

export const ORDER_STATUSES: OrderStatus[] = ["PENDING", "PAID", "REJECTED"];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  REJECTED: "Rechazado",
};

export const ORDER_STATUS_DOT: Record<OrderStatus, string> = {
  PENDING: "bg-amber-400",
  PAID: "bg-green-500",
  REJECTED: "bg-red-500",
};

export async function fetchAnalytics(): Promise<Analytics> {
  const res = await fetch(`${BUYER_APP_URL}/api/analytics`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Analytics respondió ${res.status}`);
  return res.json();
}

export async function fetchBuyerUsers(): Promise<BuyerUser[]> {
  const res = await fetch(`${BUYER_APP_URL}/api/admin/users`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Admin users respondió ${res.status}`);
  const json = await res.json();
  return json.data;
}

export async function fetchShadowOrders(): Promise<ShadowOrder[]> {
  const res = await fetch(`${BUYER_APP_URL}/api/admin/orders`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Admin orders respondió ${res.status}`);
  const json = await res.json();
  return json.data;
}
