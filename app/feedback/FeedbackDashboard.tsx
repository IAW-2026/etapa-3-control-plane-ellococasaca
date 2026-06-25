"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  fetchFeedbackAnalytics,
  REVIEW_STATUS_LABELS,
  REVIEW_STATUS_DOT,
  REPORT_STATUS_LABELS,
  type FeedbackAnalytics,
} from "@/lib/feedback";
import ReviewActionForm from "./ReviewActionForm";

function formatRating(rating: number | undefined) {
  if (rating == null) return "—";
  return rating.toFixed(2);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-700">
      <span className="text-amber-400">★</span>
      {rating.toFixed(1)}
    </span>
  );
}

export default function FeedbackDashboard() {
  const { getToken } = useAuth();
  const [analytics, setAnalytics] = useState<FeedbackAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        if (!token) {
          setError("Sin sesión activa.");
          return;
        }
        const data = await fetchFeedbackAnalytics(token);
        setAnalytics(data);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "No se pudo conectar con la Feedback App."
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  return (
    <div className="max-w-6xl mx-auto px-8 py-6 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Feedback</h1>
        <p className="text-sm text-slate-500 mt-1">Reseñas y moderación</p>
      </header>

      {loading && (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-sm text-slate-400">
          Cargando datos...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-sm text-red-700">
          {error}
        </div>
      )}

      {analytics && <DashboardContent analytics={analytics} />}
    </div>
  );
}

function DashboardContent({ analytics }: { analytics: FeedbackAnalytics }) {
  const { reviews, reports, eligibilities, topSellers, topProducts } = analytics;

  return (
    <div className="space-y-8">
      {/* Métricas principales */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="bg-white border border-slate-200 rounded-lg px-5 py-4">
          <p className="text-xs text-slate-500 mb-1">Total reseñas</p>
          <p className="text-2xl font-semibold text-slate-900">{reviews.total}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {reviews.last7Days} última semana
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-5 py-4">
          <p className="text-xs text-slate-500 mb-1">Rating promedio</p>
          <p className="text-2xl font-semibold text-slate-900">
            {formatRating(reviews.avgProductRating)}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">sobre productos</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-5 py-4">
          <p className="text-xs text-slate-500 mb-1">Reportes abiertos</p>
          <p className="text-2xl font-semibold text-slate-900">
            {reports.byStatus?.OPEN ?? 0}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{reports.total} total</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-5 py-4">
          <p className="text-xs text-slate-500 mb-1">Elegibilidades pendientes</p>
          <p className="text-2xl font-semibold text-slate-900">
            {eligibilities.pending}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {eligibilities.consumed} usadas
          </p>
        </div>
      </div>

      {/* Estado de reseñas + reportes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Reseñas por estado */}
        <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-700">
              Reseñas por estado
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {reviews.moderated} moderadas por IA · {reviews.last30Days} últimos 30 días
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {(["PUBLISHED", "HIDDEN", "PENDING", "DELETED"] as const).map(
              (status) => (
                <div
                  key={status}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-700">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${REVIEW_STATUS_DOT[status]}`}
                    />
                    {REVIEW_STATUS_LABELS[status]}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {reviews.byStatus?.[status] ?? 0}
                  </span>
                </div>
              )
            )}
          </div>
        </section>

        {/* Reportes + distribución de ratings */}
        <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-700">
              Reportes por estado
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {reports.last7Days} última semana · {reports.last30Days} últimos 30 días
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {(["OPEN", "RESOLVED", "DISMISSED"] as const).map((status) => (
              <div
                key={status}
                className="flex items-center justify-between px-5 py-3"
              >
                <span className="text-xs text-slate-700">
                  {REPORT_STATUS_LABELS[status]}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {reports.byStatus?.[status] ?? 0}
                </span>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50">
            <p className="text-xs font-medium text-slate-500 mb-2">
              Distribución de ratings
            </p>
            <div className="flex flex-col gap-1">
              {["5", "4", "3", "2", "1"].map((star) => {
                const count = reviews.ratingDistribution?.[star] ?? 0;
                const pct =
                  reviews.total > 0
                    ? Math.round((count / reviews.total) * 100)
                    : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 w-4 text-right">
                      {star}★
                    </span>
                    <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                      <div
                        className="bg-amber-400 h-1.5 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 w-6">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Top Sellers */}
      {topSellers.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700">
              Top sellers por rating
            </h2>
            <span className="text-xs text-slate-400 border border-slate-200 rounded-md px-2.5 py-1">
              {topSellers.length} vendedores
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 px-5 py-3 bg-slate-50 text-xs font-medium text-slate-500">
              <span>Seller ID</span>
              <span>Rating</span>
              <span>Reseñas</span>
            </div>
            {topSellers.map((seller, i) => (
              <div
                key={seller.targetId}
                className="grid grid-cols-[2fr_1fr_1fr] gap-4 px-5 py-3 border-t border-slate-100 items-center"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 w-4">{i + 1}</span>
                  <p className="font-mono text-xs text-slate-700 truncate">
                    {seller.targetId}
                  </p>
                </div>
                <StarRating rating={seller.avgRating} />
                <p className="text-xs text-slate-500">
                  {seller.totalRatings ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top Productos */}
      {topProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700">
              Top productos por rating
            </h2>
            <span className="text-xs text-slate-400 border border-slate-200 rounded-md px-2.5 py-1">
              {topProducts.length} productos
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 px-5 py-3 bg-slate-50 text-xs font-medium text-slate-500">
              <span>Producto ID</span>
              <span>Rating</span>
              <span>Reseñas</span>
            </div>
            {topProducts.map((product, i) => (
              <div
                key={product.targetId}
                className="grid grid-cols-[2fr_1fr_1fr] gap-4 px-5 py-3 border-t border-slate-100 items-center"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 w-4">{i + 1}</span>
                  <p className="font-mono text-xs text-slate-700 truncate">
                    {product.targetId}
                  </p>
                </div>
                <StarRating rating={product.avgRating} />
                <p className="text-xs text-slate-500">
                  {product.totalRatings ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Moderar / Eliminar reseña */}
      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-700">
            Moderar o eliminar reseña
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingresá el ID de una reseña para cambiar su estado o eliminarla.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-5 py-4">
          <ReviewActionForm />
        </div>
      </section>
    </div>
  );
}
