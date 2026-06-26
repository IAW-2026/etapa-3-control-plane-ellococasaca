export type PaymentStatus = string;

export type Charge = {
  charge_id: string;
  status: PaymentStatus;
  amount?: number;
  buyer_id?: string;
  created_at?: string;
};

export type Payout = {
  charge_id: string;
  status: PaymentStatus;
  amount?: number;
  seller_id?: string;
  created_at?: string;
};

export type PaymentAction = "accept" | "reject" | "pending";

export const ACTION_LABELS: Record<PaymentAction, string> = {
  accept: "Aceptar",
  reject: "Rechazar",
  pending: "Pendiente",
};

export const ACTION_STYLES: Record<PaymentAction, string> = {
  accept: "border-green-200 text-green-700 hover:bg-green-50",
  reject: "border-red-200 text-red-600 hover:bg-red-50",
  pending: "border-amber-200 text-amber-700 hover:bg-amber-50",
};

export function statusBadge(status: string): string {
  const s = status.toLowerCase();
  if (s === "accepted" || s === "approved") return "border-green-200 bg-green-50 text-green-700";
  if (s === "rejected" || s === "declined") return "border-red-200 bg-red-50 text-red-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

export async function fetchChargesByBuyer(
  token: string,
  buyerId: string
): Promise<Charge[]> {
  const res = await fetch(`/api/payments/charge/user/${encodeURIComponent(buyerId)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Charges respondió ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data.charges ?? data.data ?? [];
}

export async function fetchPayoutsBySeller(
  token: string,
  sellerId: string
): Promise<Payout[]> {
  const res = await fetch(`/api/payments/payout/user/${encodeURIComponent(sellerId)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Payouts respondió ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data.payouts ?? data.data ?? [];
}

export async function applyChargeAction(
  token: string,
  chargeId: string,
  action: PaymentAction
): Promise<void> {
  const res = await fetch(`/api/payments/charge/actions/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ charge_id: chargeId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }
}

export async function applyPayoutAction(
  token: string,
  chargeId: string,
  action: PaymentAction
): Promise<void> {
  const res = await fetch(`/api/payments/payout/actions/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ charge_id: chargeId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }
}
