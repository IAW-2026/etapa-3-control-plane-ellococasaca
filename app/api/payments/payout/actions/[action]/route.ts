import type { NextRequest } from "next/server";

const PAYMENTS_APP_URL = process.env.PAYMENTS_APP_URL!;
const VALID_ACTIONS = ["accept", "reject", "pending"] as const;
type Action = (typeof VALID_ACTIONS)[number];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;

  if (!VALID_ACTIONS.includes(action as Action)) {
    return new Response("Acción no válida", { status: 400 });
  }

  const authHeader = request.headers.get("Authorization");
  const body = await request.json();

  const res = await fetch(`${PAYMENTS_APP_URL}/api/payout/actions/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(text, { status: res.status });
  }

  const text = await res.text();
  if (!text) return new Response(null, { status: res.status });
  try {
    return Response.json(JSON.parse(text), { status: res.status });
  } catch {
    return new Response(text, { status: res.status });
  }
}
