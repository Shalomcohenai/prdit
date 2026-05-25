import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeInClient, StaggerClient, StaggerItemClient } from "@/components/home-animations";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on AI-powered development, specification-first workflows, code intelligence, and the future of developer tooling from the prd.it team.",
};

const ctaLabels: Record<string, string> = {
  specifys: "Specifys AI",
  riftcode: "Rift Code",
  mcp: "Visual MCP",
};

export default async function BlogPage() {
  const posts = await db.post.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <FadeInClient>
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              Blog
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Insights & Engineering
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
              Deep dives into specification-first development, AI tooling, and
              the architecture of modern developer workflows.
            </p>
          </div>
        </FadeInClient>

        <StaggerClient className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StaggerItemClient key={post.id}>
              <Link href={`/blog/${post.slug}`}>
                <Card className="group h-full transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {ctaLabels[post.targetProductCta] ?? post.targetProductCta}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-snug text-white group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm leading-relaxed text-neutral-400">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-neutral-500">
                        <Calendar className="h-3 w-3" />
                        {post.publishedAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
                        Read More <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </StaggerItemClient>
          ))}
        </StaggerClient>
      </div>
    </section>
  );
}
