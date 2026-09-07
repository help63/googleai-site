import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import fs from "fs/promises";
import path from "path";

function getSql() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_UNPOOLED;

  if (!connectionString) {
    throw new Error("DATABASE_URL is missing");
  }

  return neon(connectionString);
}

function normalize(item) {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description || "",
    buyPrice:
      item.buy_price !== undefined
        ? (item.buy_price === null ? null : Number(item.buy_price))
        : (item.buyPrice === null || item.buyPrice === undefined ? null : Number(item.buyPrice)),
    salePrice:
      item.sale_price !== undefined
        ? (item.sale_price === null ? null : Number(item.sale_price))
        : (item.salePrice === null || item.salePrice === undefined ? null : Number(item.salePrice)),
    thumbnailUrl: item.thumbnail_url || item.thumbnailUrl || "",
    originalName: item.original_name || item.originalName || null,
    filename: item.filename || null,
    size: Number(item.size || 0),
    mimeType: item.mime_type || item.mimeType || null,
    downloadUrl: item.download_url || item.downloadUrl || "",
    published: item.published !== false,
    createdAt: item.created_at || item.createdAt || null,
    updatedAt: item.updated_at || item.updatedAt || null,
  };
}

async function getLocalContent(type) {
  const file = path.join(process.cwd(), "data", "content.json");
  const items = JSON.parse(await fs.readFile(file, "utf8"));

  return items
    .filter((item) => item.published !== false)
    .filter((item) => !type || item.type === type)
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .map(normalize);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    const sql = getSql();

    const items = type
      ? await sql`
          SELECT *
          FROM content_items
          WHERE published = TRUE
            AND type = ${String(type)}
          ORDER BY created_at DESC
        `
      : await sql`
          SELECT *
          FROM content_items
          WHERE published = TRUE
          ORDER BY created_at DESC
        `;

    const content = items.map(normalize);

    return NextResponse.json({
      success: true,
      source: "database",
      count: content.length,
      items: content,
    });
  } catch (error) {
    console.error(
      "CONTENT DATABASE ERROR — USING LOCAL FALLBACK:",
      error.message
    );

    try {
      const content = await getLocalContent(type);

      return NextResponse.json({
        success: true,
        source: "local-fallback",
        count: content.length,
        items: content,
      });
    } catch (fallbackError) {
      console.error(
        "CONTENT LOCAL FALLBACK ERROR:",
        fallbackError.message
      );

      return NextResponse.json(
        {
          success: false,
          error: "Could not load content",
        },
        { status: 500 }
      );
    }
  }
}
