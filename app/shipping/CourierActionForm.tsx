"use client";

import { useState, useTransition } from "react";
import { assignCourier } from "./actions";
import {
  NON_REASSIGNABLE_STATUSES,
  type Courier,
  type ShipmentStatus,
} from "@/lib/shipping";

export default function CourierActionForm({
  shipmentId,
  currentStatus,
  currentCourierId,
  couriers,
}: {
  shipmentId: string;
  currentStatus: ShipmentStatus;
  currentCourierId: string | null;
  couriers: Courier[];
}) {
  const [courierId, setCourierId] = useState<string>(currentCourierId ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const bloqueado = NON_REASSIGNABLE_STATUSES.includes(currentStatus);

  function onAssign() {
    setError(null);
    startTransition(async () => {
      const result = await assignCourier(shipmentId, courierId);
      if (!result.ok) setError(result.error ?? "Error desconocido");
    });
  }

  if (bloqueado) {
    return (
      <span className="text-xs text-slate-400 italic">
        No reasignable
      </span>
    );
  }

  const sinCambios = courierId === (currentCourierId ?? "") || courierId === "";

  return (
    <div className="flex items-center justify-end gap-2">
      {error && <span className="text-xs text-red-600">{error}</span>}
      <select
        value={courierId}
        onChange={(e) => setCourierId(e.target.value)}
        disabled={isPending}
        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
      >
        <option value="">Sin asignar</option>
        {couriers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <button
        onClick={onAssign}
        disabled={isPending || sinCambios}
        className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending ? "Asignando..." : "Asignar"}
      </button>
    </div>
  );
}