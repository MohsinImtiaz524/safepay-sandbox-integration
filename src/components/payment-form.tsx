"use client";

import { FormEvent, useState } from "react";

type CreatePaymentResponse = { checkoutUrl?: string; error?: string };

export function PaymentForm() {
  const [amount, setAmount] = useState("1500");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null); setIsLoading(true);
    try {
      const response = await fetch("/api/payments/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount }) });
      const result = (await response.json()) as CreatePaymentResponse;
      if (!response.ok || !result.checkoutUrl) throw new Error(result.error ?? "Unable to start checkout.");
      window.location.assign(result.checkoutUrl);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to start checkout."); setIsLoading(false);
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-[29rem]">
      <div className="absolute -inset-3 rotate-2 rounded-[2rem] bg-[#d9ef93]/65" />
      <form onSubmit={handleSubmit} className="relative rounded-[1.75rem] border border-[#173f33]/10 bg-white p-6 shadow-[0_28px_60px_rgba(25,60,48,0.14)] sm:p-8">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.17em] text-[#789326]">New transaction</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#15372b]">Choose an amount</h2></div><span className="rounded-lg bg-[#f0f5ec] px-2.5 py-1.5 text-[0.68rem] font-bold tracking-wide text-[#526b61]">TEST</span></div>
        <label htmlFor="amount" className="mt-8 block text-sm font-semibold text-[#385248]">Amount</label>
        <div className="mt-2.5 flex items-center rounded-2xl border border-[#173f33]/15 bg-[#f8faf7] px-4 transition focus-within:border-[#7f9f1f] focus-within:ring-4 focus-within:ring-[#a8c43e]/15">
          <span className="border-r border-[#173f33]/10 pr-4 text-sm font-bold text-[#587066]">PKR</span>
          <input id="amount" name="amount" type="number" inputMode="decimal" min="1" max="1000000" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required aria-describedby={error ? "payment-error" : "amount-help"} className="min-w-0 flex-1 bg-transparent px-4 py-4 text-right text-2xl font-semibold tracking-[-0.02em] text-[#17372c] outline-none placeholder:text-[#9eaaa5]" />
        </div>
        <p id="amount-help" className="mt-2.5 text-xs leading-5 text-[#74877f]">Enter between PKR 1 and PKR 1,000,000.</p>
        {error && <div id="payment-error" role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</div>}
        <button type="submit" disabled={isLoading} className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#173f33] px-5 py-4 text-sm font-bold text-white shadow-[0_12px_24px_rgba(23,63,51,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0f3329] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8ca82b]/30 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0">
          {isLoading ? <><span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />Creating checkout…</> : <>Pay now<svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true"><path d="M4 10h12m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></>}
        </button>
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#71847c]"><svg viewBox="0 0 20 20" className="size-3.5" fill="none" aria-hidden="true"><rect x="4.5" y="8" width="11" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M7 8V6.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.5" /></svg>Redirects to Safepay Sandbox</div>
      </form>
    </div>
  );
}
