import type { NextRequest } from "next/server";

const FEEDBACK_APP_URL = process.env.FEEDBACK_APP_URL!;

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = request.headers.get("Authorization");
  const res = await fetch(`${FEEDBACK_APP_URL}/api/reviews/${id}`, {
    method: "DELETE",
    headers: authHeader ? { Authorization: authHeader } : {},
  });
  if (!res.ok) {
    const text = await res.text();
    return new Response(text, { status: res.status });
  }
  return new Response(null, { status: 204 });
}
