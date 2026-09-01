import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS earnings (
    id BIGSERIAL PRIMARY KEY,
    source TEXT NOT NULL DEFAULT 'manual',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
    impressions INTEGER NOT NULL DEFAULT 0,
    clicks INTEGER NOT NULL DEFAULT 0,
    country TEXT NOT NULL DEFAULT 'Unknown',
    page TEXT NOT NULL DEFAULT '/',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

await sql`
  CREATE INDEX IF NOT EXISTS earnings_date_idx
  ON earnings(date)
`;

console.log("earnings table ready");
