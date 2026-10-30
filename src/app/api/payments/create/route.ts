import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";
import { getSafepayCoreClient } from "@/lib/safepay";

type PaymentSessionResponse = {
  data?: { tracker?: { token?: string } };
};

type PassportResponse = {
  data?: string;
};

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 1_000_000;

export async function POST(request: Request) {
  try {
    if (!(request.headers.get("content-type") ?? "").includes("application/json")) return NextResponse.json({ error: "Content-Type must be application/json." }, { status: 415 });
    const body = (await request.json()) as { amount?: unknown };
    const amount = typeof body.amount === "number" ? body.amount : Number(body.amount);
    if (!Number.isFinite(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      return NextResponse.json({ error: `Amount must be between PKR ${MIN_AMOUNT} and PKR ${MAX_AMOUNT.toLocaleString()}.` }, { status: 400 });
    }

    // Safepay v3 expects the amount in the currency's lowest denomination.
    const amountInPaisa = Math.round(amount * 100);
    const orderId = `test_${randomUUID()}`;
    const env = getServerEnv();
    const safepay = getSafepayCoreClient();

    const session = await safepay.payments.session.setup({
      merchant_api_key: env.SAFEPAY_API_KEY,
      intent: "CYBERSOURCE",
      mode: "payment",
      entry_mode: "raw",
      currency: "PKR",
      amount: amountInPaisa,
      metadata: { order_id: orderId },
      include_fees: false,
    }) as PaymentSessionResponse;

    const tracker = session.data?.tracker?.token;
    if (!tracker) throw new Error("Safepay did not return a payment tracker.");

    const passport = await safepay.client.passport.create() as PassportResponse;
    const tbt = passport.data;
    if (!tbt) throw new Error("Safepay did not return an authentication token.");

    const checkoutUrl = safepay.checkout.createCheckoutUrl({
      env: "sandbox",
      tbt,
      tracker,
      source: "hosted",
      order_id: orderId,
      cancel_url: `${env.APP_BASE_URL}/result?status=cancelled`,
      redirect_url: `${env.APP_BASE_URL}/api/payments/verify`,
    });

    return NextResponse.json({ checkoutUrl, orderId }, { status: 201 });
  } catch (error) {
    console.error("Safepay checkout creation failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Could not create a Safepay Sandbox checkout. Check the server configuration and try again." }, { status: 502 });
  }
}
