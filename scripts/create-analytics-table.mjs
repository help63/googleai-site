import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGSERIAL PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Unknown',
    page TEXT NOT NULL DEFAULT '/',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

console.log("analytics_events table ready");
