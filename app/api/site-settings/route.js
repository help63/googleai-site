import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const file = path.join(process.cwd(), "data", "site-settings.json");

export async function GET() {
  try {
    const data = JSON.parse(await fs.readFile(file, "utf8"));

    return NextResponse.json({
      logo: data.logo || { url: "", title: "GoogleAi" },
      links: Array.isArray(data.links) ? data.links : [],
      videos: Array.isArray(data.videos) ? data.videos : [],
      sidebar: Array.isArray(data.sidebar) ? data.sidebar : [],
      follow: data.follow || {
        email: "",
        facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
        whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || ""
      }
    });
  } catch {
    return NextResponse.json({
      logo: { url: "", title: "GoogleAi" },
      links: [],
      videos: [],
      sidebar: [],
      follow: {
        email: "",
        facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
        whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || ""
      }
    });
  }
}
