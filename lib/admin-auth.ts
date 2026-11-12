import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ceyteq_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;

type SessionPayload = { expiresAt: number };

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 20 && process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 32);
}

function signature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function verifyAdminPassword(password: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword || !password) return false;
  const suppliedDigest = createHash("sha256").update(password).digest();
  const configuredDigest = createHash("sha256").update(configuredPassword).digest();
  const sameLength = Buffer.byteLength(password) === Buffer.byteLength(configuredPassword);
  return timingSafeEqual(suppliedDigest, configuredDigest) && sameLength;
}

export function createAdminToken(now = Date.now()) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("Admin session secret is not configured.");
  const payload = Buffer.from(JSON.stringify({ expiresAt: now + SESSION_SECONDS * 1000 } satisfies SessionPayload)).toString("base64url");
  return `${payload}.${signature(payload, secret)}`;
}

export function verifyAdminToken(token: string | undefined, now = Date.now()) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32 || !token) return false;
  const [payload, suppliedSignature, extra] = token.split(".");
  if (!payload || !suppliedSignature || extra !== undefined) return false;
  const expectedSignature = signature(payload, secret);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return false;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
    return Number.isSafeInteger(decoded.expiresAt) && decoded.expiresAt > now;
  } catch {
    return false;
  }
}

export async function hasAdminSession() {
  if (!isAdminConfigured()) return false;
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_SECONDS,
};
