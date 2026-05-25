import { db } from "@/lib/db";
import { products } from "@/lib/products";

export async function GET() {
  const posts = await db.post.findMany({
    select: { title: true, slug: true, excerpt: true },
    orderBy: { publishedAt: "desc" },
  }).catch(() => [] as { title: string; slug: string; excerpt: string }[]);

  const jobs = await db.job.findMany({
    where: { active: true },
    select: { title: true, department: true, location: true },
  }).catch(() => [] as { title: string; department: string; location: string }[]);

  const lines = [
    "# prd.it",
    "",
    "> AI-powered product engineering company building specification-first developer tools.",
    "",
    "## Company",
    "- Website: https://prd.it",
    "- HQ: Herzliya, Israel (R&D)",
    "- Office: San Francisco, USA (Growth)",
    "",
    "## Products",
    ...products.map(
      (p) =>
        `- ${p.name}: ${p.tagline}. ${p.url.startsWith("http") ? p.url : "https://prd.it" + p.url}`
    ),
    "",
    "## Blog Articles",
    ...posts.map((p) => `- [${p.title}](https://prd.it/blog/${p.slug}): ${p.excerpt}`),
    "",
    "## Open Positions",
    ...jobs.map((j) => `- ${j.title} (${j.department}) — ${j.location}`),
    "",
    "## Learn More",
    "- Full details: https://prd.it/llms-full.txt",
    "- Sitemap: https://prd.it/sitemap.xml",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
