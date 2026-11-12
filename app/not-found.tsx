import Link from "next/link";

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-brand-600">CEYTEQ</p><h1 className="mt-3 text-3xl font-bold text-brand-900">Page not found</h1><p className="mt-2 text-slate-600">The page you were looking for doesn&apos;t exist.</p><Link href="/business-enquiry" className="mt-6 inline-flex rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white">Go to enquiry form</Link></div></main>;
}
