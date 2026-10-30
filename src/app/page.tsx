import { PaymentForm } from "@/components/payment-form";
import Link from "next/link";

const features = ["Hosted checkout", "Signed callbacks", "Sandbox only"];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6f3] px-5 py-6 text-[#13241d] sm:px-8 sm:py-8 lg:px-12">
      <div className="pointer-events-none absolute -right-24 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#d4f65a]/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-64 -left-24 h-[35rem] w-[35rem] rounded-full bg-[#bcded1]/40 blur-3xl" />
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col rounded-[2rem] border border-white/80 bg-white/65 shadow-[0_30px_80px_rgba(27,52,42,0.09)] backdrop-blur-xl sm:min-h-[calc(100vh-4rem)]">
        <header className="flex items-center justify-between border-b border-[#193d31]/10 px-6 py-5 sm:px-9">
          <Link href="/" className="flex items-center gap-3" aria-label="Safepay sandbox home">
            <span className="grid size-9 place-items-center rounded-xl bg-[#173f33] text-white shadow-sm">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true"><path d="M7 12.5 10.2 16 17.5 8" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span className="text-[1.05rem] font-semibold tracking-[-0.02em]">Safepay Lab</span>
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#173f33]/10 bg-white/75 px-3.5 py-2 text-xs font-semibold text-[#345247] shadow-sm">
            <span className="size-2 rounded-full bg-[#94c11f] shadow-[0_0_0_4px_rgba(148,193,31,0.14)]" /> Sandbox mode
          </span>
        </header>
        <section className="grid flex-1 items-center gap-12 px-6 py-12 sm:px-9 lg:grid-cols-[1.05fr_0.95fr] lg:px-16 lg:py-14 xl:gap-24 xl:px-24">
          <div className="max-w-2xl">
            <p className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#5e7b70]"><span className="h-px w-8 bg-[#91ad29]" />Payment integration test</p>
            <h1 className="max-w-xl text-[clamp(3rem,6vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-[#132d24]">Test payments,<span className="block text-[#6f8f17]">without the risk.</span></h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[#557066] sm:text-lg sm:leading-8">Create a sandbox transaction and continue securely on Safepay&apos;s hosted checkout. No real money will move.</p>
            <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-3" aria-label="Integration features">
              {features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm font-medium text-[#3f5a50]"><svg viewBox="0 0 20 20" className="size-4 text-[#8cac21]" fill="none" aria-hidden="true"><path d="m4 10 3.4 3.4L16 5.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>{feature}</li>)}
            </ul>
          </div>
          <PaymentForm />
        </section>
        <footer className="flex flex-col gap-2 border-t border-[#193d31]/10 px-6 py-5 text-xs text-[#6c8179] sm:flex-row sm:items-center sm:justify-between sm:px-9"><p>Developer test environment · PKR transactions</p><p>Your payment details are handled by Safepay.</p></footer>
      </div>
    </main>
  );
}
