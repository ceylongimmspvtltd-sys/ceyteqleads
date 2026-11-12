# CEYTEQ Leads

A deliberately small Next.js + Tailwind app with two user-facing routes:

- `/business-enquiry` — mobile-friendly enquiry form (name, phone/WhatsApp, business category)
- `/admin/leads` — password-protected owner view with Call and WhatsApp actions

The supplied CEYTEQ logo is included byte-for-byte at `public/ceyteq-logo.jpg`.

## Important: persistent storage is not connected yet

This repository and its existing hosting configuration do not include a verified, approved durable lead store. No Supabase project or new database has been connected or created. To avoid losing customer details, the public form currently stays in **preview mode**: it validates in the browser but does not transmit or claim to save enquiries. The `/api/leads` endpoint fails closed with HTTP 503 instead of writing to memory or pretending a submission succeeded. The admin page shows no fabricated records and the leads API will not return records until durable storage is approved and configured.

Do not run ads or publish this as an active enquiry form until persistent storage is available and tested. Once the owner approves the storage provider, wire it to the public submission and authenticated admin read paths; keep all customer records out of browser storage and protect the store with server-side access controls.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000/business-enquiry` or `http://localhost:3000/admin/leads`.

## Private admin setup

The admin route is server-rendered and checks a signed, HttpOnly, SameSite=Strict session cookie. It has no built-in password. Before enabling sign-in, configure these as **server-side** hosting environment variables (never use a `NEXT_PUBLIC_` prefix):

- `ADMIN_PASSWORD` — a unique, strong owner passphrase (at least 20 characters; use 20+ random characters if practical)
- `ADMIN_SESSION_SECRET` — at least 32 random characters used to sign 8-hour sessions

Then redeploy. Rotate `ADMIN_SESSION_SECRET` to invalidate existing sessions. Keep both values private and do not commit them.

## Vercel

Connect this GitHub repository to an existing or owner-approved Vercel project and deploy with the default Next.js build. Add the two admin environment variables above in Vercel’s project settings. HTTPS is handled by Vercel. No deployment or domain changes are made by this repository itself.

## Checks

```bash
npm run build
npm run lint
```

The app intentionally has no demo leads, analytics, exports, CRM features, or temporary in-memory lead storage.
