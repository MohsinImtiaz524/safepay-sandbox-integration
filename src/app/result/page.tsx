import Link from "next/link";
import { Suspense } from "react";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default function ResultPage({ searchParams }: Props) {
  return <Suspense fallback={<ResultSkeleton />}><ResultContent searchParams={searchParams} /></Suspense>;
}

function ResultSkeleton() {
  return <main className="grid min-h-screen place-items-center bg-[#f4f6f3] px-5 py-10"><div className="h-96 w-full max-w-lg animate-pulse rounded-[2rem] bg-white shadow-[0_28px_70px_rgba(25,60,48,0.08)]" /></main>;
}

async function ResultContent({ searchParams }: Props) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : "invalid";
  const tracker = typeof params.tracker === "string" ? params.tracker : undefined;
  const reference = typeof params.reference === "string" ? params.reference : undefined;
  const verified = status === "verified";
  const cancelled = status === "cancelled";
  const processing = status === "processing";
  const title = verified ? "Payment verified" : cancelled ? "Checkout cancelled" : processing ? "Payment processing" : "Verification failed";
  const message = verified ? "Safepay confirmed that this sandbox payment was completed successfully." : cancelled ? "No payment was completed. You can return and try another sandbox transaction." : processing ? "Safepay has not marked this payment as completed yet. Check your Sandbox dashboard or try again shortly." : "The payment could not be verified. Do not treat this transaction as paid.";

  return <main className="grid min-h-screen place-items-center bg-[#f4f6f3] px-5 py-10 text-[#17372c]">
    <section className="w-full max-w-lg rounded-[2rem] border border-[#173f33]/10 bg-white p-7 text-center shadow-[0_28px_70px_rgba(25,60,48,0.12)] sm:p-10">
      <div className={`mx-auto grid size-16 place-items-center rounded-2xl ${verified ? "bg-[#e5f4ae] text-[#56720b]" : cancelled || processing ? "bg-[#edf1eb] text-[#65776f]" : "bg-red-50 text-red-600"}`}>
        {verified ? <svg viewBox="0 0 24 24" className="size-8" fill="none" aria-hidden="true"><path d="m5 12 4.2 4.2L19 6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg> : <svg viewBox="0 0 24 24" className="size-8" fill="none" aria-hidden="true"><path d="M12 7v6m0 4h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /></svg>}
      </div>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#829429]">Safepay Sandbox</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{title}</h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#647970]">{message}</p>
      {verified && (tracker || reference) && <dl className="mt-7 rounded-2xl bg-[#f5f7f3] p-4 text-left text-xs">
        {tracker && <div className="flex gap-3 py-1.5"><dt className="w-20 shrink-0 font-semibold text-[#708078]">Tracker</dt><dd className="min-w-0 break-all font-mono text-[#29473b]">{tracker}</dd></div>}
        {reference && <div className="flex gap-3 py-1.5"><dt className="w-20 shrink-0 font-semibold text-[#708078]">Reference</dt><dd className="min-w-0 break-all font-mono text-[#29473b]">{reference}</dd></div>}
      </dl>}
      <Link href="/" className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-[#173f33] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#0f3329] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8ca82b]/30">Back to payment test</Link>
    </section>
  </main>;
}
