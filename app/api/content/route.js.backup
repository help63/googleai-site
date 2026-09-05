import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const dataFile = path.join(
      process.cwd(),
      "data",
      "content.json"
    );

    let content = [];

    try {
      content = JSON.parse(
        await fs.readFile(dataFile, "utf8")
      );
    } catch {
      content = [];
    }

    // Only published content is visible publicly.
    content = content.filter(
      (item) => item.published !== false
    );

    if (type) {
      content = content.filter(
        (item) => item.type === type
      );
    }

    return NextResponse.json({
      success: true,
      count: content.length,
      items: content,
    });
  } catch (error) {
    console.error("CONTENT API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Could not load content",
      },
      { status: 500 }
    );
  }
}
