"use server";

import { revalidatePath } from "next/cache";
import { SHIPPING_API_URL, type ShipmentStatus } from "@/lib/shipping";


export async function updateShipmentStatus(
  shipmentId: string,
  status: ShipmentStatus
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(
      `${SHIPPING_API_URL}/api/shipments/${shipmentId}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      return { ok: false, error: `Error ${res.status}: ${detail}` };
    }

    revalidatePath("/shipping");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Error de red",
    };
  }
}

export async function assignCourier(
  shipmentId: string,
  courierId: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(
      `${SHIPPING_API_URL}/api/shipments/${shipmentId}/courier`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courierId }),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      return { ok: false, error: `Error ${res.status}: ${detail}` };
    }

    revalidatePath("/shipping");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Error de red",
    };
  }
}