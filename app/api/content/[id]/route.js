import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

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
      item.buy_price === null
        ? null
        : Number(item.buy_price),
    salePrice:
      item.sale_price === null
        ? null
        : Number(item.sale_price),
    thumbnailUrl: item.thumbnail_url || "",
    downloadUrl: item.download_url || "",
    published: item.published !== false,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const sql = getSql();

    const rows = await sql`
      SELECT *
      FROM content_items
      WHERE id = ${String(id)}
        AND published = TRUE
      LIMIT 1
    `;

    if (!rows.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      item: normalize(rows[0]),
    });
  } catch (error) {
    console.error("CONTENT DETAIL API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Could not load product",
      },
      { status: 500 }
    );
  }
}
