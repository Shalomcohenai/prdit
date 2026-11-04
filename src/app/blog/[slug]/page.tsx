import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, ExternalLink, Tag } from "lucide-react";
import { getAllBlogSlugs, getBlogPostBySlug, type BlogPost } from "@/utils/content";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  JsonLd,
  generateBlogPostingSchema,
  generateBreadcrumbSchema,
  generateFaqSchema,
} from "@/utils/seo";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { absoluteUrl, SITE_URL } from "@/lib/site";

type Params = Promise<{ slug: string }>;

function formatDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

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

  const canonical = absoluteUrl(`/blog/${post.slug}`);
  const modified = post.updated ?? post.date;

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: "prd.it", url: SITE_URL }],
    alternates: {
      canonical,
    },
    openGraph: {
      url: canonical,
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      modifiedTime: modified,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
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

  const canonical = absoluteUrl(`/blog/${post.slug}`);
  const modified = post.updated ?? post.date;
  const related = post.related
    .map((relatedSlug) => getBlogPostBySlug(relatedSlug))
    .filter((item): item is BlogPost => item !== null);
  const linkedProducts = post.relatedProducts.flatMap((id) => {
    const product = products.find((item) => item.id === id);
    return product ? [product] : [];
  });
  const ctaProduct = products.find((item) => item.id === post.targetProductCTA);

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: absoluteUrl("/blog") },
    { name: post.title, url: canonical },
  ];

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbItems)} />
      <JsonLd
        data={generateBlogPostingSchema({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          datePublished: post.date,
          dateModified: modified,
          image: absoluteUrl(`/blog/${post.slug}/opengraph-image`),
        })}
      />
      {post.faq.length > 0 ? <JsonLd data={generateFaqSchema(post.faq)} /> : null}

      <div className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <article className="min-w-0">
              <header className="mb-12">
                <nav aria-label="Breadcrumb" className="mb-6">
                  <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
                    <li>
                      <Link href="/" className="hover:text-white">
                        Home
                      </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li>
                      <Link href="/blog" className="hover:text-white">
                        Blog
                      </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li className="text-neutral-300" aria-current="page">
                      {post.title}
                    </li>
                  </ol>
                </nav>

                <Link href="/blog">
                  <Button variant="ghost" size="sm" className="mb-6 -ml-3 text-neutral-400">
                    <ArrowLeft className="h-3 w-3" /> Back to Blog
                  </Button>
                </Link>

                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-xs text-neutral-500">By prd.it</span>
                  <span className="flex items-center gap-1 text-xs text-neutral-500">
                    <Calendar className="h-3 w-3" />
                    <time dateTime={post.date}>Published {formatDate(post.date)}</time>
                  </span>
                  {post.updated && post.updated !== post.date ? (
                    <span className="text-xs text-neutral-500">
                      <time dateTime={post.updated}>Updated {formatDate(post.updated)}</time>
                    </span>
                  ) : null}
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {post.title}
                </h1>
                <p className="mt-4 text-lg text-neutral-400">{post.excerpt}</p>
              </header>

              {post.tldr ? (
                <section
                  aria-label="TL;DR"
                  className="mb-10 rounded-xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">
                    TL;DR
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-neutral-200">
                    {post.tldr}
                  </p>
                </section>
              ) : null}

              <MarkdownRenderer content={post.content} />

              {post.faq.length > 0 ? (
                <section aria-labelledby="faq-heading" className="mt-12">
                  <h2
                    id="faq-heading"
                    className="text-2xl font-semibold tracking-tight text-white"
                  >
                    Frequently asked questions
                  </h2>
                  <div className="mt-6 space-y-8">
                    {post.faq.map((item) => (
                      <div key={item.question}>
                        <h3 className="text-lg font-medium text-white">{item.question}</h3>
                        <p className="mt-2 leading-relaxed text-neutral-400">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {related.length > 0 ? (
                <section aria-labelledby="related-heading" className="mt-12">
                  <h2
                    id="related-heading"
                    className="text-2xl font-semibold tracking-tight text-white"
                  >
                    Related reading
                  </h2>
                  <ul className="mt-4 list-disc space-y-3 pl-5 text-neutral-300">
                    {related.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/blog/${item.slug}`}
                          className="text-indigo-300 underline underline-offset-2"
                        >
                          {item.title}
                        </Link>
                        <span className="text-neutral-400">. {item.summary}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section aria-labelledby="products-heading" className="mt-12">
                <h2
                  id="products-heading"
                  className="text-2xl font-semibold tracking-tight text-white"
                >
                  Products in this loop
                </h2>
                <p className="mt-4 leading-relaxed text-neutral-400">
                  <Link
                    href="/products"
                    className="text-indigo-300 underline underline-offset-2"
                  >
                    The prd.it product overview
                  </Link>{" "}
                  shows how specification, repository intelligence, live spec workspaces,
                  and ad creative share one product context.
                </p>
                {linkedProducts.length > 0 ? (
                  <ul className="mt-4 list-disc space-y-3 pl-5 text-neutral-300">
                    {linkedProducts.map((product) => (
                      <li key={product.id}>
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-300 underline underline-offset-2"
                        >
                          {product.name}
                        </a>
                        <span className="text-neutral-400">. {product.tagline}.</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
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
