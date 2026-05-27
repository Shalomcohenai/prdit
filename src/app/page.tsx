import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { getAllNews } from "@/utils/content";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JsonLd, generateOrganizationSchema } from "@/utils/seo";
import { HeroSection } from "@/components/hero";
import {
  FadeInClient,
  ScrollReveal,
  ScrollRevealIcon,
  StaggerClient,
  StaggerItemClient,
} from "@/components/home-animations";
import { ImageGallery } from "@/components/image-gallery";
import { ProductIcon } from "@/components/product-icon";

export default function HomePage() {
  const news = getAllNews().slice(0, 3);

  return (
    <>
      <JsonLd data={generateOrganizationSchema()} />

      <HeroSection />

      {/* Product Teasers */}
      <section id="ecosystem" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="text-center">
              <Badge variant="outline" className="mb-4">Our Ecosystem</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Three Verticals. One Vision.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-neutral-400">
                From specification to visualization to live generative blueprints - our
                products cover the entire AI-assisted development lifecycle.
              </p>
            </div>
          </ScrollReveal>

          <StaggerClient className="mt-16 grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <StaggerItemClient key={product.id}>
                <Card className="group relative h-full overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  <CardHeader className="items-center space-y-5 text-center">
                    <ScrollRevealIcon className="flex w-full justify-center">
                      <div className="flex items-center gap-3">
                        <ProductIcon
                          src={product.images.icon}
                          alt={`${product.name} icon`}
                          size="lg"
                        />
                        <CardTitle className="text-xl text-white sm:text-2xl">
                          {product.name}
                        </CardTitle>
                      </div>
                    </ScrollRevealIcon>
                    <p className="text-base font-semibold leading-relaxed text-neutral-100 sm:text-lg">
                      {product.homeSummary}
                    </p>
                  </CardHeader>
                  <CardContent className="flex justify-center">
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
                      {new Date(item.date).toLocaleDateString("en-US", {
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
                <ImageGallery
                  images={[
                    { src: "/images/headquarters/office.jpg", alt: "prd.it R&D Headquarters in Herzliya, Israel" },
                    { src: "/images/headquarters/office-2.jpg", alt: "prd.it office workspace" },
                    { src: "/images/headquarters/office-3.jpg", alt: "prd.it team collaboration space" },
                  ]}
                  interval={5000}
                />
                <div className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl border border-white/5 -z-10" />
              </div>
            </div>
          </FadeInClient>
        </div>
      </section>
    </>
  );
}
