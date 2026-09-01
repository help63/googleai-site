import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    const page = body.page || "/";
    const visitorId = body.visitorId || "anonymous";

    const headers = request.headers;

    const country =
      headers.get("x-vercel-ip-country") ||
      headers.get("x-vercel-ip-country-code") ||
      "Unknown";

    await sql`
      INSERT INTO analytics_events
        (visitor_id, country, page)
      VALUES
        (${visitorId}, ${country}, ${page})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics error:", error);

    return NextResponse.json(
      { error: "Analytics failed." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();

    if (
      cookieStore.get("admin_session")?.value !==
      "authenticated"
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const totalResult = await sql`
      SELECT COUNT(*)::int AS total_views
      FROM analytics_events
    `;

    const visitorsResult = await sql`
      SELECT COUNT(DISTINCT visitor_id)::int AS unique_visitors
      FROM analytics_events
    `;

    const countries = await sql`
      SELECT country, COUNT(*)::int AS views
      FROM analytics_events
      GROUP BY country
      ORDER BY views DESC
    `;

    const pages = await sql`
      SELECT page, COUNT(*)::int AS views
      FROM analytics_events
      GROUP BY page
      ORDER BY views DESC
    `;

    const recent = await sql`
      SELECT country, page, created_at AS time
      FROM analytics_events
      ORDER BY created_at DESC
      LIMIT 100
    `;

    const daily = await sql`
      SELECT DATE(created_at) AS date, COUNT(*)::int AS views
      FROM analytics_events
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    const weekly = await sql`
      SELECT DATE_TRUNC('week', created_at)::date AS week, COUNT(*)::int AS views
      FROM analytics_events
      WHERE created_at >= NOW() - INTERVAL '12 weeks'
      GROUP BY DATE_TRUNC('week', created_at)
      ORDER BY week ASC
    `;

    const monthly = await sql`
      SELECT DATE_TRUNC('month', created_at)::date AS month, COUNT(*)::int AS views
      FROM analytics_events
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month ASC
    `;

    return NextResponse.json({
      totalViews: totalResult[0]?.total_views || 0,
      uniqueVisitors: visitorsResult[0]?.unique_visitors || 0,
      countries,
      pages,
      recent,
      daily,
      weekly,
      monthly
    });
  } catch (error) {
    console.error("Analytics GET error:", error);

    return NextResponse.json(
      { error: "Analytics failed." },
      { status: 500 }
    );
  }
}
