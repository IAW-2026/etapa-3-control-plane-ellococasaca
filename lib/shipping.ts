export const SHIPPING_API_URL =
  process.env.SHIPPING_API_URL ??
  "https://proyecto-c-shipping2-ellococasaca.vercel.app";

export type ShipmentStatus =
  | "PENDING"
  | "PREPARING"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELED";

export type Shipment = {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  status: ShipmentStatus;
  trackingCode: string;
  estimatedDelivery: string | null;
  updatedAt: string;
};

type ShipmentsResponse = {
  data: Shipment[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export const STATUS_ORDER: ShipmentStatus[] = [
  "PENDING",
  "PREPARING",
  "SHIPPED",
  "IN_TRANSIT",
  "DELIVERED",
  "CANCELED",
];

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  PENDING: "Pendiente",
  PREPARING: "Preparando",
  SHIPPED: "Despachado",
  IN_TRANSIT: "En tránsito",
  DELIVERED: "Entregado",
  CANCELED: "Cancelado",
};

// Puntito de color del badge (clases de Tailwind)
export const STATUS_DOT: Record<ShipmentStatus, string> = {
  PENDING: "bg-slate-400",
  PREPARING: "bg-amber-500",
  SHIPPED: "bg-sky-500",
  IN_TRANSIT: "bg-blue-500",
  DELIVERED: "bg-green-500",
  CANCELED: "bg-red-500",
};

async function fetchPage(page: number): Promise<ShipmentsResponse> {
  const res = await fetch(`${SHIPPING_API_URL}/api/shipments?page=${page}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`La API de Shipping respondió ${res.status}`);
  }
  return res.json();
}

export async function fetchAllShipments(): Promise<Shipment[]> {
  const first = await fetchPage(1);
  const all = [...first.data];

  for (let page = 2; page <= first.totalPages; page++) {
    const next = await fetchPage(page);
    all.push(...next.data);
  }

  // Dedup defensivo por id
  const unique = new Map(all.map((s) => [s.id, s]));
  return Array.from(unique.values());
}