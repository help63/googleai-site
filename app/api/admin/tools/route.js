import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";

async function authorized() {
  return await isAdminAuthenticated();
}

export async function GET() {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    message: "Admin Toolbox API ready",
    tools: [
      {
        id: "ai-tools",
        title: "AI Tools",
        icon: "🤖",
        description: "AI utilities",
        link: "/#features",
        type: "tool"
      },
      {
        id: "ai-images",
        title: "AI Images",
        icon: "🎨",
        description: "Create images",
        link: "/#studio",
        type: "tool"
      },
      {
        id: "shopping",
        title: "Shopping",
        icon: "🛒",
        description: "Products & deals",
        link: "/shopping",
        type: "menu"
      },
      {
        id: "news",
        title: "Latest News",
        icon: "📰",
        description: "Latest updates",
        link: "/category/Latest",
        type: "menu"
      },
      {
        id: "live-tv",
        title: "Live TV",
        icon: "📺",
        description: "Watch live",
        link: "/tv",
        type: "menu"
      }
    ]
  });
}

export async function POST(request) {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.title || !body.link) {
      return NextResponse.json(
        { error: "Title and link are required." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Tool validated. Persistent database storage can be connected next.",
      item: body
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
