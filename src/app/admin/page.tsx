import type { Metadata } from "next";
import { db } from "@/lib/db";
import { isAuthenticated, login, logout } from "./actions";
import { AdminDashboard } from "@/components/admin/dashboard";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAuthenticated();

  if (!authed) {
    return <LoginForm loginAction={login} />;
  }

  const [posts, news, jobs, inquiries] = await Promise.all([
    db.post.findMany({ orderBy: { publishedAt: "desc" } }),
    db.news.findMany({ orderBy: { datePosted: "desc" } }),
    db.job.findMany({ orderBy: { createdAt: "desc" } }),
    db.inquiry.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <AdminDashboard
      posts={JSON.parse(JSON.stringify(posts))}
      news={JSON.parse(JSON.stringify(news))}
      jobs={JSON.parse(JSON.stringify(jobs))}
      inquiries={JSON.parse(JSON.stringify(inquiries))}
      logoutAction={logout}
    />
  );
}
