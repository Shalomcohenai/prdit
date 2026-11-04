import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");
const blogDir = path.join(contentDir, "blog");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TargetProductCTA = "specifys" | "riftcode" | "greenprd";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  summary: string;
  tldr?: string;
  date: string;
  updated?: string;
  category: string;
  targetProductCTA: TargetProductCTA;
  faq: FaqItem[];
  related: string[];
  relatedProducts: string[];
  content: string;
}

export interface NewsItem {
  id: number;
  headline: string;
  content: string;
  date: string;
  location: string;
}

export interface JobOpening {
  id: number;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string;
  active: boolean;
}

// ---------------------------------------------------------------------------
// Blog helpers
// ---------------------------------------------------------------------------

export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(blogDir)) return [];

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(blogDir, file), "utf-8");
    const { data, content } = matter(raw);
    const excerpt = asString(data.excerpt);
    return {
      title: asString(data.title),
      slug: asString(data.slug),
      excerpt,
      summary: asString(data.summary) || excerpt,
      tldr: asString(data.tldr) || undefined,
      date: asDateString(data.date),
      updated: asDateString(data.updated) || undefined,
      category: asString(data.category),
      targetProductCTA: asString(data.targetProductCTA) as TargetProductCTA,
      faq: asFaq(data.faq),
      related: asStringList(data.related),
      relatedProducts: asStringList(data.relatedProducts),
      content: content.trim(),
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const posts = getAllBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export function getAllBlogSlugs(): string[] {
  return getAllBlogPosts().map((p) => p.slug);
}

// ---------------------------------------------------------------------------
// News helpers
// ---------------------------------------------------------------------------

export function getAllNews(): NewsItem[] {
  const filePath = path.join(contentDir, "news.json");
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  const items: NewsItem[] = JSON.parse(raw);
  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// ---------------------------------------------------------------------------
// Careers helpers
// ---------------------------------------------------------------------------

export function getAllJobs(): JobOpening[] {
  const filePath = path.join(contentDir, "careers.json");
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as JobOpening[];
}

export function getActiveJobs(): JobOpening[] {
  return getAllJobs().filter((j) => j.active);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asDateString(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return asString(value);
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0
  );
}

function asFaq(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const question = asString((item as { question?: unknown }).question);
    const answer = asString((item as { answer?: unknown }).answer);
    if (!question || !answer) return [];
    return [{ question, answer }];
  });
}
