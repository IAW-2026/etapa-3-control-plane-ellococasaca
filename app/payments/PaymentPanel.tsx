"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useTransition } from "react";
import {
  ACTION_LABELS,
  ACTION_STYLES,
  statusBadge,
  type Charge,
  type Payout,
  type PaymentAction,
} from "@/lib/payments";

type Item = Charge | Payout;

interface PaymentPanelProps {
  type: "charge" | "payout";
  title: string;
  searchLabel: string;
  searchPlaceholder: string;
}

export default function PaymentPanel({
  type,
  title,
  searchLabel,
  searchPlaceholder,
}: PaymentPanelProps) {
  const { getToken } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [searchedId, setSearchedId] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const id = inputValue.trim();
    if (!id) return;

    setLoading(true);
    setLoadError(null);
    setActionError(null);
    setItems([]);
    setSearchedId(id);

    try {
      const token = await getToken();
      if (!token) { setLoadError("Sin sesión activa."); return; }

      const path =
        type === "charge"
          ? `/api/payments/charge/user/${encodeURIComponent(id)}`
          : `/api/payments/payout/user/${encodeURIComponent(id)}`;

      const res = await fetch(path, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text();
        setLoadError(`Error ${res.status}: ${text}`);
        return;
      }

      const data = await res.json();
      const list: Item[] = Array.isArray(data)
        ? data
        : (data.charges ?? data.payouts ?? data.data ?? []);
      setItems(list);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Error de red");
    } finally {
      setLoading(false);
    }
  }

  function handleAction(chargeId: string, action: PaymentAction) {
    setActionError(null);
    startTransition(async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const path =
          type === "charge"
            ? `/api/payments/charge/actions/${action}`
            : `/api/payments/payout/actions/${action}`;

        const res = await fetch(path, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ charge_id: chargeId }),
        });

        if (!res.ok) {
          const text = await res.text();
          setActionError(`Error ${res.status}: ${text}`);
          return;
        }

        // Refresh list after action
        if (searchedId) {
          const refreshPath =
            type === "charge"
              ? `/api/payments/charge/user/${encodeURIComponent(searchedId)}`
              : `/api/payments/payout/user/${encodeURIComponent(searchedId)}`;

          const refreshRes = await fetch(refreshPath, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          });
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            const list: Item[] = Array.isArray(data)
              ? data
              : (data.charges ?? data.payouts ?? data.data ?? []);
            setItems(list);
          }
        }
      } catch (e) {
        setActionError(e instanceof Error ? e.message : "Error de red");
      }
    });
  }

  const hasResults = !loading && !loadError && searchedId;

  return (
    <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Buscador */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1">{searchLabel}</label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={searchPlaceholder}
              disabled={loading || isPending}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:opacity-50"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={!inputValue.trim() || loading || isPending}
              className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </form>

        {/* Errores */}
        {loadError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-xs text-red-700">
            {loadError}
          </div>
        )}
        {actionError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-xs text-red-600">
            {actionError}
          </div>
        )}

        {/* Resultados */}
        {hasResults && (
          <div className="divide-y divide-slate-100 rounded-md border border-slate-100 overflow-hidden">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-slate-400">
                No se encontraron {type === "charge" ? "compras" : "ventas"} para este ID.
              </p>
            ) : (
              items.map((item) => (
                <ItemRow
                  key={item.charge_id}
                  item={item}
                  isPending={isPending}
                  onAction={handleAction}
                />
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function ItemRow({
  item,
  isPending,
  onAction,
}: {
  item: Item;
  isPending: boolean;
  onAction: (chargeId: string, action: PaymentAction) => void;
}) {
  const actions: PaymentAction[] = ["accept", "reject", "pending"];
  const currentStatus = item.status?.toLowerCase() ?? "";

  // Format amount if present
  const amountDisplay =
    item.amount != null
      ? new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          maximumFractionDigits: 0,
        }).format(item.amount)
      : null;

  // Format date if present
  const dateDisplay = item.created_at
    ? new Date(item.created_at).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <div className="px-4 py-3 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <p className="font-mono text-[11px] text-slate-400 truncate">
            {item.charge_id}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {amountDisplay && (
              <span className="text-xs font-semibold text-slate-700">{amountDisplay}</span>
            )}
            {dateDisplay && (
              <span className="text-[11px] text-slate-400">{dateDisplay}</span>
            )}
          </div>
        </div>
        <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full border font-medium ${statusBadge(item.status ?? "")}`}>
          {item.status}
        </span>
      </div>

      <div className="flex gap-1.5">
        {actions
          .filter((a) => {
            if (a === "accept") return currentStatus !== "accepted" && currentStatus !== "approved";
            if (a === "reject") return currentStatus !== "rejected" && currentStatus !== "declined";
            if (a === "pending") return currentStatus !== "pending";
            return true;
          })
          .map((action) => (
            <button
              key={action}
              onClick={() => onAction(item.charge_id, action)}
              disabled={isPending}
              className={`text-xs px-2.5 py-1 rounded-md border disabled:opacity-40 ${ACTION_STYLES[action]}`}
            >
              {ACTION_LABELS[action]}
            </button>
          ))}
      </div>
    </div>
  );
}
