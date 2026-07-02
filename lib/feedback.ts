export type ReviewStatus = "PUBLISHED" | "HIDDEN" | "PENDING" | "DELETED";

export type AdminReview = {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  orderId: string;
  ratingProduct: number;
  comment: string;
  status: ReviewStatus;
  isModerated: boolean;
  createdAt: string;
};

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  PUBLISHED: "Publicada",
  HIDDEN: "Oculta",
  PENDING: "Pendiente",
  DELETED: "Eliminada",
};

export const REVIEW_STATUS_DOT: Record<ReviewStatus, string> = {
  PUBLISHED: "bg-green-500",
  HIDDEN: "bg-amber-400",
  PENDING: "bg-blue-400",
  DELETED: "bg-red-500",
};

export const REVIEW_STATUS_BADGE: Record<ReviewStatus, string> = {
  PUBLISHED: "border-green-200 bg-green-50 text-green-700",
  HIDDEN: "border-amber-200 bg-amber-50 text-amber-700",
  PENDING: "border-blue-200 bg-blue-50 text-blue-700",
  DELETED: "border-red-200 bg-red-50 text-red-700",
};

export async function fetchAdminReviews(
  token: string,
  skip = 0,
  limit = 5,
  q = ""
): Promise<{ reviews: AdminReview[]; total: number; skip: number; take: number }> {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
    ...(q ? { q } : {}),
  });
  const res = await fetch(`/api/feedback/admin/reviews?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Reviews respondió ${res.status}`);
  return res.json();
}
