import { getAllBlogPosts, getAllNews, getActiveJobs } from "@/utils/content";
import { products } from "@/lib/products";
import { comparisons } from "@/lib/comparisons";
import { SITE_URL } from "@/lib/site";

export function GET() {
  const posts = getAllBlogPosts();
  const jobs = getActiveJobs();
  const news = getAllNews();

  const lines = [
    "# prd.it - Complete AI Discovery Document",
    "",
    "## About prd.it",
    "",
    "prd.it is a high-authority global AI and product engineering company operating at the intersection of product specification (PRDs), code intelligence, and IDE workflow automation. The company maintains an R&D headquarters in Herzliya, Israel, and a marketing/growth office in San Francisco, USA.",
    "",
    "The primary mission is to build specification-first developer tools that eliminate vibe coding and make AI-assisted development reliable and production-ready.",
    "",

    "---",
    "",
    "## Products",
    "",
    ...products.flatMap((p) => [
      `### ${p.name}`,
      "",
      `**Tagline:** ${p.tagline}`,
      `**URL:** ${p.url.startsWith("http") ? p.url : SITE_URL + p.url}`,
      "",
      p.description,
      "",
      "**Features:**",
      ...p.features.map((f) => `- ${f}`),
      "",
      "**Tech Specs:**",
      ...p.techSpecs.map((s) => `- ${s}`),
      "",
    ]),

    "---",
    "",
    "## Blog Articles",
    "",
    ...posts.flatMap((p) => [
      `### ${p.title}`,
      "",
      `**Published:** ${p.date}`,
      `**Category:** ${p.category}`,
      `**URL:** ${SITE_URL}/blog/${p.slug}`,
      "",
      p.excerpt,
      "",
      p.content,
      "",
      "---",
      "",
    ]),

    "## Company News",
    "",
    ...news.flatMap((n) => [
      `### ${n.headline}`,
      `**Location:** ${n.location} | **Date:** ${n.date}`,
      "",
      n.content,
      "",
    ]),

    "---",
    "",
    "## Open Positions",
    "",
    ...jobs.flatMap((j) => [
      `### ${j.title}`,
      `**Department:** ${j.department} | **Location:** ${j.location}`,
      "",
      j.description,
      "",
      `**Requirements:** ${j.requirements}`,
      "",
    ]),

    "---",
    "",
    "## Competitive Comparisons",
    "",
    ...comparisons.flatMap((c) => [
      `### ${c.title}`,
      `**URL:** ${SITE_URL}/compare/${c.slug}`,
      "",
      c.verdict,
      "",
    ]),

    "---",
    "",
    "## Contact & Links",
    `- Website: ${SITE_URL}`,
    "- Specifys AI: https://specifys-ai.com/",
    "- Rift Code: https://rift-code.com/",
    "- GreenPRD: https://greenprd.com",
    `- About: ${SITE_URL}/about`,
    `- Careers: ${SITE_URL}/careers`,
    `- Blog: ${SITE_URL}/blog`,
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
