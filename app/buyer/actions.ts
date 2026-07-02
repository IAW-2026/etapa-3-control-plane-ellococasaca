"use server";

import { revalidatePath } from "next/cache";
import { BUYER_APP_URL, authHeaders, type OrderStatus } from "@/lib/buyer";

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BUYER_APP_URL}/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return { ok: false, error: `Error ${res.status}: ${detail}` };
    }

    revalidatePath("/buyer");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Error de red",
    };
  }
}
