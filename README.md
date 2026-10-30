# Safepay Sandbox integration

A minimal payment test environment built with Next.js App Router, TypeScript, Tailwind CSS, and Safepay hosted checkout. It is deliberately locked to **Safepay Sandbox** and does not implement payouts or live payments.

## Included

- Server-created PKR payment trackers and hosted checkout URLs
- Server-side tracker status verification
- Signed webhook endpoint scaffold
- Responsive, accessible payment and result screens
- Strict server-only credential handling

## Setup

Prerequisites: Node.js 20.9+, a Safepay Sandbox merchant account, and its public API key, private API secret, and webhook secret.

1. Run `npm install`.
2. Replace the placeholders in `.env.local`:

   ```dotenv
   SAFEPAY_API_KEY=sec_your_real_sandbox_key
   SAFEPAY_SECRET_KEY=your_real_sandbox_server_secret_key
   SAFEPAY_WEBHOOK_SECRET=your_real_sandbox_webhook_secret
   APP_BASE_URL=http://localhost:3000
   ```

3. Run `npm run dev` and open [http://localhost:3000](http://localhost:3000).
4. Enter an amount and select **Pay now**.

Credentials are read only in server modules. Never use a `NEXT_PUBLIC_` prefix. `.env.local` is ignored by Git; `.env.example` is the safe template to commit.

`SAFEPAY_SECRET_KEY` is the private API secret from the Sandbox dashboard. It authenticates payment-session, passport-token, and tracker-status requests.

## Callbacks and webhooks

Safepay must reach the app for hosted-checkout callbacks and webhooks. For remote testing, expose the app through an HTTPS tunnel and set `APP_BASE_URL` to that origin (without a trailing path).

Configure this Sandbox webhook URL:

```text
https://your-public-origin.example/api/webhooks/safepay
```

The checkout callback is generated as `/api/payments/verify` on the configured origin.

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/payments/create` | `POST` JSON | Validate amount, create a sandbox tracker, return hosted checkout URL. |
| `/api/payments/verify` | `GET` | Fetch the redirected tracker from Safepay, verify its merchant and Sandbox ownership, then show its state. |
| `/api/webhooks/safepay` | `POST` JSON | Reject invalid signatures and acknowledge valid sandbox events. |

The webhook route verifies events but deliberately does not persist orders. Add a database and idempotent event handling before using it for fulfillment.

## Validate

```bash
npm run lint
npm run build
```

## SDK

The complete integration uses the current official `@sfpy/node-core` flow: v3 payment session, short-lived passport token, hosted checkout, and Reporter API verification. Amounts sent to Safepay are converted from PKR to the lowest denomination (paisa).

## Security

- SDK environment is hard-coded to `sandbox`.
- Secrets never cross the server/client boundary.
- Redirect success requires a server-side Reporter API lookup returning `TRACKER_ENDED`.
- Webhooks are verified against the raw body using HMAC-SHA256 and a constant-time comparison.
- `APP_BASE_URL` requires HTTPS except on localhost.
- Never commit `.env.local` or add real credentials to source files.
- This is a test harness, not a production fulfillment system.
