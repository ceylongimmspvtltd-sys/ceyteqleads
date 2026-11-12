"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { BUSINESS_CATEGORIES } from "@/lib/leads";

export function LeadForm() {
  const [notice, setNotice] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Do not transmit customer details until approved, durable storage is connected.
    setNotice(true);
  }

  return (
    <section id="enquiry" className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-soft sm:p-8 lg:p-9" aria-labelledby="form-heading">
      <div className="mb-7">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-600" /> Let&apos;s talk about your business
        </div>
        <h2 id="form-heading" className="text-2xl font-bold tracking-tight text-brand-900">Get in touch</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Share a few details and our team will be in touch.</p>
      </div>

      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-900" role="note">
        <AlertCircle size={16} className="mt-0.5 shrink-0" />
        <span><strong className="font-semibold">Preview only.</strong> Enquiries are not sent or stored until approved persistent storage is connected.</span>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div>
          <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-slate-700">Full name <span className="text-brand-600">*</span></label>
          <input id="fullName" name="fullName" autoComplete="name" required maxLength={120} placeholder="e.g. Nimal Perera" className="field" />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">Phone / WhatsApp number <span className="text-brand-600">*</span></label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" required maxLength={32} placeholder="e.g. +94 77 123 4567" className="field" />
        </div>
        <div>
          <label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-700">Business category <span className="text-brand-600">*</span></label>
          <select id="category" name="category" required defaultValue="" className="field appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2360758b%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E')] bg-[right_1rem_center] bg-no-repeat pr-10">
            <option value="" disabled>Select your business category</option>
            {BUSINESS_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>

        {notice && (
          <div role="alert" aria-live="assertive" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            Your details have not been sent or saved. Persistent storage must be configured before this form can accept enquiries.
          </div>
        )}

        <button type="submit" className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(21,101,192,.22)] transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
          Submit enquiry <ArrowRight size={17} />
        </button>
        <p className="flex items-start justify-center gap-2 text-center text-xs leading-5 text-slate-500">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-brand-600" /> Your contact details are used only to respond to your enquiry.
        </p>
      </form>
    </section>
  );
}
