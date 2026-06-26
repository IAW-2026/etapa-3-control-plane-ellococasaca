import { auth } from "@clerk/nextjs/server";
import { fetchAdminProducts, fetchAdminSellers } from "@/lib/seller";
import SellerPanel from "./SellerPanel";

export const dynamic = "force-dynamic";

export default async function SellerPage() {
  const { getToken } = await auth();
  const token = await getToken();

  let productsData;
  let sellersData;

  try {
    [productsData, sellersData] = await Promise.all([
      fetchAdminProducts(token),
      fetchAdminSellers(token),
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return (
      <div className="max-w-6xl mx-auto px-8 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Seller</h1>
          <p className="text-sm text-slate-500 mt-1">Gestión de productos y vendedores</p>
        </header>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-sm text-red-700 space-y-1">
          <p className="font-medium">No se pudo conectar con la Seller App.</p>
          <p className="font-mono text-xs text-red-600">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-6 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Seller</h1>
        <p className="text-sm text-slate-500 mt-1">Gestión de productos y vendedores</p>
      </header>
      <SellerPanel products={productsData.products} sellers={sellersData.sellers} />
    </div>
  );
}
