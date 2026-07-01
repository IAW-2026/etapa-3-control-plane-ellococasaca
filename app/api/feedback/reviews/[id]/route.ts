import type { NextRequest } from "next/server";

const FEEDBACK_APP_URL = process.env.FEEDBACK_APP_URL!;
const INTER_SERVICE_SECRET = process.env.INTER_SERVICE_SECRET;

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = request.headers.get("Authorization");
  const res = await fetch(`${FEEDBACK_APP_URL}/api/reviews/${id}`, {
    method: "DELETE",
    headers: {
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...(INTER_SERVICE_SECRET ? { "x-inter-service-secret": INTER_SERVICE_SECRET } : {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    return new Response(text, { status: res.status });
  }
  return new Response(null, { status: 204 });
}
