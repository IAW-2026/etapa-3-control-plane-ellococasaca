import {
  fetchAnalytics,
  fetchBuyerUsers,
  fetchShadowOrders,
  ORDER_STATUS_DOT,
  ORDER_STATUS_LABELS,
} from "@/lib/buyer";
import OrderStatusForm from "./OrderStatusForm";

export const dynamic = "force-dynamic";

function formatARS(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function BuyerPage() {
  let analytics;
  let users;
  let orders;

  try {
    [analytics, users, orders] = await Promise.all([
      fetchAnalytics(),
      fetchBuyerUsers(),
      fetchShadowOrders(),
    ]);
  } catch {
    return (
      <div className="max-w-6xl mx-auto px-8 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Buyer</h1>
          <p className="text-sm text-slate-500 mt-1">Gestión de compradores y órdenes</p>
        </header>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-sm text-red-700">
          No se pudo conectar con la Buyer App.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-6 space-y-8">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Buyer</h1>
          <p className="text-sm text-slate-500 mt-1">Gestión de compradores y órdenes</p>
        </div>
      </header>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="bg-white border border-slate-200 rounded-lg px-5 py-4">
          <p className="text-xs text-slate-500 mb-1">Compradores</p>
          <p className="text-2xl font-semibold text-slate-900">{analytics.buyers.total}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-5 py-4">
          <p className="text-xs text-slate-500 mb-1">Carritos activos</p>
          <p className="text-2xl font-semibold text-slate-900">{analytics.carts.active}</p>
          <p className="text-xs text-slate-400 mt-0.5">{analytics.carts.totalItemsInActive} ítems · {analytics.carts.total} total</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-5 py-4">
          <p className="text-xs text-slate-500 mb-1">Órdenes</p>
          <p className="text-2xl font-semibold text-slate-900">{analytics.orders.total}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {analytics.orders.byStatus.PAID ?? 0} pagadas · {analytics.orders.byStatus.PENDING ?? 0} pendientes · {analytics.orders.byStatus.REJECTED ?? 0} rechazadas
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-5 py-4">
          <p className="text-xs text-slate-500 mb-1">Volumen total</p>
          <p className="text-2xl font-semibold text-slate-900">{formatARS(analytics.orders.volume)}</p>
        </div>
      </div>

      {/* Órdenes */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-700">Órdenes shadow</h2>
          <span className="text-xs text-slate-400 border border-slate-200 rounded-md px-2.5 py-1">
            {orders.length} órdenes
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.7fr_1.4fr] gap-4 px-5 py-3 bg-slate-50 text-xs font-medium text-slate-500">
            <span>ID</span>
            <span>Comprador</span>
            <span>Monto</span>
            <span>Estado</span>
            <span className="text-right">Acción</span>
          </div>
          {orders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-[1.4fr_1fr_0.8fr_0.7fr_1.4fr] gap-4 px-5 py-3 border-t border-slate-100 items-center"
            >
              <div>
                <p className="font-mono text-xs text-slate-700 truncate">{order.id}</p>
                <p className="text-xs text-slate-400">{formatDate(order.createdAt)}</p>
              </div>
              <p className="font-mono text-xs text-slate-500 truncate">{order.clerkId}</p>
              <p className="text-xs text-slate-700 font-medium">{formatARS(order.totalAmount)}</p>
              <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 w-fit">
                <span className={`w-1.5 h-1.5 rounded-full ${ORDER_STATUS_DOT[order.status]}`} />
                {ORDER_STATUS_LABELS[order.status]}
              </span>
              <OrderStatusForm orderId={order.id} currentStatus={order.status} />
            </div>
          ))}
        </div>
      </section>

      {/* Usuarios */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-700">Compradores registrados</h2>
          <span className="text-xs text-slate-400 border border-slate-200 rounded-md px-2.5 py-1">
            {users.length} usuarios
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[1fr_1.4fr_1.2fr_0.7fr] gap-4 px-5 py-3 bg-slate-50 text-xs font-medium text-slate-500">
            <span>Nombre</span>
            <span>Email</span>
            <span>Clerk ID</span>
            <span>Alta</span>
          </div>
          {users.map((user) => (
            <div
              key={user.clerkId}
              className="grid grid-cols-[1fr_1.4fr_1.2fr_0.7fr] gap-4 px-5 py-3 border-t border-slate-100 items-center"
            >
              <p className="text-xs text-slate-700 font-medium">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
              <p className="font-mono text-xs text-slate-400 truncate">{user.clerkId}</p>
              <p className="text-xs text-slate-400">{formatDate(user.createdAt)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
