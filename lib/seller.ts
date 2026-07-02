export const SELLER_APP_URL = process.env.SELLER_APP_URL!;
const INTER_SERVICE_SECRET = process.env.INTER_SERVICE_SECRET;

export type SellerAnalytics = {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    completedRevenue: number;
    pendingOrders: number;
    deliveredOrders: number;
    averageOrderValue: number;
    totalProducts: number;
    lowStockProducts: number;
    activeSellers: number;
  };
  statusBreakdown: Record<string, number>;
  salesTrend: Array<{ date: string; total: number }>;
  topProducts: Array<{ id: string; title: string; sold: number }>;
};

export type AdminSummary = {
  summary: {
    sellers: number;
    products: number;
    orders: number;
    lowStockProducts: number;
  };
  statusBreakdown: Record<string, number>;
};

export type SellerProduct = {
  id: string;
  title: string;
  price: number;
  stock: number;
  sellerId: string;
  sellerName: string;
  category: string;
  createdAt: string;
};

export type SellerUser = {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  productsCount: number;
  ordersCount: number;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function authHeaders(token?: string | null): Record<string, string> {
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(INTER_SERVICE_SECRET ? { "x-inter-service-secret": INTER_SERVICE_SECRET } : {}),
  };
}

export async function fetchSellerAnalytics(token?: string | null): Promise<SellerAnalytics> {
  const res = await fetch(`${SELLER_APP_URL}/api/analytics`, {
    cache: "no-store",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`Analytics respondió ${res.status}`);
  return res.json();
}

export async function fetchAdminSummary(token?: string | null): Promise<AdminSummary> {
  const res = await fetch(`${SELLER_APP_URL}/api/admin`, {
    cache: "no-store",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`Admin respondió ${res.status}`);
  return res.json();
}

export async function fetchAdminProducts(token?: string | null): Promise<{ products: SellerProduct[]; pagination: Pagination }> {
  const res = await fetch(`${SELLER_APP_URL}/api/admin/products`, {
    cache: "no-store",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`Admin products respondió ${res.status}`);
  return res.json();
}

export async function fetchAdminSellers(token?: string | null): Promise<{ sellers: SellerUser[]; pagination: Pagination }> {
  const res = await fetch(`${SELLER_APP_URL}/api/admin/sellers`, {
    cache: "no-store",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`Admin sellers respondió ${res.status}`);
  return res.json();
}
