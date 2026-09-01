import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

const file = path.join(process.cwd(), "data", "analytics.json");

async function readData() {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return {
      totalViews: 0,
      visitors: {},
      countries: {},
      pages: {},
      recent: []
    };
  }
}

async function writeData(data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const headers = request.headers;

    const country =
      headers.get("x-vercel-ip-country") ||
      headers.get("x-vercel-ip-country-code") ||
      "Unknown";

    const page = body.page || "/";
    const visitorId = body.visitorId || "anonymous";

    const data = await readData();

    data.totalViews += 1;

    if (!data.countries[country]) {
      data.countries[country] = 0;
    }

    data.countries[country] += 1;

    if (!data.pages[page]) {
      data.pages[page] = 0;
    }

    data.pages[page] += 1;

    if (!data.visitors[visitorId]) {
      data.visitors[visitorId] = {
        country,
        firstSeen: new Date().toISOString(),
        views: 0
      };
    }

    data.visitors[visitorId].views += 1;
    data.visitors[visitorId].lastSeen = new Date().toISOString();

    data.recent.unshift({
      country,
      page,
      time: new Date().toISOString()
    });

    data.recent = data.recent.slice(0, 100);

    await writeData(data);

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error("Analytics error:", error);

    return NextResponse.json(
      { error: "Analytics failed." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const data = await readData();

  const countries = Object.entries(data.countries)
    .map(([country, views]) => ({
      country,
      views
    }))
    .sort((a, b) => b.views - a.views);

  const pages = Object.entries(data.pages)
    .map(([page, views]) => ({
      page,
      views
    }))
    .sort((a, b) => b.views - a.views);

  const uniqueVisitors = Object.keys(data.visitors).length;

  return NextResponse.json({
    totalViews: data.totalViews,
    uniqueVisitors,
    countries,
    pages,
    recent: data.recent
  });
}
