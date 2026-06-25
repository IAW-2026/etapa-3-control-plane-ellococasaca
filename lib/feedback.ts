export const FEEDBACK_APP_URL = process.env.FEEDBACK_APP_URL!;

export type ReviewStatus = "PUBLISHED" | "HIDDEN" | "PENDING" | "DELETED";
export type ReportStatus = "OPEN" | "RESOLVED" | "DISMISSED";

export type RatingsCacheEntry = {
  targetId: string;
  avgRating: number;
  totalRatings?: number;
};

export type FeedbackAnalytics = {
  reviews: {
    total: number;
    byStatus: Partial<Record<ReviewStatus, number>>;
    moderated: number;
    last7Days: number;
    last30Days: number;
    avgProductRating: number;
    ratingDistribution: Record<string, number>;
    dailySeries: Array<{ date: string; count: number }>;
  };
  reports: {
    total: number;
    byStatus: Partial<Record<ReportStatus, number>>;
    last7Days: number;
    last30Days: number;
  };
  eligibilities: {
    totalEnabled: number;
    consumed: number;
    pending: number;
  };
  topSellers: RatingsCacheEntry[];
  topProducts: RatingsCacheEntry[];
};

export const REVIEW_STATUSES: ReviewStatus[] = [
  "PUBLISHED",
  "HIDDEN",
  "PENDING",
  "DELETED",
];

export const MODERABLE_STATUSES: Array<"PUBLISHED" | "HIDDEN"> = [
  "PUBLISHED",
  "HIDDEN",
];

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

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  OPEN: "Abierto",
  RESOLVED: "Resuelto",
  DISMISSED: "Desestimado",
};

export async function fetchFeedbackAnalytics(
  token: string
): Promise<FeedbackAnalytics> {
  const res = await fetch(`${FEEDBACK_APP_URL}/api/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Analytics respondió ${res.status}`);
  return res.json();
}
