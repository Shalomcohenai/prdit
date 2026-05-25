"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const COOKIE_NAME = "admin_session";
const COOKIE_VALUE = "authenticated";

export async function login(formData: FormData) {
  const password = formData.get("password") as string;
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    redirect("/admin");
  }
  return { error: "Invalid password" };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin");
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}

// --- Posts ---

export async function createPost(formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin");

  await db.post.create({
    data: {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      category: (formData.get("category") as string) || "general",
      targetProductCta: (formData.get("targetProductCta") as string) || "specifys",
    },
  });

  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin");
}

export async function updatePost(formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin");

  const id = parseInt(formData.get("id") as string);
  await db.post.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      category: (formData.get("category") as string) || "general",
      targetProductCta: (formData.get("targetProductCta") as string) || "specifys",
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${formData.get("slug")}`);
  revalidatePath("/");
  redirect("/admin");
}

export async function deletePost(formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin");

  const id = parseInt(formData.get("id") as string);
  const post = await db.post.findUnique({ where: { id } });
  await db.post.delete({ where: { id } });

  revalidatePath("/blog");
  if (post) revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/");
  redirect("/admin");
}

// --- News ---

export async function createNews(formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin");

  await db.news.create({
    data: {
      headline: formData.get("headline") as string,
      content: formData.get("content") as string,
      location: (formData.get("location") as string) || "Herzliya",
    },
  });

  revalidatePath("/");
  redirect("/admin");
}

export async function updateNews(formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin");

  const id = parseInt(formData.get("id") as string);
  await db.news.update({
    where: { id },
    data: {
      headline: formData.get("headline") as string,
      content: formData.get("content") as string,
      location: (formData.get("location") as string) || "Herzliya",
    },
  });

  revalidatePath("/");
  redirect("/admin");
}

export async function deleteNews(formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin");

  const id = parseInt(formData.get("id") as string);
  await db.news.delete({ where: { id } });

  revalidatePath("/");
  redirect("/admin");
}

// --- Jobs ---

export async function createJob(formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin");

  await db.job.create({
    data: {
      title: formData.get("title") as string,
      department: formData.get("department") as string,
      location: (formData.get("location") as string) || "Herzliya",
      description: formData.get("description") as string,
      requirements: formData.get("requirements") as string,
    },
  });

  revalidatePath("/careers");
  redirect("/admin");
}

export async function updateJob(formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin");

  const id = parseInt(formData.get("id") as string);
  await db.job.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      department: formData.get("department") as string,
      location: (formData.get("location") as string) || "Herzliya",
      description: formData.get("description") as string,
      requirements: formData.get("requirements") as string,
      active: formData.get("active") === "true",
    },
  });

  revalidatePath("/careers");
  redirect("/admin");
}

export async function deleteJob(formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin");

  const id = parseInt(formData.get("id") as string);
  await db.job.delete({ where: { id } });

  revalidatePath("/careers");
  redirect("/admin");
}

// --- Inquiries ---

export async function submitInquiry(formData: FormData) {
  await db.inquiry.create({
    data: {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
      type: (formData.get("type") as string) || "general",
      jobTitle: (formData.get("jobTitle") as string) || null,
      resume: (formData.get("resume") as string) || null,
    },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function markInquiryRead(formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin");

  const id = parseInt(formData.get("id") as string);
  await db.inquiry.update({
    where: { id },
    data: { read: true },
  });

  revalidatePath("/admin");
}

export async function deleteInquiry(formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin");

  const id = parseInt(formData.get("id") as string);
  await db.inquiry.delete({ where: { id } });

  revalidatePath("/admin");
  redirect("/admin");
}

// --- Analytics ---

export type AnalyticsPeriod = "day" | "week" | "month";

export interface SectionStats {
  section: string;
  count: number;
}

export interface TimeSeriesPoint {
  label: string;
  count: number;
}

export interface TopPage {
  path: string;
  section: string;
  slug: string | null;
  count: number;
}

export interface AnalyticsData {
  totalViews: number;
  sectionBreakdown: SectionStats[];
  timeSeries: TimeSeriesPoint[];
  topPages: TopPage[];
  period: AnalyticsPeriod;
}

function getDateRange(period: AnalyticsPeriod): Date {
  const now = new Date();
  switch (period) {
    case "day":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "week":
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 6);
      weekStart.setHours(0, 0, 0, 0);
      return weekStart;
    case "month":
      return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}

function buildTimeSeries(
  views: { createdAt: Date }[],
  period: AnalyticsPeriod
): TimeSeriesPoint[] {
  const buckets = new Map<string, number>();

  if (period === "day") {
    for (let h = 0; h < 24; h++) {
      buckets.set(`${h.toString().padStart(2, "0")}:00`, 0);
    }
    for (const v of views) {
      const hour = `${v.createdAt.getHours().toString().padStart(2, "0")}:00`;
      buckets.set(hour, (buckets.get(hour) || 0) + 1);
    }
  } else if (period === "week") {
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const label = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      buckets.set(label, 0);
    }
    for (const v of views) {
      const label = `${v.createdAt.getDate().toString().padStart(2, "0")}/${(v.createdAt.getMonth() + 1).toString().padStart(2, "0")}`;
      if (buckets.has(label)) {
        buckets.set(label, (buckets.get(label) || 0) + 1);
      }
    }
  } else {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const label = `${d.toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}`;
      buckets.set(label, 0);
    }
    for (const v of views) {
      const label = `${v.createdAt.getDate().toString().padStart(2, "0")}/${(v.createdAt.getMonth() + 1).toString().padStart(2, "0")}`;
      if (buckets.has(label)) {
        buckets.set(label, (buckets.get(label) || 0) + 1);
      }
    }
  }

  return Array.from(buckets.entries()).map(([label, count]) => ({ label, count }));
}

export async function getAnalytics(period: AnalyticsPeriod): Promise<AnalyticsData> {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin");

  const since = getDateRange(period);

  const views = await db.pageView.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
  });

  const totalViews = views.length;

  const sectionMap = new Map<string, number>();
  for (const v of views) {
    sectionMap.set(v.section, (sectionMap.get(v.section) || 0) + 1);
  }
  const sectionBreakdown = Array.from(sectionMap.entries())
    .map(([section, count]) => ({ section, count }))
    .sort((a, b) => b.count - a.count);

  const pathMap = new Map<string, { section: string; slug: string | null; count: number }>();
  for (const v of views) {
    const existing = pathMap.get(v.path);
    if (existing) {
      existing.count++;
    } else {
      pathMap.set(v.path, { section: v.section, slug: v.slug, count: 1 });
    }
  }
  const topPages = Array.from(pathMap.entries())
    .map(([path, data]) => ({ path, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const timeSeries = buildTimeSeries(views, period);

  return { totalViews, sectionBreakdown, timeSeries, topPages, period };
}
