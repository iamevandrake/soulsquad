/**
 * POST /api/stripe/webhook
 *
 * Receives Stripe webhook events and forwards them to the Railway backend.
 * In production, you'd point Stripe webhooks directly at the Railway backend.
 * This route exists as a fallback if you want webhooks through Vercel.
 */
import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature" },
        { status: 400 },
      );
    }

    // Forward raw body to Railway backend
    const res = await fetch(`${config.apiUrl}/api/webhooks/stripe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "stripe-signature": signature,
      },
      body,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[webhook] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
