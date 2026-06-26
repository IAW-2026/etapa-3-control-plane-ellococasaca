import PaymentPanel from "./PaymentPanel";

export default function PaymentsPage() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Payments</h1>
        <p className="text-sm text-slate-500 mt-1">Gestión de compras y ventas</p>
      </header>

      <PaymentPanel
        type="charge"
        title="Compras"
        searchLabel="Buyer ID"
        searchPlaceholder="Ingresá el Buyer ID..."
      />

      <PaymentPanel
        type="payout"
        title="Ventas"
        searchLabel="Seller ID"
        searchPlaceholder="Ingresá el Seller ID..."
      />
    </div>
  );
}
