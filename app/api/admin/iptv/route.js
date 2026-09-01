import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const dataFile = path.join(process.cwd(), "data", "iptv.json");

async function authorized() {
  return await isAdminAuthenticated();
}

async function readChannels() {
  try {
    return JSON.parse(await fs.readFile(dataFile, "utf8"));
  } catch {
    return [];
  }
}

async function saveChannels(channels) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(
    dataFile,
    JSON.stringify(channels, null, 2)
  );
}

export async function GET() {
  return NextResponse.json({
    success: true,
    channels: await readChannels(),
  });
}

export async function POST(request) {
  if (!(await authorized())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const logo = String(body.logo || "").trim();
    const streamUrl = String(body.streamUrl || "").trim();

    if (!name || !streamUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Channel name and stream URL are required.",
        },
        { status: 400 }
      );
    }

    const channels = await readChannels();

    const channel = {
      id: crypto.randomUUID(),
      name,
      logo,
      streamUrl,
      category: String(body.category || "General").trim() || "General",
      enabled: body.enabled !== false,
      createdAt: new Date().toISOString(),
    };

    channels.unshift(channel);
    await saveChannels(channels);

    return NextResponse.json({
      success: true,
      channel,
      channels,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Could not save channel." },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  if (!(await authorized())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const channels = await readChannels();

    const index = channels.findIndex(
      (channel) => channel.id === body.id
    );

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Channel not found." },
        { status: 404 }
      );
    }

    channels[index] = {
      ...channels[index],
      name: String(body.name ?? channels[index].name).trim(),
      logo: String(body.logo ?? channels[index].logo).trim(),
      streamUrl: String(
        body.streamUrl ?? channels[index].streamUrl
      ).trim(),
      category: String(
        body.category ?? channels[index].category ?? "General"
      ).trim() || "General",
      enabled:
        typeof body.enabled === "boolean"
          ? body.enabled
          : channels[index].enabled,
    };

    await saveChannels(channels);

    return NextResponse.json({
      success: true,
      channel: channels[index],
      channels,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Update failed." },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  if (!(await authorized())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await request.json();

    const channels = await readChannels();

    const updated = channels.filter(
      (channel) => channel.id !== id
    );

    await saveChannels(updated);

    return NextResponse.json({
      success: true,
      channels: updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Delete failed." },
      { status: 400 }
    );
  }
}
