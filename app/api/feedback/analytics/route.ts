import type { NextRequest } from "next/server";

const FEEDBACK_APP_URL = process.env.FEEDBACK_APP_URL!;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const res = await fetch(`${FEEDBACK_APP_URL}/api/analytics`, {
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
