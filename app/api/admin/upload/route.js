import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";
import { put } from "@vercel/blob";
import { Client } from "pg";
import { promises as dns } from "dns";
import crypto from "crypto";

export const runtime = "nodejs";

const TYPES = {
  game: "games",
  movie: "movies",
  apk: "apk",
  file: "files",
  article: "articles",
  garment: "garments"
};

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

export async function POST(request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized. Admin login required."
      },
      { status: 401 }
    );
  }

  let client;

  try {
    const formData = await request.formData();

    const type = String(
      formData.get("type") || "file"
    ).toLowerCase();

    const title = String(
      formData.get("title") || ""
    ).trim();

    const description = String(
      formData.get("description") || ""
    ).trim();

    const buyPrice = String(
      formData.get("buyPrice") || ""
    ).trim();

    const salePrice = String(
      formData.get("salePrice") || ""
    ).trim();

    const thumbnailUrl = String(
      formData.get("thumbnailUrl") || ""
    ).trim();

    const file = formData.get("file");

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error: "Title is required"
        },
        { status: 400 }
      );
    }

    if (
      type !== "article" &&
      (!file || typeof file.arrayBuffer !== "function")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "File is required"
        },
        { status: 400 }
      );
    }

    const folder = TYPES[type] || TYPES.file;

    const safeTitle =
      title
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 80) || "download";

    let blobUrl = "";
    let filename = null;
    let originalName = null;
    let size = 0;
    let mimeType = null;

    if (
      file &&
      typeof file.arrayBuffer === "function"
    ) {
      originalName = file.name;
      size = file.size;
      mimeType = file.type || null;

      const ext =
        originalName && originalName.includes(".")
          ? originalName.slice(
              originalName.lastIndexOf(".")
            )
          : "";

      filename =
        `${safeTitle}-${Date.now()}-${crypto
          .randomBytes(5)
          .toString("hex")}${ext}`;

      const blob = await put(
        `uploads/${folder}/${filename}`,
        file,
        {
          access: "public",
          addRandomSuffix: false
        }
      );

      blobUrl = blob.url;
    }

    const item = {
      id: crypto.randomUUID(),
      type,
      title,
      description,
      buyPrice:
        buyPrice === ""
          ? null
          : Number(buyPrice),
      salePrice:
        salePrice === ""
          ? null
          : Number(salePrice),
      thumbnailUrl,
      originalName,
      filename,
      size,
      mimeType,
      downloadUrl: blobUrl,
      published: true
    };

    client = await createDatabaseClient();
    await client.connect();

    await ensureTable(client);

    const result = await client.query(
      `
        INSERT INTO content_items (
          id,
          type,
          title,
          description,
          buy_price,
          sale_price,
          thumbnail_url,
          original_name,
          filename,
          size,
          mime_type,
          download_url,
          published
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,
          $8,$9,$10,$11,$12,$13
        )
        RETURNING *
      `,
      [
        item.id,
        item.type,
        item.title,
        item.description,
        item.buyPrice,
        item.salePrice,
        item.thumbnailUrl,
        item.originalName,
        item.filename,
        item.size,
        item.mimeType,
        item.downloadUrl,
        item.published
      ]
    );

    const saved = result.rows[0];

    return NextResponse.json({
      success: true,
      message: "Content uploaded successfully",
      item: {
        id: saved.id,
        type: saved.type,
        title: saved.title,
        description: saved.description || "",
        buyPrice:
          saved.buy_price === null
            ? null
            : Number(saved.buy_price),
        salePrice:
          saved.sale_price === null
            ? null
            : Number(saved.sale_price),
        thumbnailUrl: saved.thumbnail_url || "",
        originalName: saved.original_name || null,
        filename: saved.filename || null,
        size: Number(saved.size || 0),
        mimeType: saved.mime_type || null,
        downloadUrl: saved.download_url || "",
        published: saved.published !== false,
        createdAt: saved.created_at
      }
    });
  } catch (error) {
    console.error("ADMIN UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Upload failed",
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
