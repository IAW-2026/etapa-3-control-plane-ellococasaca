"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { SELLER_APP_URL } from "@/lib/seller";

export async function deleteProduct(
  productId: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const res = await fetch(`${SELLER_APP_URL}/api/admin/products/${productId}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      const detail = await res.text();
      return { ok: false, error: `Error ${res.status}: ${detail}` };
    }

    revalidatePath("/seller");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Error de red",
    };
  }
}

export async function deleteSeller(
  sellerId: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const res = await fetch(`${SELLER_APP_URL}/api/admin/sellers/${sellerId}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      const detail = await res.text();
      return { ok: false, error: `Error ${res.status}: ${detail}` };
    }

    revalidatePath("/seller");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Error de red",
    };
  }
}
