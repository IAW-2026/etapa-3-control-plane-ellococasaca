import type { NextRequest } from "next/server";

const FEEDBACK_APP_URL = process.env.FEEDBACK_APP_URL!;
const INTER_SERVICE_SECRET = process.env.INTER_SERVICE_SECRET;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const res = await fetch(`${FEEDBACK_APP_URL}/api/analytics`, {
    headers: {
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...(INTER_SERVICE_SECRET ? { "x-inter-service-secret": INTER_SERVICE_SECRET } : {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    return new Response(text, { status: res.status });
  }
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
