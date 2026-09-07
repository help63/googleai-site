import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_UNPOOLED;

if (!connectionString) {
  throw new Error("DATABASE_URL missing");
}

const sql = neon(connectionString);

await sql`
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
`;

console.log("✅ content_items table created successfully");
