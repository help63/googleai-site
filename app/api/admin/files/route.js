import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "File Manager API ready. Configure R2 storage before enabling uploads.",
    files: [],
  });
}

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "Storage is not configured yet.",
      message:
        "Configure Cloudflare R2/S3-compatible storage before uploading files.",
    },
    { status: 503 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { ok: false, error: "Storage is not configured yet." },
    { status: 503 }
  );
}
