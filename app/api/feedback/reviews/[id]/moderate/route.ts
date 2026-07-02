import type { NextRequest } from "next/server";

const FEEDBACK_APP_URL = process.env.FEEDBACK_APP_URL!;
const INTER_SERVICE_SECRET = process.env.INTER_SERVICE_SECRET;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = request.headers.get("Authorization");
  const body = await request.json();
  const res = await fetch(`${FEEDBACK_APP_URL}/api/reviews/${id}/moderate`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...(INTER_SERVICE_SECRET ? { "x-inter-service-secret": INTER_SERVICE_SECRET } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    return new Response(text, { status: res.status });
  }
  const data = await res.json().catch(() => null);
  return Response.json(data, { status: res.status });
}
