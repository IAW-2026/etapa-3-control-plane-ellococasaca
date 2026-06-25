"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useTransition } from "react";
import {
  feedbackApiUrl,
  MODERABLE_STATUSES,
  REVIEW_STATUS_LABELS,
} from "@/lib/feedback";

type ActionType = "PUBLISHED" | "HIDDEN" | "DELETE";

const ACTION_LABELS: Record<ActionType, string> = {
  PUBLISHED: "Publicar",
  HIDDEN: "Ocultar",
  DELETE: "Eliminar (soft)",
};

export default function ReviewActionForm({
  feedbackAppUrl,
}: {
  feedbackAppUrl: string;
}) {
  const { getToken } = useAuth();
  const [reviewId, setReviewId] = useState("");
  const [action, setAction] = useState<ActionType>("HIDDEN");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(
    null
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewId.trim()) return;
    setResult(null);

    startTransition(async () => {
      try {
        const token = await getToken();
        if (!token) {
          setResult({ ok: false, error: "Sin sesión activa" });
          return;
        }

        let res: Response;
        if (action === "DELETE") {
          res = await fetch(
            feedbackApiUrl(feedbackAppUrl, `/api/reviews/${reviewId.trim()}`),
            { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          res = await fetch(
            feedbackApiUrl(
              feedbackAppUrl,
              `/api/reviews/${reviewId.trim()}/moderate`
            ),
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ status: action }),
            }
          );
        }

        if (!res.ok) {
          const detail = await res.text();
          setResult({ ok: false, error: `Error ${res.status}: ${detail}` });
          return;
        }

        setResult({ ok: true });
        setReviewId("");
      } catch (err) {
        setResult({
          ok: false,
          error: err instanceof Error ? err.message : "Error de red",
        });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs text-slate-500 mb-1">
            ID de reseña
          </label>
          <input
            type="text"
            value={reviewId}
            onChange={(e) => setReviewId(e.target.value)}
            placeholder="cuid de la reseña..."
            disabled={isPending}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Acción</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as ActionType)}
            disabled={isPending}
            className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700"
          >
            {MODERABLE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {ACTION_LABELS[s]} ({REVIEW_STATUS_LABELS[s]})
              </option>
            ))}
            <option value="DELETE">{ACTION_LABELS.DELETE}</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isPending || !reviewId.trim()}
          className="rounded-md bg-slate-900 px-4 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending ? "Procesando..." : "Aplicar"}
        </button>
      </div>

      {result && (
        <p className={`text-xs ${result.ok ? "text-green-600" : "text-red-600"}`}>
          {result.ok ? "Acción aplicada correctamente." : result.error}
        </p>
      )}
    </form>
  );
}
