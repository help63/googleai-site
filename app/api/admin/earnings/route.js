import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function authorized() {
  return await isAdminAuthenticated();
}

export async function GET() {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const totals = await sql`
    SELECT
      COALESCE(SUM(revenue), 0) AS revenue,
      COALESCE(SUM(impressions), 0) AS impressions,
      COALESCE(SUM(clicks), 0) AS clicks
    FROM earnings
  `;

  const daily = await sql`
    SELECT date, COALESCE(SUM(revenue),0) AS revenue
    FROM earnings
    WHERE date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY date
    ORDER BY date ASC
  `;

  const weekly = await sql`
    SELECT DATE_TRUNC('week', date)::date AS week,
           COALESCE(SUM(revenue),0) AS revenue
    FROM earnings
    WHERE date >= CURRENT_DATE - INTERVAL '12 weeks'
    GROUP BY DATE_TRUNC('week', date)
    ORDER BY week ASC
  `;

  const monthly = await sql`
    SELECT DATE_TRUNC('month', date)::date AS month,
           COALESCE(SUM(revenue),0) AS revenue
    FROM earnings
    WHERE date >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', date)
    ORDER BY month ASC
  `;

  const sources = await sql`
    SELECT source, COALESCE(SUM(revenue),0) AS revenue
    FROM earnings
    GROUP BY source
    ORDER BY revenue DESC
  `;

  const countries = await sql`
    SELECT country, COALESCE(SUM(revenue),0) AS revenue
    FROM earnings
    GROUP BY country
    ORDER BY revenue DESC
  `;

  return NextResponse.json({
    totals: totals[0] || {},
    daily,
    weekly,
    monthly,
    sources,
    countries
  });
}

export async function POST(request) {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const revenue = Number(body.revenue);
    const impressions = Number(body.impressions || 0);
    const clicks = Number(body.clicks || 0);

    if (!Number.isFinite(revenue) || revenue < 0) {
      return NextResponse.json(
        { error: "Invalid revenue" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(impressions) || impressions < 0) {
      return NextResponse.json(
        { error: "Invalid impressions" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(clicks) || clicks < 0) {
      return NextResponse.json(
        { error: "Invalid clicks" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO earnings
        (source, date, revenue, impressions, clicks, country, page)
      VALUES
        (
          ${body.source || "manual"},
          ${body.date || new Date().toISOString().slice(0,10)},
          ${revenue},
          ${impressions},
          ${clicks},
          ${body.country || "Unknown"},
          ${body.page || "/"}
        )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      earning: result[0]
    });
  } catch (error) {
    console.error("Earnings error:", error);

    return NextResponse.json(
      { error: "Earnings operation failed" },
      { status: 500 }
    );
  }
}
