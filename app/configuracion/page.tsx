export default function ConfiguracionPage() {
  return (
    <div className="max-w-6xl mx-auto px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Configuración</h1>
        <p className="text-sm text-slate-500 mt-1">
          Ajustes globales
        </p>
      </header>

      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
        <p className="text-slate-500 text-sm">
          Configuración global del Control Plane.
        </p>
      </div>
    </div>
  );
}