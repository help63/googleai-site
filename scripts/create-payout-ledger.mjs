import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

await sql`
CREATE TABLE IF NOT EXISTS payout_ledger (
  id BIGSERIAL PRIMARY KEY,
  payout_id BIGINT REFERENCES payout_requests(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('earning','payout','refund','adjustment')),
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)
`;

await sql`
CREATE INDEX IF NOT EXISTS payout_ledger_type_idx
ON payout_ledger(type)
`;

await sql`
CREATE INDEX IF NOT EXISTS payout_ledger_created_idx
ON payout_ledger(created_at DESC)
`;

console.log("payout ledger ready");
