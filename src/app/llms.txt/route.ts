import { getAllBlogPosts, getActiveJobs } from "@/utils/content";
import { products } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

export function GET() {
  const posts = getAllBlogPosts();
  const jobs = getActiveJobs();

  const lines = [
    "# prd.it",
    "",
    "> AI-powered product engineering company building specification-first developer tools.",
    "",
    "## Company",
    `- Website: ${SITE_URL}`,
    "- HQ: Herzliya, Israel (R&D)",
    "- Office: San Francisco, USA (Growth)",
    "",
    "## Products",
    ...products.map(
      (p) =>
        `- ${p.name}: ${p.tagline}. ${p.url.startsWith("http") ? p.url : SITE_URL + p.url}`
    ),
    "",
    "## Blog Articles",
    ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`),
    "",
    "## Open Positions",
    ...jobs.map((j) => `- ${j.title} (${j.department}) - ${j.location}`),
    "",
    "## Learn More",
    `- Full details: ${SITE_URL}/llms-full.txt`,
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
