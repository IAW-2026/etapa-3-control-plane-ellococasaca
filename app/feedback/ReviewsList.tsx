"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
  fetchAdminReviews,
  REVIEW_STATUS_LABELS,
  REVIEW_STATUS_DOT,
  REVIEW_STATUS_BADGE,
  type AdminReview,
} from "@/lib/feedback";

const LIMIT = 5;

export default function ReviewsList() {
  const { getToken } = useAuth();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(
    async (newSkip: number, q: string) => {
      setLoading(true);
      setLoadError(null);
      try {
        const token = await getToken();
        if (!token) {
          setLoadError("Sin sesión activa.");
          return;
        }
        const data = await fetchAdminReviews(token, newSkip, LIMIT, q);
        setReviews(data.reviews);
        setTotal(data.total);
        setSkip(newSkip);
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : "Error al cargar reseñas");
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  useEffect(() => {
    load(0, "");
  }, [load]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = inputValue.trim();
    setQuery(q);
    load(0, q);
  }

  function handleClear() {
    setInputValue("");
    setQuery("");
    load(0, "");
  }

  function handleAction(reviewId: string, action: "PUBLISHED" | "HIDDEN" | "DELETE") {
    setActionError(null);
    startTransition(async () => {
      try {
        const token = await getToken();
        if (!token) return;

        let res: Response;
        if (action === "DELETE") {
          res = await fetch(`/api/feedback/reviews/${reviewId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          res = await fetch(`/api/feedback/reviews/${reviewId}/moderate`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: action }),
          });
        }

        if (!res.ok) {
          const text = await res.text();
          setActionError(`Error ${res.status}: ${text}`);
          return;
        }
        await load(skip, query);
      } catch (e) {
        setActionError(e instanceof Error ? e.message : "Error de red");
      }
    });
  }

  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(skip / LIMIT) + 1;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">Reseñas</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Moderá o eliminá directamente desde la lista
          </p>
        </div>
        {!loading && total > 0 && (
          <span className="text-xs text-slate-400 border border-slate-200 rounded-md px-2.5 py-1">
            {total} {query ? `resultado${total !== 1 ? "s" : ""}` : "reseñas"}
          </span>
        )}
      </div>

      {/* Buscador */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-3">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Seller ID o Producto ID..."
          className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400"
        />
        <button
          type="submit"
          disabled={loading || isPending}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
        >
          Buscar
        </button>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50"
          >
            Limpiar
          </button>
        )}
      </form>

      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-600 mb-3">
          {actionError}
        </div>
      )}

      {loading && (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-sm text-slate-400">
          Cargando reseñas...
        </div>
      )}

      {loadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {!loading && !loadError && (
        <>
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
            {reviews.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-400">
                {query
                  ? `No se encontraron reseñas para "${query}".`
                  : "No hay reseñas activas."}
              </p>
            ) : (
              reviews.map((review) => (
                <ReviewRow
                  key={review.id}
                  review={review}
                  isPending={isPending}
                  onAction={handleAction}
                />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-slate-400">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => load(skip - LIMIT, query)}
                  disabled={skip === 0 || loading || isPending}
                  className="text-xs px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => load(skip + LIMIT, query)}
                  disabled={skip + LIMIT >= total || loading || isPending}
                  className="text-xs px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function ReviewRow({
  review,
  isPending,
  onAction,
}: {
  review: AdminReview;
  isPending: boolean;
  onAction: (id: string, action: "PUBLISHED" | "HIDDEN" | "DELETE") => void;
}) {
  return (
    <div className="px-5 py-4 space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <p className="font-mono text-[11px] text-slate-400 truncate">{review.id}</p>
          <p className="text-xs text-slate-700">
            Producto{" "}
            <span className="font-mono text-slate-600">{review.productId}</span>
            {" · "}
            <span className="font-semibold">{review.ratingProduct}/5 ★</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Buyer {review.buyerId}
            {" · "}
            {new Date(review.createdAt).toLocaleDateString("es-AR")}
            {review.isModerated && (
              <span className="ml-1.5 text-violet-500">• Moderada por IA</span>
            )}
          </p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${REVIEW_STATUS_BADGE[review.status]}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${REVIEW_STATUS_DOT[review.status]}`} />
          {REVIEW_STATUS_LABELS[review.status]}
        </span>
      </div>

      {review.comment && (
        <p className="text-xs text-slate-500 line-clamp-2">{review.comment}</p>
      )}

      <div className="flex items-center gap-2 pt-0.5">
        {review.status !== "PUBLISHED" && (
          <button
            onClick={() => onAction(review.id, "PUBLISHED")}
            disabled={isPending}
            className="text-xs px-2.5 py-1 rounded-md border border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-40"
          >
            Publicar
          </button>
        )}
        {review.status !== "HIDDEN" && (
          <button
            onClick={() => onAction(review.id, "HIDDEN")}
            disabled={isPending}
            className="text-xs px-2.5 py-1 rounded-md border border-amber-200 text-amber-700 hover:bg-amber-50 disabled:opacity-40"
          >
            Ocultar
          </button>
        )}
        <button
          onClick={() => onAction(review.id, "DELETE")}
          disabled={isPending}
          className="text-xs px-2.5 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 ml-auto"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
