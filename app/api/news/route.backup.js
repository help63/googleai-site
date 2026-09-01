const ADMIN_PASSWORD = process.env.FawadAhmadSonCode2050;
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const file = path.join(process.cwd(), "data", "news.json");

export async function GET() {
  try {
    const data = JSON.parse(await fs.readFile(file, "utf8"));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    let news = [];

    try {
      news = JSON.parse(await fs.readFile(file, "utf8"));
    } catch {}

    news.unshift(body);

    await fs.writeFile(
      file,
      JSON.stringify(news, null, 2)
    );

    return NextResponse.json({
      success: true,
      news: body,
    });

  } catch (error) {
    return NextResponse.json(
      { success:false, error:String(error) },
      { status:500 }
    );
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();

    let news = JSON.parse(await fs.readFile(file, "utf8"));

    news = news.map((item) =>
      item.slug === body.slug ? body : item
    );

    await fs.writeFile(
      file,
      JSON.stringify(news, null, 2)
    );

    return NextResponse.json({success:true});

  } catch {
    return NextResponse.json(
      {success:false},
      {status:500}
    );
  }
}

