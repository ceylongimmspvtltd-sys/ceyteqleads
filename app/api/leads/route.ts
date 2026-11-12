import { NextRequest, NextResponse } from "next/server";
import { BUSINESS_CATEGORIES, STORAGE_UNAVAILABLE_MESSAGE } from "@/lib/leads";
import { hasAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status: number) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } });
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 8_000) return json({ error: "The enquiry is too large." }, 413);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Please check the enquiry details and try again." }, 400);
  }

  if (!body || typeof body !== "object") return json({ error: "Please check the enquiry details and try again." }, 400);
  const data = body as Record<string, unknown>;
  const fullName = typeof data.fullName === "string" ? data.fullName.trim() : "";
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  const category = typeof data.category === "string" ? data.category : "";
  if (fullName.length < 2 || fullName.length > 120) return json({ error: "Enter a name between 2 and 120 characters." }, 400);
  if (phone.length < 5 || phone.length > 32 || !/^[+\d()\s.-]+$/.test(phone)) return json({ error: "Enter a valid phone or WhatsApp number." }, 400);
  if (!BUSINESS_CATEGORIES.includes(category as (typeof BUSINESS_CATEGORIES)[number])) return json({ error: "Select a business category from the list." }, 400);

  // Intentionally fail closed: no lead is acknowledged until approved persistent storage is connected.
  return json({ error: STORAGE_UNAVAILABLE_MESSAGE, code: "PERSISTENT_STORAGE_NOT_CONFIGURED" }, 503);
}

export async function GET() {
  if (!(await hasAdminSession())) return json({ error: "Sign in is required." }, 401);
  // No records are fabricated or kept in memory. Connect approved durable storage before enabling lead reads.
  return json({ error: "Persistent lead storage is not configured." }, 503);
}
