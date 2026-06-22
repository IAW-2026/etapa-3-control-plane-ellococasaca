const SHIPPING_API_URL =
  process.env.SHIPPING_API_URL ??
  "https://proyecto-c-shipping2-ellococasaca.vercel.app";

const SHIPPING_PANEL_URL = `${SHIPPING_API_URL}/panel`;

type Shipment = {
  id: string;
  trackingCode: string;
  orderId: string;
  buyerId: string;
  status: string;
  createdAt: string;
  estimatedDelivery: string | null;
};

type ShipmentsResponse = {
  data: Shipment[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PREPARING: "Preparando",
  SHIPPED: "Despachado",
  IN_TRANSIT: "En transito",
  DELIVERED: "Entregado",
  CANCELED: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-gray-400",
  PREPARING: "bg-amber-500",
  SHIPPED: "bg-blue-500",
  IN_TRANSIT: "bg-indigo-500",
  DELIVERED: "bg-green-500",
  CANCELED: "bg-red-500",
};

async function fetchShipments(): Promise<ShipmentsResponse | null> {
  try {
    const res = await fetch(`${SHIPPING_API_URL}/api/shipments?limit=500`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Error consultando Shipping:", err);
    return null;
  }
}

export default async function ShippingPage() {
  const response = await fetchShipments();

  if (!response) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Shipping</h1>
          <p className="text-sm text-slate-500 mt-1">
            Estado actual de la app de envios
          </p>
        </header>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-sm text-red-700">
          No se pudo conectar con la Shipping App.
        </div>
      </div>
    );
  }

  const shipments = response.data;
  const total = shipments.length;

  const byStatus: Record<string, number> = {};
  for (const s of shipments) {
    byStatus[s.status] = (byStatus[s.status] || 0) + 1;
  }

  const inTransit = byStatus.IN_TRANSIT || 0;
  const delivered = byStatus.DELIVERED || 0;
  const canceled = byStatus.CANCELED || 0;

  const distribution = Object.keys(STATUS_LABELS).map((key) => ({
    key,
    label: STATUS_LABELS[key],
    count: byStatus[key] || 0,
    color: STATUS_COLORS[key],
  }));
  distribution.sort((a, b) => b.count - a.count);

  let maxCount = 1;
  for (const d of distribution) {
    if (d.count > maxCount) maxCount = d.count;
  }

  const sortedShipments = [...shipments].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const lastShipments = sortedShipments.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-8 py-6">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Shipping</h1>
          <p className="text-sm text-slate-500 mt-1">
            Estado actual de la app de envios
          </p>
        </div>
        <a
          href={SHIPPING_PANEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          Abrir panel
        </a>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <KPICard label="Total de envios" value={total} />
        <KPICard label="En transito" value={inTransit} />
        <KPICard label="Entregados" value={delivered} />
        <KPICard label="Cancelados" value={canceled} />
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-medium text-slate-900 mb-3">
          Distribucion por estado
        </h2>
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
          {distribution.map((d) => (
            <div key={d.key} className="flex items-center gap-3">
              <div className="w-28 text-xs text-slate-600">{d.label}</div>
              <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${d.color}`}
                  style={{ width: `${(d.count / maxCount) * 100}%` }}
                />
              </div>
              <div className="w-8 text-xs text-slate-700 text-right font-medium">
                {d.count}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-slate-900 mb-3">
          Ultimos envios creados
        </h2>
        <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
          {lastShipments.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-400">
              No hay envios creados.
            </div>
          ) : (
            lastShipments.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-4 px-5 py-3 text-sm"
              >
                <span className="font-mono text-xs text-slate-700 w-36">
                  {s.trackingCode}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-slate-100">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[s.status]}`}
                  />
                  {STATUS_LABELS[s.status]}
                </span>
                <span className="text-xs text-slate-500 ml-auto">
                  {formatRelativeTime(s.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function KPICard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-2xl font-semibold text-slate-900 mt-1">{value}</div>
    </div>
  );
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `hace ${days} dia${days > 1 ? "s" : ""}`;
  if (hours > 0) return `hace ${hours}h`;
  if (minutes > 0) return `hace ${minutes}m`;
  return "recien";
}