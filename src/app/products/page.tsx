import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  FileText,
  GitBranch,
  Workflow,
  Check,
} from "lucide-react";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  JsonLd,
  generateSoftwareApplicationSchema,
} from "@/utils/seo";
import { FadeInClient, StaggerClient, StaggerItemClient } from "@/components/home-animations";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore prd.it's product ecosystem: Specifys AI for PRD generation, Rift Code for repository intelligence, and the Visual MCP Workflow Engine.",
};

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="h-8 w-8" />,
  GitBranch: <GitBranch className="h-8 w-8" />,
  Workflow: <Workflow className="h-8 w-8" />,
};

export default function ProductsPage() {
  return (
    <>
      {products.map((product) => (
        <JsonLd
          key={product.id}
          data={generateSoftwareApplicationSchema(product)}
        />
      ))}

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <FadeInClient>
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                Product Ecosystem
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Build Better Software,{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Faster
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
                Three specialized products that cover the complete AI-assisted
                development lifecycle - from specification to deployment.
              </p>
            </div>
          </FadeInClient>

          <div className="mt-20 space-y-24">
            {products.map((product, index) => (
              <FadeInClient key={product.id} delay={index * 0.1}>
                <Card className="overflow-hidden border-white/5">
                  <div className="grid md:grid-cols-2">
                    <div className="p-8 md:p-12">
                      <div
                        className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${product.gradient} text-white`}
                      >
                        {iconMap[product.icon]}
                      </div>
                      <Badge variant="secondary" className="mb-3">
                        {product.tagline}
                      </Badge>
                      <h2 className="text-3xl font-bold tracking-tight text-white">
                        {product.name}
                      </h2>
                      <p className="mt-4 leading-relaxed text-neutral-400">
                        {product.description}
                      </p>

                      <div className="mt-8 flex flex-wrap gap-3">
                        {product.url.startsWith("http") ? (
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="gradient" size="lg">
                              {product.ctaLabel}{" "}
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        ) : (
                          <Button variant="gradient" size="lg" disabled>
                            {product.ctaLabel}
                          </Button>
                        )}
                        <Link href={`/compare/${product.id === "specifys" ? "specifys-vs-notion" : product.id === "riftcode" ? "riftcode-vs-github-copilot" : "mcp-vs-langchain"}`}>
                          <Button variant="outline" size="lg">
                            Compare <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="border-t border-white/5 bg-neutral-950/50 p-8 md:border-l md:border-t-0 md:p-12">
                      <div className="mb-8">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
                          Core Features
                        </h3>
                        <ul className="space-y-3">
                          {product.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-3 text-sm text-neutral-300"
                            >
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
                          Tech Specs
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {product.techSpecs.map((spec) => (
                            <Badge
                              key={spec}
                              variant="outline"
                              className="text-xs"
                            >
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </FadeInClient>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
