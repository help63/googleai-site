import crypto from "crypto";
import { cookies } from "next/headers";

export async function isAdminAuthenticated() {
  const secret = process.env.ADMIN_SECRET;

  if (!secret) return false;

  const cookieStore = await cookies();
  const value = cookieStore.get("admin_session")?.value;

  if (!value) return false;

  const parts = value.split(".");
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;

  if (!payload.startsWith("admin:")) return false;

  const expires = Number(payload.slice(6));

  if (!Number.isFinite(expires) || expires < Date.now()) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  if (signature.length !== expected.length) return false;

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
