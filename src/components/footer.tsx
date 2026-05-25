import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const productLinks = [
  { href: "https://specifys-ai.com/", label: "Specifys AI" },
  { href: "https://rift-code.com/", label: "Rift Code" },
  { href: "/products", label: "Visual MCP Engine" },
];

const companyLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/admin", label: "Admin" },
];

const compareLinks = [
  { href: "/compare/specifys-vs-notion", label: "Specifys vs Notion" },
  { href: "/compare/riftcode-vs-github-copilot", label: "Rift Code vs Copilot" },
  { href: "/compare/mcp-vs-langchain", label: "MCP vs LangChain" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight text-white">
              prd<span className="text-blue-500">.</span>it
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              AI-powered product engineering. Building the future of specification-first development.
            </p>
            <div className="mt-4 flex flex-col gap-1 text-xs text-neutral-500">
              <span>R&D HQ: Herzliya, Israel</span>
              <span>Growth: San Francisco, USA</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Products</h3>
            <ul className="mt-4 space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                    {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Compare</h3>
            <ul className="mt-4 space-y-2">
              {compareLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} prd.it. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/blog" className="text-xs text-neutral-500 transition-colors hover:text-neutral-300">
              Insights
            </Link>
            <Link href="/careers" className="text-xs text-neutral-500 transition-colors hover:text-neutral-300">
              Join Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
