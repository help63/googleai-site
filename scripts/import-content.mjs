import fs from "fs/promises";
import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_UNPOOLED;

if (!connectionString) {
  throw new Error("DATABASE_URL missing");
}

const sql = neon(connectionString);

const content = JSON.parse(
  await fs.readFile("data/content.json", "utf8")
);

for (const item of content) {
  await sql`
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
      published,
      created_at,
      updated_at
    )
    VALUES (
      ${String(item.id)},
      ${String(item.type || "file")},
      ${String(item.title || "")},
      ${String(item.description || "")},
      ${item.buyPrice ?? null},
      ${item.salePrice ?? null},
      ${String(item.thumbnailUrl || "")},
      ${item.originalName ?? null},
      ${item.filename ?? null},
      ${Number(item.size || 0)},
      ${item.mimeType ?? null},
      ${item.downloadUrl ?? null},
      ${item.published !== false},
      ${item.createdAt || new Date().toISOString()},
      ${item.updatedAt ?? null}
    )
    ON CONFLICT (id)
    DO UPDATE SET
      type = EXCLUDED.type,
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      buy_price = EXCLUDED.buy_price,
      sale_price = EXCLUDED.sale_price,
      thumbnail_url = EXCLUDED.thumbnail_url,
      original_name = EXCLUDED.original_name,
      filename = EXCLUDED.filename,
      size = EXCLUDED.size,
      mime_type = EXCLUDED.mime_type,
      download_url = EXCLUDED.download_url,
      published = EXCLUDED.published,
      updated_at = EXCLUDED.updated_at
  `;
}

console.log(`✅ Imported ${content.length} content items`);
