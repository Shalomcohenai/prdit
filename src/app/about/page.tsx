import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeInClient } from "@/components/home-animations";

export const metadata: Metadata = {
  title: "About",
  description:
    "prd.it was founded to close the gap between product vision and code-especially as AI-generated code outpaces what developers can truly understand.",
  alternates: {
    canonical: "/about",
  },
};

function ProseSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-neutral-400">
        {children}
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <FadeInClient>
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                Our Story
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Why We Built prd.it
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
                We started this company because vague product specification leads to
                suboptimal software-and AI has made that gap harder to close, not
                easier.
              </p>
            </div>
          </FadeInClient>

          <FadeInClient delay={0.1}>
            <ProseSection title="Specification Was the Bottleneck">
              <p>
                Most products fail in the build phase-not because teams lack talent or
                tools, but because the <strong className="text-neutral-300">specification is weak</strong>.
                Requirements stay fuzzy, architecture decisions are implied rather than
                written down, and every new feature adds another layer of guesswork.
              </p>
              <p>
                When the spec is unclear, builders optimize for speed and prompts instead
                of intent. Features ship, but they drift from the original vision. Refactors
                pile up. Technical debt compounds. The product works-but it is not what
                anyone actually meant to build.
              </p>
              <p>
                We saw this pattern everywhere: strong engineers, modern stacks, and AI
                assistants-yet products that did not match the founder&apos;s or PM&apos;s
                mental model. The root cause was rarely &ldquo;bad code.&rdquo; It was{" "}
                <strong className="text-neutral-300">bad or missing specification</strong>.
              </p>
            </ProseSection>
          </FadeInClient>

          <FadeInClient delay={0.15}>
            <ProseSection title="The AI Era Widened the Gap">
              <p>
                Recent advances in AI coding have accelerated output dramatically. That
                is a gift and a risk.
              </p>
              <p>
                Today, much of a codebase-often most of it-is{" "}
                <strong className="text-neutral-300">
                  generated, not authored line-by-line
                </strong>{" "}
                by the developer who owns the vision. The developer may approve diffs,
                merge PRs, and ship features without deeply understanding every path,
                dependency, and tradeoff in the system.
              </p>
              <p>
                The distance between &ldquo;what I wanted to build&rdquo; and &ldquo;what
                actually exists in the repo&rdquo; has grown. Vision lives in conversations
                and documents; reality lives in generated code the team barely recognizes.
                Without a strong bridge between the two, teams build fast-but{" "}
                <strong className="text-neutral-300">not optimally</strong>, and not with
                confidence.
              </p>
            </ProseSection>
          </FadeInClient>

          <FadeInClient delay={0.2}>
            <ProseSection title="Strengthening the Link Between Vision and Code">
              <p>
                <strong className="text-neutral-300">prd.it</strong> exists to tighten the
                connection between product intent and the codebase-so builders stay aligned
                with the vision even when AI writes most of the implementation.
              </p>
              <p>We build tools across the full loop:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong className="text-neutral-300">Specify before you build</strong> -
                  Structured PRDs and architecture constraints so AI and humans share the
                  same source of truth (Specifys AI, GreenPRD).
                </li>
                <li>
                  <strong className="text-neutral-300">See what you have</strong> -
                  Repository intelligence and visual maps so teams understand structure,
                  not just diffs (Rift Code).
                </li>
                <li>
                  <strong className="text-neutral-300">Keep spec and code in sync</strong> -
                  Live workspaces and IDE integrations (including MCP) so changes in
                  vision propagate to what gets built.
                </li>
              </ul>
              <p>
                Our mission is <strong className="text-neutral-300">specification-first development</strong>:
                make intent explicit, keep it current, and make the codebase legible again-so
                AI amplifies the developer&apos;s vision instead of replacing it.
              </p>
            </ProseSection>
          </FadeInClient>

          <FadeInClient delay={0.25}>
            <ProseSection title="Built in Herzliya. Growing Globally.">
              <p>
                Our R&D headquarters is in <strong className="text-neutral-300">Herzliya, Israel</strong>;
                our growth office is in <strong className="text-neutral-300">San Francisco, USA</strong>.
                We are a product engineering company at the intersection of PRDs, code
                intelligence, and IDE workflow automation-and we are hiring builders who
                care about closing the vision-code gap.
              </p>
            </ProseSection>
          </FadeInClient>
        </div>
      </section>

      <section className="border-t border-white/5 py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 px-6 sm:flex-row">
          <FadeInClient>
            <Link href="/products">
              <Button variant="gradient" size="lg">
                Explore Products <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </FadeInClient>
          <FadeInClient delay={0.05}>
            <Link href="/careers">
              <Button variant="outline" size="lg">
                Join Us
              </Button>
            </Link>
          </FadeInClient>
          <FadeInClient delay={0.1}>
            <a href="mailto:about@prd.it.com">
              <Button variant="ghost" size="lg">
                Contact
              </Button>
            </a>
          </FadeInClient>
        </div>
      </section>
    </>
  );
}
