import Link from "next/link";
import { ArrowRight, FileText, GitBranch, Workflow, MapPin, Building2 } from "lucide-react";
import { db } from "@/lib/db";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JsonLd, generateOrganizationSchema } from "@/utils/seo";
import { HeroSection } from "@/components/hero";
import { FadeInClient, StaggerClient, StaggerItemClient } from "@/components/home-animations";

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="h-6 w-6" />,
  GitBranch: <GitBranch className="h-6 w-6" />,
  Workflow: <Workflow className="h-6 w-6" />,
};

export default async function HomePage() {
  const news = await db.news.findMany({
    orderBy: { datePosted: "desc" },
    take: 3,
  });

  return (
    <>
      <JsonLd data={generateOrganizationSchema()} />

      <HeroSection />

      {/* Product Teasers */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <FadeInClient>
            <div className="text-center">
              <Badge variant="outline" className="mb-4">Our Ecosystem</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Three Verticals. One Vision.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-neutral-400">
                From specification to visualization to deployment — our products cover the
                entire AI-assisted development lifecycle.
              </p>
            </div>
          </FadeInClient>

          <StaggerClient className="mt-16 grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <StaggerItemClient key={product.id}>
                <Card className="group relative h-full overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  <CardHeader>
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${product.gradient} text-white`}>
                      {iconMap[product.icon]}
                    </div>
                    <CardTitle className="text-xl text-white">{product.name}</CardTitle>
                    <p className="text-sm text-neutral-400">{product.tagline}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-6 text-sm leading-relaxed text-neutral-400">
                      {product.description.slice(0, 150)}...
                    </p>
                    <Link href="/products">
                      <Button variant="outline" size="sm" className="group-hover:border-white/30">
                        Learn More <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </StaggerItemClient>
            ))}
          </StaggerClient>
        </div>
      </section>

      {/* News Section */}
      <section className="border-t border-white/5 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <FadeInClient>
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="outline" className="mb-4">Company News</Badge>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Latest Updates
                </h2>
              </div>
              <Link href="/blog">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </FadeInClient>

          <StaggerClient className="mt-12 grid gap-6 md:grid-cols-3">
            {news.map((item) => (
              <StaggerItemClient key={item.id}>
                <Card className="h-full transition-all duration-300 hover:border-white/20">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                      <span className="mx-1">·</span>
                      {item.datePosted.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <CardTitle className="text-lg text-white leading-snug">
                      {item.headline}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-neutral-400">
                      {item.content.slice(0, 160)}...
                    </p>
                  </CardContent>
                </Card>
              </StaggerItemClient>
            ))}
          </StaggerClient>
        </div>
      </section>

      {/* Herzliya Office Section */}
      <section className="border-t border-white/5 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <FadeInClient>
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <Badge variant="outline" className="mb-4">Our Headquarters</Badge>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Herzliya, Israel
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-neutral-400">
                  Our R&D headquarters in Herzliya houses the engineering hub for all
                  three product verticals. A state-of-the-art facility home to our
                  growing team of AI researchers, full-stack engineers, and product
                  architects.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link href="/careers">
                    <Button variant="gradient">
                      View Open Positions <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline">
                      Explore Products
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900 to-neutral-800">
                  <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
                    <Building2 className="h-16 w-16 text-neutral-600" />
                    <div className="text-center">
                      <p className="font-semibold text-neutral-400">Herzliya Offices</p>
                      <p className="text-sm text-neutral-600">Innovation Hub &middot; Israel</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl border border-white/5 -z-10" />
              </div>
            </div>
          </FadeInClient>
        </div>
      </section>
    </>
  );
}
