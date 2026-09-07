import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";
import { Client } from "pg";
import { promises as dns } from "dns";

async function createDatabaseClient() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_UNPOOLED;

  if (!connectionString) {
    throw new Error("DATABASE_URL is missing");
  }

  const url = new URL(connectionString);
  const addresses = await dns.resolve4(url.hostname);

  if (!addresses.length) {
    throw new Error("No IPv4 address found for database");
  }

  return new Client({
    host: addresses[0],
    port: Number(url.port || 5432),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    ssl: {
      rejectUnauthorized: false,
      servername: url.hostname
    },
    connectionTimeoutMillis: 30000
  });
}

function formatItem(row) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description || "",
    buyPrice:
      row.buy_price === null
        ? null
        : Number(row.buy_price),
    salePrice:
      row.sale_price === null
        ? null
        : Number(row.sale_price),
    thumbnailUrl: row.thumbnail_url || "",
    originalName: row.original_name || null,
    filename: row.filename || null,
    size: Number(row.size || 0),
    mimeType: row.mime_type || null,
    downloadUrl: row.download_url || "",
    published: row.published !== false,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function ensureTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS content_items (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL DEFAULT 'file',
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      buy_price NUMERIC,
      sale_price NUMERIC,
      thumbnail_url TEXT DEFAULT '',
      original_name TEXT,
      filename TEXT,
      size BIGINT DEFAULT 0,
      mime_type TEXT,
      download_url TEXT,
      published BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ
    )
  `);
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  let client;

  try {
    client = await createDatabaseClient();
    await client.connect();
    await ensureTable(client);

    const result = await client.query(
      "SELECT * FROM content_items ORDER BY created_at DESC"
    );

    return NextResponse.json({
      success: true,
      items: result.rows.map(formatItem)
    });
  } catch (error) {
    console.error("CONTENT LIST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load content",
        details: error.message
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.end().catch(() => {});
    }
  }
}

export async function PUT(request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  let client;

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Content ID is required" },
        { status: 400 }
      );
    }

    client = await createDatabaseClient();
    await client.connect();
    await ensureTable(client);

    const existingResult = await client.query(
      "SELECT * FROM content_items WHERE id = $1",
      [body.id]
    );

    if (!existingResult.rowCount) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    const old = existingResult.rows[0];

    const result = await client.query(
      `
        UPDATE content_items
        SET
          title = $1,
          description = $2,
          buy_price = $3,
          sale_price = $4,
          thumbnail_url = $5,
          published = $6,
          updated_at = NOW()
        WHERE id = $7
        RETURNING *
      `,
      [
        body.title !== undefined
          ? String(body.title).trim()
          : old.title,

        body.description !== undefined
          ? String(body.description).trim()
          : old.description,

        body.buyPrice !== undefined
          ? (
              body.buyPrice === "" ||
              body.buyPrice === null
                ? null
                : Number(body.buyPrice)
            )
          : old.buy_price,

        body.salePrice !== undefined
          ? (
              body.salePrice === "" ||
              body.salePrice === null
                ? null
                : Number(body.salePrice)
            )
          : old.sale_price,

        body.thumbnailUrl !== undefined
          ? String(body.thumbnailUrl).trim()
          : old.thumbnail_url,

        typeof body.published === "boolean"
          ? body.published
          : old.published,

        body.id
      ]
    );

    return NextResponse.json({
      success: true,
      item: formatItem(result.rows[0])
    });
  } catch (error) {
    console.error("CONTENT UPDATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Update failed",
        details: error.message
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.end().catch(() => {});
    }
  }
}

export async function DELETE(request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  let client;

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Content ID is required" },
        { status: 400 }
      );
    }

    client = await createDatabaseClient();
    await client.connect();
    await ensureTable(client);

    const result = await client.query(
      "DELETE FROM content_items WHERE id = $1 RETURNING *",
      [body.id]
    );

    if (!result.rowCount) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Content deleted",
      item: formatItem(result.rows[0])
    });
  } catch (error) {
    console.error("CONTENT DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Delete failed",
        details: error.message
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.end().catch(() => {});
    }
  }
}
