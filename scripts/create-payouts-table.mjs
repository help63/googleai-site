import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

await sql`
CREATE TABLE IF NOT EXISTS payout_requests (
  id BIGSERIAL PRIMARY KEY,
  method TEXT NOT NULL CHECK (
    method IN ('pakistan_bank','international_bank','binance_p2p')
  ),
  recipient_name TEXT NOT NULL,
  account_reference TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','processing','paid','failed','cancelled')),
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)
`;

await sql`
CREATE INDEX IF NOT EXISTS payout_requests_status_idx
ON payout_requests(status)
`;

await sql`
CREATE INDEX IF NOT EXISTS payout_requests_created_idx
ON payout_requests(created_at DESC)
`;

console.log("payout_requests table ready");
