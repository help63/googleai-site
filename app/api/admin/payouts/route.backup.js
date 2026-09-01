import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function authorized() {
  return await isAdminAuthenticated();
}

export async function GET() {
  if (!(await authorized()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payouts = await sql`
      SELECT id, method, amount, status, created_at
      FROM payout_requests
      ORDER BY created_at DESC
      LIMIT 100
    `;

    return NextResponse.json({ payouts });
  } catch (error) {
    console.error("Payout fetch error:", error);
    return NextResponse.json(
      { error: "Unable to fetch payouts" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  if (!(await authorized()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    const allowed = [
      "pakistan_bank",
      "easypaisa",
      "jazzcash",
      "international_bank",
      "binance_p2p"
    ];

    if (!allowed.includes(body.method))
      return NextResponse.json({ error: "Invalid payout method" }, { status: 400 });

    const amount = Number(body.amount);

    if (!Number.isFinite(amount) || amount <= 0)
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

    const result = await sql`
      INSERT INTO payout_requests
        (method, recipient_name, account_reference, amount, currency, note)
      VALUES
        (
          ${body.method},
          ${body.recipientName || ""},
          ${body.accountReference || ""},
          ${amount},
          ${body.currency || "USD"},
          ${body.note || ""}
        )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      payout: result[0]
    });
  } catch (error) {
    console.error("Payout error:", error);
    return NextResponse.json(
      { error: "Payout request failed" },
      { status: 500 }
    );
  }
}


export async function PATCH(request) {
  if (!(await authorized()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    const id = Number(body.id);
    const allowedStatuses = [
      "pending",
      "processing",
      "paid",
      "failed",
      "cancelled"
    ];

    if (!Number.isInteger(id) || id <= 0)
      return NextResponse.json({ error: "Invalid payout ID" }, { status: 400 });

    if (!allowedStatuses.includes(body.status))
      return NextResponse.json({ error: "Invalid payout status" }, { status: 400 });

    const result = await sql`
      UPDATE payout_requests
      SET status = ${body.status},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0)
      return NextResponse.json({ error: "Payout not found" }, { status: 404 });

    return NextResponse.json({
      success: true,
      payout: result[0]
    });
  } catch (error) {
    console.error("Payout status update error:", error);

    return NextResponse.json(
      { error: "Payout status update failed" },
      { status: 500 }
    );
  }
}
