import {
  fetchAllShipments,
  fetchCouriers,
  STATUS_LABELS,
  STATUS_DOT,
  SHIPPING_API_URL,
} from "@/lib/shipping";
import StatusActionForm from "./StatusActionForm";
import CourierActionForm from "./CourierActionForm";

export const dynamic = "force-dynamic";

export default async function ShippingPage() {
  let shipments;
  let couriers;
  try {
    [shipments, couriers] = await Promise.all([
      fetchAllShipments(),
      fetchCouriers(),
    ]);
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

  // Mapa id -> nombre para mostrar el repartidor lindo
  const courierName = new Map(couriers.map((c) => [c.id, c.name]));

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
        <div className="grid grid-cols-[1fr_0.9fr_1fr_1.6fr] gap-4 px-5 py-3 bg-slate-50 text-xs font-medium text-slate-500">
          <span>Envío</span>
          <span>Estado</span>
          <span>Repartidor</span>
          <span className="text-right">Acciones</span>
        </div>

        {shipments.map((s) => (
          <div
            key={s.id}
            className="grid grid-cols-[1fr_0.9fr_1fr_1.6fr] gap-4 px-5 py-3 border-t border-slate-100 items-center"
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

            <div className="text-xs text-slate-600">
              {s.courierId ? (
                courierName.get(s.courierId) ?? "Repartidor desconocido"
              ) : (
                <span className="text-slate-400">Sin asignar</span>
              )}
            </div>

            <div className="space-y-2">
              <StatusActionForm shipmentId={s.id} currentStatus={s.status} />
              <CourierActionForm
                shipmentId={s.id}
                currentStatus={s.status}
                currentCourierId={s.courierId}
                couriers={couriers}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-3">
        El superadmin opera cualquier envío vía la API de Shipping: cambia estados
        (acciones de admin y repartidor) y asigna repartidores. La asignación se
        bloquea en estados en curso o cerrados, igual que en el panel interno.
      </p>
    </div>
  );
}