import "server-only";
import SafepayCore from "@sfpy/node-core";
import { getServerEnv } from "@/lib/env";

let coreClient: SafepayCore | undefined;

export function getSafepayCoreClient(): SafepayCore {
  if (coreClient) return coreClient;
  const env = getServerEnv();
  coreClient = new SafepayCore(env.SAFEPAY_SECRET_KEY, {
    authType: "secret",
    host: "https://sandbox.api.getsafepay.com",
    timeout: 10_000,
  });
  return coreClient;
}
