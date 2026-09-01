import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";
import fs from "fs/promises";
import path from "path";

const file = path.join(process.cwd(), "data", "site-settings.json");

async function adminOK() {
  return await isAdminAuthenticated();
}

async function readData() {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return {
      logo: { url: "", title: "GoogleAi" },
      links: [],
      videos: [],
      sidebar: [],
      follow: {
        email: "",
        facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
        whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || ""
      }
    };
  }
}

export async function GET() {
  if (!(await adminOK())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await readData());
}

export async function POST(request) {
  if (!(await adminOK())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const data = {
      logo: body.logo || { url: "", title: "GoogleAi" },
      links: Array.isArray(body.links) ? body.links : [],
      videos: Array.isArray(body.videos) ? body.videos : [],
      sidebar: Array.isArray(body.sidebar) ? body.sidebar : [],
      follow: body.follow || {
        email: "",
        facebook: "",
        whatsapp: ""
      }
    };

    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(data, null, 2));

    return NextResponse.json({
      ok: true,
      message: "Website settings saved"
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Save failed" },
      { status: 400 }
    );
  }
}
