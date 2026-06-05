import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, X, Minus, ExternalLink } from "lucide-react";
import { comparisons } from "@/lib/comparisons";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeInClient, StaggerClient, StaggerItemClient } from "@/components/home-animations";
import { cn } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const comparison = comparisons.find((c) => c.slug === slug);
  if (!comparison) return { title: "Not Found" };

  return {
    title: comparison.title,
    description: comparison.metaDescription,
    alternates: {
      canonical: `/compare/${slug}`,
    },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const comparison = comparisons.find((c) => c.slug === slug);
  if (!comparison) notFound();

  const product = products.find((p) => p.id === comparison.ourProduct.id);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <FadeInClient>
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              Comparison
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {comparison.headline}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-400">
              {comparison.subheadline}
            </p>
          </div>
        </FadeInClient>

        <FadeInClient delay={0.1}>
          <div className="mt-16 overflow-hidden rounded-xl border border-white/10">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-white/10 bg-neutral-900/50">
              <div className="p-4 text-sm font-semibold text-neutral-400">
                Feature
              </div>
              <div className="border-l border-white/10 p-4 text-center">
                <span className="text-sm font-semibold text-white">
                  {comparison.ourProduct.name}
                </span>
              </div>
              <div className="border-l border-white/10 p-4 text-center">
                <span className="text-sm font-semibold text-neutral-400">
                  {comparison.competitor.name}
                </span>
              </div>
            </div>

            {/* Rows */}
            {comparison.features.map((feature, i) => (
              <div
                key={feature.name}
                className={cn(
                  "grid grid-cols-3",
                  i < comparison.features.length - 1 && "border-b border-white/5"
                )}
              >
                <div className="p-4">
                  <span className="text-sm font-medium text-white">
                    {feature.name}
                  </span>
                </div>
                <div
                  className={cn(
                    "border-l border-white/5 p-4",
                    feature.advantage === "ours" && "bg-green-500/5"
                  )}
                >
                  <div className="flex items-start gap-2">
                    {feature.advantage === "ours" ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    ) : feature.advantage === "tie" ? (
                      <Minus className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-neutral-600" />
                    )}
                    <span className="text-xs text-neutral-300">
                      {feature.ours}
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    "border-l border-white/5 p-4",
                    feature.advantage === "theirs" && "bg-green-500/5"
                  )}
                >
                  <div className="flex items-start gap-2">
                    {feature.advantage === "theirs" ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    ) : feature.advantage === "tie" ? (
                      <Minus className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-neutral-600" />
                    )}
                    <span className="text-xs text-neutral-400">
                      {feature.theirs}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeInClient>

        {/* Verdict */}
        <FadeInClient delay={0.2}>
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="text-xl text-white">The Verdict</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-neutral-400">
                {comparison.verdict}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {comparison.ourProduct.url.startsWith("http") ? (
                  <a
                    href={comparison.ourProduct.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="gradient" size="lg">
                      Try {comparison.ourProduct.name}{" "}
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                ) : (
                  <Link href="/products">
                    <Button variant="gradient" size="lg">
                      Learn More <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link href="/products">
                  <Button variant="outline" size="lg">
                    View All Products
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </FadeInClient>
      </div>
    </section>
  );
}
