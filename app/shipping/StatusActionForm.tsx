"use client";

import { useState, useTransition } from "react";
import { updateShipmentStatus } from "./actions";
import { STATUS_ORDER, STATUS_LABELS, type ShipmentStatus } from "@/lib/shipping";

export default function StatusActionForm({
  shipmentId,
  currentStatus,
}: {
  shipmentId: string;
  currentStatus: ShipmentStatus;
}) {
  const [status, setStatus] = useState<ShipmentStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onApply() {
    setError(null);
    startTransition(async () => {
      const result = await updateShipmentStatus(shipmentId, status);
      if (!result.ok) setError(result.error ?? "Error desconocido");
    });
  }

  const sinCambios = status === currentStatus;

  return (
    <div className="flex items-center justify-end gap-2">
      {error && <span className="text-xs text-red-600">{error}</span>}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
        disabled={isPending}
        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
      >
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <button
        onClick={onApply}
        disabled={isPending || sinCambios}
        className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending ? "Guardando..." : "Aplicar"}
      </button>
    </div>
  );
}