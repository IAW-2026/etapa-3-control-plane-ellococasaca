import type { NextRequest } from "next/server";

const PAYMENTS_APP_URL = process.env.PAYMENTS_APP_URL!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ buyerId: string }> }
) {
  const { buyerId } = await params;
  const authHeader = request.headers.get("Authorization");

  const res = await fetch(`${PAYMENTS_APP_URL}/api/charge/user/${buyerId}`, {
    headers: authHeader ? { Authorization: authHeader } : {},
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(text, { status: res.status });
  }

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
