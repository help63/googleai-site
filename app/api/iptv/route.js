import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFile = path.join(
  process.cwd(),
  "data",
  "iptv.json"
);

export async function GET() {
  try {
    let channels = [];

    try {
      channels = JSON.parse(
        await fs.readFile(dataFile, "utf8")
      );
    } catch {
      channels = [];
    }

    const enabledChannels = channels.filter(
      (channel) => channel.enabled !== false
    );

    return NextResponse.json({
      success: true,
      count: enabledChannels.length,
      channels: enabledChannels,
    });
  } catch (error) {
    console.error("PUBLIC IPTV ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Could not load IPTV channels",
      },
      { status: 500 }
    );
  }
}
