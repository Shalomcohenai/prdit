import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function classifySection(path: string): { section: string; slug: string | null } {
  if (path === "/") return { section: "home", slug: null };
  if (path === "/products") return { section: "products", slug: null };
  if (path === "/careers") return { section: "careers", slug: null };
  if (path === "/blog") return { section: "blog-index", slug: null };

  const blogMatch = path.match(/^\/blog\/(.+)$/);
  if (blogMatch) return { section: "blog", slug: blogMatch[1] };

  const compareMatch = path.match(/^\/compare\/(.+)$/);
  if (compareMatch) return { section: "compare", slug: compareMatch[1] };

  return { section: "other", slug: null };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, referrer } = body;

    if (!path || typeof path !== "string") {
      return NextResponse.json({ error: "Missing path" }, { status: 400 });
    }

    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ok: true });
    }

    const { section, slug } = classifySection(path);
    const userAgent = request.headers.get("user-agent") || null;

    await db.pageView.create({
      data: {
        path,
        section,
        slug,
        referrer: referrer || null,
        userAgent,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
