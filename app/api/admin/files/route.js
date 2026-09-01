import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";

async function authorized() {
  return await isAdminAuthenticated();
}

export async function GET() {
  if (!(await authorized())) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Admin login required." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    message:
      "File Manager API ready. Configure R2 storage before enabling uploads.",
    files: [],
  });
}

export async function POST() {
  if (!(await authorized())) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Admin login required." },
      { status: 401 }
    );
  }

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
  if (!(await authorized())) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Admin login required." },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { ok: false, error: "Storage is not configured yet." },
    { status: 503 }
  );
}
