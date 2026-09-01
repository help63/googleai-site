import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

const file = path.join(process.cwd(), "data", "news.json");

async function readNews() {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return [];
  }
}

async function writeNews(news) {
  await fs.writeFile(file, JSON.stringify(news, null, 2));
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  let news = await readNews();

  if (category && category !== "Latest") {
    news = news.filter(
      (item) => item.category?.toLowerCase() === category.toLowerCase()
    );
  }

  if (q) {
    const query = q.toLowerCase();
    news = news.filter(
      (item) =>
        item.title?.toLowerCase().includes(query) ||
        item.excerpt?.toLowerCase().includes(query)
    );
  }

  return NextResponse.json(news);
}

export async function POST(request) {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.title?.trim()) {
    return NextResponse.json(
      { error: "Title is required." },
      { status: 400 }
    );
  }

  const news = await readNews();

  const article = {
    id: crypto.randomUUID(),
    title: body.title.trim(),
    slug: `${slugify(body.title)}-${Date.now()}`,
    excerpt: body.excerpt?.trim() || "",
    content: body.content?.trim() || "",
    category: body.category || "Latest",
    image: body.image?.trim() || "",
    author: body.author?.trim() || "GoogleAI News",
    breaking: Boolean(body.breaking),
    featured: Boolean(body.featured),
    views: 0,
    createdAt: new Date().toISOString()
  };

  news.unshift(article);
  await writeNews(news);

  return NextResponse.json(article, { status: 201 });
}

export async function DELETE(request) {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  const news = await readNews();
  const updated = news.filter((item) => item.id !== id);

  await writeNews(updated);

  return NextResponse.json({ success: true });
}
