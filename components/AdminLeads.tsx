"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, LoaderCircle, LockKeyhole, LogOut, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import type { Lead } from "@/lib/leads";

function whatsappNumber(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `94${digits.slice(1)}`;
  return digits;
}

function LeadActions({ phone }: { phone: string }) {
  const whatsapp = whatsappNumber(phone);
  return (
    <div className="flex items-center gap-2">
      <a href={`tel:${phone}`} aria-label={`Call ${phone}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-brand-900 transition hover:border-brand-200 hover:bg-brand-50 sm:text-sm">
        <Phone size={15} className="text-brand-600" /> <span>Call</span>
      </a>
      <a href={whatsapp ? `https://wa.me/${whatsapp}` : "#"} target="_blank" rel="noreferrer" aria-label={`Open WhatsApp chat with ${phone}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white transition hover:bg-emerald-700 sm:text-sm">
        <MessageCircle size={15} /> <span>WhatsApp</span>
      </a>
    </div>
  );
}

function formatLeadDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-LK", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function LeadTableRow({ lead }: { lead: Lead }) {
  return <tr className="border-t border-slate-100">
    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">{formatLeadDate(lead.createdAt)}</td>
    <td className="px-5 py-4 text-sm font-semibold text-brand-900">{lead.fullName}</td>
    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{lead.phone}</td>
    <td className="px-5 py-4"><span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700">{lead.category}</span></td>
    <td className="px-5 py-4"><LeadActions phone={lead.phone} /></td>
  </tr>;
}

function LeadCard({ lead }: { lead: Lead }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0"><p className="truncate font-semibold text-brand-900">{lead.fullName}</p><p className="mt-1 text-xs text-slate-500">{formatLeadDate(lead.createdAt)}</p></div>
      <span className="max-w-[48%] truncate rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700">{lead.category}</span>
    </div>
    <p className="mt-3 text-sm text-slate-600">{lead.phone}</p>
    <div className="mt-4"><LeadActions phone={lead.phone} /></div>
  </article>;
}

export function AdminLeads({ configured, authenticated }: { configured: boolean; authenticated: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(authenticated);
  const [storageUnavailable, setStorageUnavailable] = useState(false);

  useEffect(() => {
    if (!authenticated) return;
    let active = true;
    setLoading(true);
    fetch("/api/leads", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) {
          router.refresh();
          return;
        }
        const data = await response.json().catch(() => ({}));
        if (response.ok && Array.isArray(data.leads)) {
          if (active) setLeads(data.leads as Lead[]);
        } else if (response.status === 503) {
          if (active) setStorageUnavailable(true);
        } else if (!response.ok && active) {
          setError(data.error || "Lead records could not be loaded.");
        }
      })
      .catch(() => { if (active) setError("Lead records could not be loaded. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [authenticated, router]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not sign in.");
      setPassword("");
      router.refresh();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => undefined);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#f5f8fc]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <BrandMark compact />
            <span className="hidden h-8 border-l border-slate-200 sm:block" />
            <div><p className="text-sm font-bold text-brand-900">Lead enquiries</p><p className="text-xs text-slate-500">Owner view</p></div>
          </div>
          {authenticated && (
            <button onClick={signOut} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-brand-900">
              <LogOut size={16} /> <span className="hidden sm:inline">Sign out</span>
            </button>
          )}
        </div>
      </header>

      {!configured ? (
        <section className="mx-auto max-w-xl px-4 py-16 sm:px-8 sm:py-24">
          <div className="rounded-3xl border border-amber-200 bg-white p-7 shadow-soft sm:p-9">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"><LockKeyhole size={22} /></div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-amber-700">Private area</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-brand-900">Admin sign-in isn&apos;t configured</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Set server-only <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">ADMIN_PASSWORD</code> (at least 20 characters) and a random <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">ADMIN_SESSION_SECRET</code> (at least 32 characters) in the hosting environment to enable owner login. No password is built into the app.</p>
            <div className="mt-6 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-brand-600" /> Lead access remains disabled until the private admin credentials are configured.</div>
          </div>
        </section>
      ) : !authenticated ? (
        <section className="mx-auto max-w-md px-4 py-16 sm:px-8 sm:py-24">
          <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-soft sm:p-9">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><LockKeyhole size={22} /></div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-brand-600">Owner access</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-brand-900">Sign in to view enquiries</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">This page is private. Enter your admin password to continue.</p>
            <form onSubmit={signIn} className="mt-7 space-y-4">
              <div><label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-slate-700">Admin password</label><input id="admin-password" type="password" autoComplete="current-password" required maxLength={512} value={password} onChange={(event) => setPassword(event.target.value)} className="field" /></div>
              {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
              <button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60">
                {busy ? <><LoaderCircle size={17} className="animate-spin" /> Checking…</> : <>Sign in <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[.16em] text-brand-600">Owner workspace</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-900">Lead enquiries</h1><p className="mt-2 text-sm text-slate-500">New enquiries, ready for a quick follow-up.</p></div>
          </div>
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading enquiries…</div>
          ) : storageUnavailable ? (
            <div className="rounded-2xl border border-amber-200 bg-white p-6 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><AlertCircle size={21} /></div>
              <h2 className="mt-4 text-lg font-bold text-brand-900">Persistent lead storage is not connected</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">There are no sample leads here. Connect an owner-approved durable storage provider before accepting enquiries; submitted records must survive refreshes, deployments, and server restarts.</p>
            </div>
          ) : error ? (
            <div role="alert" className="rounded-2xl border border-rose-200 bg-white p-6 text-sm text-rose-700">{error}</div>
          ) : leads.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center"><p className="font-semibold text-brand-900">No enquiries to show</p><p className="mt-2 text-sm text-slate-500">New submissions will appear here.</p></div>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-2 text-sm text-slate-500"><span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-brand-50 px-2 text-xs font-bold text-brand-700">{leads.length}</span> enquiries</div>
              <div className="space-y-3 md:hidden">{leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)}</div>
              <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block"><div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50"><tr>{["Submission date", "Customer name", "Phone / WhatsApp", "Business category", "Contact"].map((title) => <th key={title} className="whitespace-nowrap px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">{title}</th>)}</tr></thead><tbody>{leads.map((lead) => <LeadTableRow key={lead.id} lead={lead} />)}</tbody></table></div></div>
            </>
          )}
        </section>
      )}
    </main>
  );
}
