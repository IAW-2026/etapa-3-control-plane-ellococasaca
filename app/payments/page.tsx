export default function PaymentsPage() {
  return (
    <div className="max-w-6xl mx-auto px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Payments</h1>
        <p className="text-sm text-slate-500 mt-1">
          Transacciones del sistema
        </p>
      </header>

      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
        <p className="text-slate-500 text-sm">
          Esta sección se va a conectar con la API de la Payments App.
        </p>
      </div>
    </div>
  );
}