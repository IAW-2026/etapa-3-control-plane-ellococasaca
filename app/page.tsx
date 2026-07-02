export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Vista general</h1>
        <p className="text-sm text-slate-500 mt-1">
          Resumen del sistema completo
        </p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KPICard label="Envíos activos" value="—" />
        <KPICard label="Pedidos hoy" value="—" />
        <KPICard label="Vendedores activos" value="—" />
        <KPICard label="Reseñas pendientes" value="—" />
      </section>

      <section>
        <h2 className="text-sm font-medium text-slate-900 mb-3">
          Actividad reciente
        </h2>
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-sm text-slate-400">
          Acá se va a mostrar la actividad consolidada del sistema.
        </div>
      </section>
    </div>
  );
}

function KPICard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-2xl font-semibold text-slate-900 mt-1">{value}</div>
    </div>
  );
}