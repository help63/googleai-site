import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  const { username, password } = await req.json();

  if (
    username !== process.env.ADMIN_USER ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json(
      { success: false, error: "Invalid code" },
      { status: 401 }
    );
  }

  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return NextResponse.json(
      { success: false, error: "ADMIN_SECRET missing" },
      { status: 500 }
    );
  }

  const expires = Date.now() + 1000 * 60 * 60 * 24;
  const payload = `admin:${expires}`;

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  const res = NextResponse.json({
    success: true
  });

  res.cookies.set(
    "admin_session",
    `${payload}.${signature}`,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24
    }
  );

  return res;
}
