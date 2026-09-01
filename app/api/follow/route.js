import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    /*
      EMAIL NOTIFICATION

      Add these values to .env.local:

      RESEND_API_KEY=re_xxxxxxxxx
      FOLLOW_NOTIFY_EMAIL=your@email.com
      FOLLOW_FROM_EMAIL=GoogleAi <onboarding@resend.dev>

      If RESEND_API_KEY is not configured, the signup is logged
      locally instead of pretending that an email was sent.
    */

    const apiKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.FOLLOW_NOTIFY_EMAIL;
    const fromEmail =
      process.env.FOLLOW_FROM_EMAIL ||
      "GoogleAi <onboarding@resend.dev>";

    if (apiKey && notifyEmail) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [notifyEmail],
          subject: "New GoogleAi Create signup",
          text:
            `A visitor voluntarily joined GoogleAi updates.\n\nEmail: ${email}\n\nTime: ${new Date().toISOString()}`
        })
      });

      if (!response.ok) {
        console.error("Email notification failed:", await response.text());
        return NextResponse.json(
          { error: "Signup saved, but notification could not be sent." },
          { status: 502 }
        );
      }
    } else {
      console.log("[GoogleAi Create signup]", email);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Follow API error:", error);

    return NextResponse.json(
      { error: "Unable to process request." },
      { status: 500 }
    );
  }
}
