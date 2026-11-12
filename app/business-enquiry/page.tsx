import { ArrowDown, ArrowUpRight, Check, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { LeadForm } from "@/components/LeadForm";

const benefits = ["Made for your business", "Clear, practical next steps", "Friendly local support"];

export default function BusinessEnquiryPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <div className="page-grid pointer-events-none absolute inset-x-0 top-0 h-[760px] opacity-70" />
      <div className="pointer-events-none absolute -right-32 top-28 h-[470px] w-[470px] rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 top-[470px] h-80 w-80 rounded-full bg-sky-100/60 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-2 sm:px-8 lg:px-12">
        <BrandMark />
        <a href="#enquiry" className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 sm:px-5">
          Talk to our team <ArrowUpRight size={16} />
        </a>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-8 sm:px-8 sm:pt-12 lg:grid-cols-[1fr_0.88fr] lg:gap-20 lg:px-12 lg:pb-24 lg:pt-12">
        <div className="max-w-2xl lg:pb-10">
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-brand-100 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[.14em] text-brand-700 shadow-sm sm:text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-brand-600"><Sparkles size={13} /></span>
            Digital growth, built around you
          </div>
          <h1 className="max-w-xl text-[2.8rem] font-bold leading-[1.08] tracking-[-.045em] text-brand-900 sm:text-6xl lg:text-[4.15rem]">
            Grow your business <span className="relative whitespace-nowrap text-brand-600">with CEYTEQ<span className="absolute -bottom-1 left-0 -z-10 h-3 w-full rounded-full bg-blue-100/80" /></span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
            Digital growth solutions starting at <span className="font-bold text-brand-900">$50/month.</span> Let&apos;s find the right next step for your business.
          </p>

          <div className="mt-9 space-y-3.5">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-sm font-medium text-slate-700 sm:text-base">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600"><Check size={14} strokeWidth={2.8} /></span>
                {benefit}
              </div>
            ))}
          </div>

          <div className="mt-11 hidden items-center gap-3 rounded-2xl border border-blue-100/80 bg-white/75 p-4 shadow-sm sm:inline-flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><ArrowDown size={18} /></div>
            <div>
              <p className="text-sm font-semibold text-brand-900">Start with a conversation</p>
              <p className="mt-0.5 text-xs text-slate-500">Tell us what you&apos;re looking to grow.</p>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl lg:ml-auto">
          <LeadForm />
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-100 bg-white/75">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-center text-xs text-slate-500 sm:flex-row sm:px-8 sm:text-left lg:px-12">
          <p>© {new Date().getFullYear()} CEYTEQ — Ceylon Technology</p>
          <p>Empowering Digital Evolution</p>
        </div>
      </footer>
    </main>
  );
}
