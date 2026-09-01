import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const file = path.join(process.cwd(), "data", "news.json");

function authorized(req) {
  return req.cookies.get("admin_session")?.value === "authenticated";
}

export async function GET() {
  try {
    const data = JSON.parse(await fs.readFile(file, "utf8"));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    let news = [];

    try {
      news = JSON.parse(await fs.readFile(file, "utf8"));
    } catch {}

    const item = {
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt || "",
      category: body.category || "AI",
      author: body.author || "GoogleAi Team",
      createdAt: body.createdAt || new Date().toISOString(),
      image: body.image || "",
      content: body.content || body.excerpt || ""
    };

    news.unshift(item);

    await fs.writeFile(file, JSON.stringify(news, null, 2));

    return NextResponse.json({ success: true, news: item });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    let news = JSON.parse(await fs.readFile(file, "utf8"));

    news = news.map((item) =>
      item.slug === body.slug
        ? {
            ...item,
            ...body,
            slug: item.slug
          }
        : item
    );

    await fs.writeFile(file, JSON.stringify(news, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await req.json();

    let news = JSON.parse(await fs.readFile(file, "utf8"));
    news = news.filter((item) => item.slug !== slug);

    await fs.writeFile(file, JSON.stringify(news, null, 2));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
