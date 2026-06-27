"use client";

import { useState } from "react";
import { deleteProduct, deleteSeller } from "./actions";

type Props = {
  id: string;
  type: "product" | "seller";
};

export default function DeleteButton({ id, type }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const label = type === "product" ? "producto" : "vendedor";
    if (!confirm(`¿Eliminar este ${label}? Esta acción no se puede deshacer.`)) return;

    setPending(true);
    setError(null);

    const result = type === "product" ? await deleteProduct(id) : await deleteSeller(id);

    if (!result.ok) {
      setError(result.error ?? "Error desconocido");
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleDelete}
        disabled={pending}
        className="text-xs text-red-600 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {pending ? "Eliminando…" : "Eliminar"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
