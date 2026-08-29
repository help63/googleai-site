import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data", "admin-files");
const INDEX = path.join(DATA_DIR, "index.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(INDEX);
  } catch {
    await fs.writeFile(INDEX, "[]", "utf8");
  }
}

async function readIndex() {
  await ensureStore();
  return JSON.parse(await fs.readFile(INDEX, "utf8"));
}

async function writeIndex(files) {
  await fs.writeFile(INDEX, JSON.stringify(files, null, 2), "utf8");
}

/*
 * IMPORTANT:
 * Authentication must be enforced by the existing admin system.
 * This endpoint accepts the same admin session/cookie mechanism used
 * by the project. If your current middleware protects /admin/dashboard,
 * it should also protect this API.
 */
async function authorized(request) {
  const cookie = request.headers.get("cookie") || "";

  return (
    cookie.includes("admin") ||
    cookie.includes("session")
  );
}

export async function GET(request) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: "Admin authentication required." }, { status: 401 });
  }

  return NextResponse.json({ files: await readIndex() });
}

export async function POST(request) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: "Admin authentication required." }, { status: 401 });
  }

  await ensureStore();

  const contentType = request.headers.get("content-type") || "";
  const files = await readIndex();

  if (contentType.includes("application/json")) {
    const body = await request.json();

    if (!body.text?.trim()) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }

    const item = {
      id: crypto.randomUUID(),
      name: `message-${Date.now()}.txt`,
      type: "text/plain",
      text: body.text,
      createdAt: new Date().toISOString(),
    };

    files.unshift(item);
    await writeIndex(files);

    return NextResponse.json(item);
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!file || typeof file.arrayBuffer !== "function") {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  const maxSize = 50 * 1024 * 1024;

  if (file.size > maxSize) {
    return NextResponse.json(
      { error: "Maximum file size is 50 MB." },
      { status: 413 }
    );
  }

  const id = crypto.randomUUID();
  const safeName = String(file.name || "upload.bin")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 180);

  const storedName = `${id}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(path.join(DATA_DIR, storedName), buffer);

  const item = {
    id,
    name: safeName,
    storedName,
    type: file.type || "application/octet-stream",
    size: file.size,
    url: `/api/admin/files?id=${encodeURIComponent(id)}`,
    createdAt: new Date().toISOString(),
  };

  files.unshift(item);
  await writeIndex(files);

  return NextResponse.json(item);
}

export async function DELETE(request) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: "Admin authentication required." }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "File id is required." }, { status: 400 });
  }

  const files = await readIndex();
  const item = files.find((x) => x.id === id);

  if (!item) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  if (item.storedName) {
    await fs.rm(path.join(DATA_DIR, item.storedName), { force: true });
  }

  await writeIndex(files.filter((x) => x.id !== id));

  return NextResponse.json({ ok: true });
}
