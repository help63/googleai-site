import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";

const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const earnings = await sql`
      SELECT COALESCE(SUM(revenue), 0) AS total
      FROM earnings
    `;

    const payouts = await sql`
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM payout_requests
      WHERE status IN ('pending', 'processing', 'paid')
    `;

    const totalEarnings = Number(earnings[0]?.total || 0);
    const reservedPayouts = Number(payouts[0]?.total || 0);

    return NextResponse.json({
      currency: "USD",
      totalEarnings,
      reservedPayouts,
      availableBalance: Math.max(
        0,
        totalEarnings - reservedPayouts
      )
    });
  } catch (error) {
    console.error("Payout balance error:", error);

    return NextResponse.json(
      { error: "Unable to calculate payout balance" },
      { status: 500 }
    );
  }
}
