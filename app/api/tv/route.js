import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const file = path.join(process.cwd(), "data", "tv-channels.json");

async function readChannels() {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return [];
  }
}

async function writeChannels(channels) {
  await fs.writeFile(file, JSON.stringify(channels, null, 2));
}

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "authenticated";
}

export async function GET() {
  const channels = await readChannels();

  return NextResponse.json(channels);
}

export async function POST(request) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();

  if (!body.name?.trim() || !body.url?.trim()) {
    return NextResponse.json(
      { error: "Channel name and URL are required." },
      { status: 400 }
    );
  }

  const channels = await readChannels();

  const channel = {
    id: crypto.randomUUID(),
    name: body.name.trim(),
    country: body.country?.trim() || "International",
    region: body.region?.trim() || "World",
    language: body.language?.trim() || "English",
    logo: body.logo?.trim() || "",
    url: body.url.trim(),
    type: "official",
    enabled: body.enabled !== false,
    createdAt: new Date().toISOString()
  };

  channels.push(channel);

  await writeChannels(channels);

  return NextResponse.json(channel, { status: 201 });
}

export async function DELETE(request) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await request.json();

  const channels = await readChannels();

  const updated = channels.filter(
    (channel) => channel.id !== id
  );

  await writeChannels(updated);

  return NextResponse.json({
    success: true
  });
}
