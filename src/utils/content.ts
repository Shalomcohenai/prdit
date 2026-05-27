import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");
const blogDir = path.join(contentDir, "blog");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TargetProductCTA = "specifys" | "riftcode" | "greenprd";

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
  targetProductCTA: TargetProductCTA;
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
    return {
      title: data.title as string,
      slug: data.slug as string,
      excerpt: data.excerpt as string,
      date: data.date as string,
      category: data.category as string,
      targetProductCTA: data.targetProductCTA as TargetProductCTA,
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
