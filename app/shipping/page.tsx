import {
  fetchAllShipments,
  STATUS_LABELS,
  STATUS_DOT,
  SHIPPING_API_URL,
} from "@/lib/shipping";
import StatusActionForm from "./StatusActionForm";

export const dynamic = "force-dynamic";

export default async function ShippingPage() {
  let shipments;
  try {
    shipments = await fetchAllShipments();
  } catch {
    return (
      <div className="max-w-6xl mx-auto px-8 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Shipping</h1>
          <p className="text-sm text-slate-500 mt-1">Gestión de envíos del sistema</p>
        </header>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-sm text-red-700">
          No se pudo conectar con la Shipping App.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-6">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Shipping</h1>
          <p className="text-sm text-slate-500 mt-1">
            Operá sobre cualquier envío del sistema
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 border border-slate-200 rounded-md px-2.5 py-1">
            {shipments.length} envíos
          </span>
          <a
            href={`${SHIPPING_API_URL}/panel`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            Abrir panel
          </a>
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1.2fr_1fr_1.6fr] gap-4 px-5 py-3 bg-slate-50 text-xs font-medium text-slate-500">
          <span>Envío</span>
          <span>Estado actual</span>
          <span className="text-right">Cambiar estado</span>
        </div>

        {shipments.map((s) => (
          <div
            key={s.id}
            className="grid grid-cols-[1.2fr_1fr_1.6fr] gap-4 px-5 py-3 border-t border-slate-100 items-center"
          >
            <div>
              <p className="font-mono text-xs text-slate-700">{s.trackingCode}</p>
              <p className="text-xs text-slate-400">{s.orderId}</p>
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[s.status]}`} />
                {STATUS_LABELS[s.status]}
              </span>
            </div>
            <StatusActionForm shipmentId={s.id} currentStatus={s.status} />
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-3">
        Cada cambio se envía a la API de Shipping (PATCH /api/shipments/[id]/status).
        El superadmin puede fijar cualquier estado, combinando las acciones de admin y repartidor.
      </p>
    </div>
  );
}