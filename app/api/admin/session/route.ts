import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCookieOptions, createAdminToken, isAdminConfigured, verifyAdminPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  if (!isAdminConfigured()) return NextResponse.json({ error: "Admin sign-in is not configured." }, { status: 503 });

  let password = "";
  try {
    const body: unknown = await request.json();
    if (body && typeof body === "object" && "password" in body && typeof body.password === "string") password = body.password;
  } catch {
    return NextResponse.json({ error: "Enter your admin password." }, { status: 400 });
  }

  if (password.length > 512 || !verifyAdminPassword(password)) {
    return NextResponse.json({ error: "The password was not recognized." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(ADMIN_COOKIE, createAdminToken(), adminCookieOptions);
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(ADMIN_COOKIE, "", { ...adminCookieOptions, maxAge: 0 });
  return response;
}
