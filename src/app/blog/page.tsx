import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { getAllBlogPosts, type BlogPost } from "@/utils/content";
import { products } from "@/lib/products";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import { JsonLd, generateBlogSchema, generateBreadcrumbSchema } from "@/utils/seo";

const BLOG_TITLE = "AI Product Engineering Blog: PRDs, MCP & Code Intelligence";
const BLOG_DESCRIPTION =
  "Essays on spec-first AI product engineering: PRDs LLMs can follow, Model Context Protocol workflows, and code intelligence for generated repositories.";

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: absoluteUrl("/blog"),
  },
  openGraph: {
    url: absoluteUrl("/blog"),
    title: `${BLOG_TITLE} | prd.it`,
    description: BLOG_DESCRIPTION,
  },
};

const ctaLabels: Record<string, string> = {
  specifys: "Specifys AI",
  riftcode: "Rift Code",
  greenprd: "GreenPRD",
};

const groupLedes: Record<string, string> = {
  specifys:
    "The posts in this group treat the PRD as the input a coding agent compiles, not as a document written after the code exists. They start from a failure we see in AI-assisted teams: output shows up in minutes, and the product decisions inside that output were never made by anyone. A generator will invent edge cases, permissions, and state transitions when the spec left them blank, and those inventions become the system. The essays walk through how that sprawl turns into technical debt, what a prompt architecture looks like when the requirements are structured enough for Cursor or Claude to follow, and why a specification-first workflow is the practical antidote. Read them when the model is merging faster than the team can say what should have been built.",
  riftcode:
    "A repository full of generated code fails in a different place: comprehension. Line diffs still render, but they stop answering the questions a reviewer actually has. Which boundary moved, which service now depends on another, and what a new engineer should look at first. These essays treat code intelligence as a product problem. One lays out a way to onboard onto a large, messy GitHub repo in minutes rather than days. Another argues that text-based review hides architectural impact. A third looks at visual architecture maps as a way to lower the cognitive load of a codebase nobody holds in their head. The spec says what should exist. The map says what does exist. The gap between them is where teams lose the product.",
  greenprd:
    "Prompt engineering assumed the chat box was the durable interface, and that a person would restate the product on every turn. That assumption does not survive a long build. The Model Context Protocol is the architectural answer already shipping in editors: a standard way for a model to call tools and read resources that live outside the transcript, including the spec. The essays here explain what MCP is, how it changes day-to-day IDE workflows, and why visual workflow composition is replacing hand-written prompts as the way teams describe autonomous work. The person should edit a structure the model can read, instead of rewriting instructions every time the context window forgets. GreenPRD is that structure: a canvas, a document, and an MCP server kept in one state.",
};

function ProductAnchor({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const product = products.find((item) => item.id === id);
  if (!product) return children;
  return (
    <a href={product.url} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function PostGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full">
          <Card className="group h-full transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <CardHeader>
              <div className="mb-2 flex items-center gap-3">
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {ctaLabels[post.targetProductCTA] ?? post.targetProductCTA}
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
                  <time dateTime={post.date}>
                    {new Date(`${post.date}T00:00:00.000Z`).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </time>
                </span>
                <span className="flex items-center gap-1 text-xs text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Read More <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
  ];

  const groups = products
    .map((product) => ({
      product,
      posts: posts.filter((post) => post.targetProductCTA === product.id),
    }))
    .filter((group) => group.posts.length > 0);

  const groupedSlugs = new Set(
    groups.flatMap((group) => group.posts.map((post) => post.slug))
  );
  const ungrouped = posts.filter((post) => !groupedSlugs.has(post.slug));

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbItems)} />
      <JsonLd
        data={generateBlogSchema(posts, {
          name: `${BLOG_TITLE} | prd.it`,
          description: BLOG_DESCRIPTION,
        })}
      />
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              Blog
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
              AI Product Engineering Blog:{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                PRDs, MCP & Code Intelligence
              </span>
            </h1>
          </div>
          <div className="prose-dark mx-auto mt-10 max-w-3xl text-left">
            <p>
              Specification-first AI product engineering starts from a document
              the model is not allowed to invent around. A PRD here is not a
              pitch deck and not a chat prompt. It names the user, the job to
              be done, the states the system can enter, the interfaces it
              exposes, and the constraints a coding agent has to keep. When
              that spec is explicit, Cursor and Claude have something to
              compile. When it is only a vibe, the tools guess, and the
              repository fills with behavior nobody reviewed.
            </p>
            <p>
              These essays are the prd.it field notes on that failure mode.
              Three subjects run through the archive. Structured PRDs an LLM
              can follow without making product decisions on its own. The
              Model Context Protocol, which lets an editor read a live
              workspace instead of a pasted prompt. And code intelligence:
              visual maps, repository structure, and review, so a generated
              codebase stays legible to the people who own it.
            </p>
            <p>
              The same loop is what we ship.{" "}
              <ProductAnchor id="specifys">Specifys AI</ProductAnchor> writes
              the structured PRD before implementation starts.{" "}
              <ProductAnchor id="riftcode">Rift Code</ProductAnchor> connects
              to GitHub and turns a large repository into a map a new engineer
              can onboard from.{" "}
              <ProductAnchor id="greenprd">GreenPRD</ProductAnchor> keeps the
              spec on a visual canvas and serves it to the IDE over MCP, so an
              edit on the graph updates the document and the scaffold
              together. <ProductAnchor id="adpulse">AdPulse</ProductAnchor>{" "}
              runs the loop on creative work: product context in, on-brand ads
              out, and performance folded back into the next brief. See the{" "}
              <Link href="/products">product overview</Link> for how the four
              fit together.
            </p>
          </div>

          <div className="mt-20 space-y-20">
            {groups.map(({ product, posts: groupPosts }) => (
              <section key={product.id}>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-blue-400"
                  >
                    {product.name}
                  </a>
                </h2>
                <p className="mt-2 text-sm text-neutral-500">{product.tagline}</p>
                {groupLedes[product.id] ? (
                  <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-400">
                    {groupLedes[product.id]}
                  </p>
                ) : null}
                <PostGrid posts={groupPosts} />
              </section>
            ))}
            {ungrouped.length > 0 ? (
              <section>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  More essays
                </h2>
                <PostGrid posts={ungrouped} />
              </section>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
