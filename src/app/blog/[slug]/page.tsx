import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, ExternalLink, Tag } from "lucide-react";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/utils/content";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonLd, generateArticleSchema } from "@/utils/seo";
import { MarkdownRenderer } from "@/components/markdown-renderer";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const ctaProduct = products.find((p) => p.id === post.targetProductCTA);

  const articleData = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    publishedAt: new Date(post.date),
    content: post.content,
  };

  return (
    <>
      <JsonLd data={generateArticleSchema(articleData)} />

      <div className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <article className="min-w-0">
              <header className="mb-12">
                <Link href="/blog">
                  <Button variant="ghost" size="sm" className="mb-6 -ml-3 text-neutral-400">
                    <ArrowLeft className="h-3 w-3" /> Back to Blog
                  </Button>
                </Link>

                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="flex items-center gap-1 text-xs text-neutral-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {post.title}
                </h1>
                <p className="mt-4 text-lg text-neutral-400">{post.excerpt}</p>
              </header>

              <MarkdownRenderer content={post.content} />
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {ctaProduct && (
                  <Card className="border-white/10">
                    <CardHeader>
                      <CardTitle className="text-base text-white">
                        {ctaProduct.name}
                      </CardTitle>
                      <p className="text-sm text-neutral-400">
                        {ctaProduct.tagline}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-sm text-neutral-400">
                        {ctaProduct.description.slice(0, 120)}...
                      </p>
                      {ctaProduct.url.startsWith("http") ? (
                        <a
                          href={ctaProduct.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="gradient" size="sm" className="w-full">
                            {ctaProduct.ctaLabel}{" "}
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>
                      ) : (
                        <Button variant="gradient" size="sm" className="w-full" disabled>
                          {ctaProduct.ctaLabel}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-neutral-400">
                      <Tag className="mr-1 inline h-3 w-3" />
                      Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        AI Development
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Developer Tools
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
