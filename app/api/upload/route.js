import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");
    const menu = formData.get("menu") || "Home";

    if (!files.length) {
      return NextResponse.json(
        { success: false, error: "No file selected" },
        { status: 400 }
      );
    }

    const safeMenu = String(menu).replace(/[^a-zA-Z0-9-_]/g, "_");

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      safeMenu
    );

    await fs.mkdir(uploadDir, { recursive: true });

    const uploaded = [];

    for (const file of files) {
      if (!file || typeof file.arrayBuffer !== "function") continue;

      const ext = path.extname(file.name || "");
      const filename =
        `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      await fs.writeFile(
        path.join(uploadDir, filename),
        buffer
      );

      uploaded.push({
        originalName: file.name,
        filename,
        type: file.type,
        size: file.size,
        menu,
        url: `/uploads/${safeMenu}/${filename}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Files uploaded successfully",
      menu,
      files: uploaded,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Upload failed",
      },
      { status: 500 }
    );
  }
}
