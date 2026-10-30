import { NextRequest, NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";
import { getSafepayCoreClient } from "@/lib/safepay";

type Tracker = {
  token?: string;
  state?: string;
  environment?: string;
  client?: string | { api_key?: string };
};

type TrackerResponse = {
  data?: Tracker | { tracker?: Tracker };
};

const TRACKER_PATTERN = /^track_[a-zA-Z0-9-]+$/;

function resultRedirect(status: string, values: Record<string, string> = {}) {
  const env = getServerEnv();
  const params = new URLSearchParams({ status, ...values });
  return NextResponse.redirect(`${env.APP_BASE_URL}/result?${params.toString()}`, 303);
}

export async function GET(request: NextRequest) {
  const trackerToken = request.nextUrl.searchParams.get("tracker") ?? "";
  const orderId = request.nextUrl.searchParams.get("order_id") ?? "";

  if (!TRACKER_PATTERN.test(trackerToken)) return resultRedirect("invalid");

  try {
    const response = await getSafepayCoreClient().reporter.payments.fetch(trackerToken) as TrackerResponse;
    const data = response.data;
    const tracker: Tracker | undefined = data && "tracker" in data ? data.tracker : data as Tracker | undefined;
    if (!tracker) return resultRedirect("invalid");
    const clientApiKey = typeof tracker?.client === "string" ? tracker.client : tracker?.client?.api_key;
    const env = getServerEnv();

    const belongsToMerchant = clientApiKey === env.SAFEPAY_API_KEY;
    const isSandbox = tracker?.environment === undefined || tracker.environment === "sandbox";
    const isPaid = tracker?.state === "TRACKER_ENDED";

    if (!belongsToMerchant || !isSandbox) return resultRedirect("invalid");

    return resultRedirect(isPaid ? "verified" : "processing", {
      tracker: tracker.token ?? trackerToken,
      ...(orderId ? { orderId } : {}),
    });
  } catch (error) {
    console.error("Safepay tracker verification failed", error instanceof Error ? error.message : "Unknown error");
    return resultRedirect("invalid");
  }
}

