import "server-only";

type ServerEnv = { SAFEPAY_API_KEY: string; SAFEPAY_SECRET_KEY: string; SAFEPAY_WEBHOOK_SECRET: string; APP_BASE_URL: string };
const requiredKeys = ["SAFEPAY_API_KEY", "SAFEPAY_SECRET_KEY", "SAFEPAY_WEBHOOK_SECRET", "APP_BASE_URL"] as const;

export function getServerEnv(): ServerEnv {
  const missing = requiredKeys.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) throw new Error(`Missing required server environment variables: ${missing.join(", ")}`);
  const appBaseUrl = new URL(process.env.APP_BASE_URL as string);
  const isLocal = ["localhost", "127.0.0.1"].includes(appBaseUrl.hostname);
  if (appBaseUrl.protocol !== "https:" && !isLocal) throw new Error("APP_BASE_URL must use HTTPS outside local development.");

  return {
    SAFEPAY_API_KEY: process.env.SAFEPAY_API_KEY as string,
    SAFEPAY_SECRET_KEY: process.env.SAFEPAY_SECRET_KEY as string,
    SAFEPAY_WEBHOOK_SECRET: process.env.SAFEPAY_WEBHOOK_SECRET as string,
    APP_BASE_URL: appBaseUrl.origin,
  };
}
