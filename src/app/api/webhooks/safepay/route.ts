import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";

type SafepayWebhook = {
  token?: string;
  merchant_api_key?: string;
  type?: string;
  data?: unknown;
};

function hasValidSignature(rawBody: string, receivedSignature: string, secret: string) {
  if (!/^[a-fA-F0-9]{64}$/.test(receivedSignature)) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest();
  const received = Buffer.from(receivedSignature, "hex");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-sfpy-signature");
    if (!signature) return NextResponse.json({ error: "Missing Safepay signature." }, { status: 401 });
    const rawBody = await request.text();
    const env = getServerEnv();

    if (!hasValidSignature(rawBody, signature, env.SAFEPAY_WEBHOOK_SECRET)) {
      return NextResponse.json({ error: "Invalid Safepay signature." }, { status: 401 });
    }

    const body = JSON.parse(rawBody) as SafepayWebhook;
    if (!body.type || body.data === undefined || body.merchant_api_key !== env.SAFEPAY_API_KEY) {
      return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
    }

    // Persist an event id before updating an order. Safepay may retry webhooks,
    // so fulfillment logic must be idempotent when a database is added.
    console.info("Verified Safepay sandbox webhook", { event: body.token ?? "unknown", type: body.type });
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid webhook request." }, { status: 400 });
  }
}
