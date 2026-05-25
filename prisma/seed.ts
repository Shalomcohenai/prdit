import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(import.meta.dirname, "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.post.deleteMany();
  await prisma.news.deleteMany();
  await prisma.job.deleteMany();

  await prisma.post.createMany({
    data: [
      {
        title: "Why Structured PRDs Are the Antidote to Vibe Coding",
        slug: "structured-prds-antidote-vibe-coding",
        excerpt:
          "How enforcing specification-first workflows prevents the most expensive mistakes in AI-assisted development.",
        content: `## The Vibe Coding Trap

When teams jump straight from idea to implementation with AI code generators, they inherit a dangerous pattern: **vibe coding**. The LLM produces plausible-looking code that compiles, passes superficial review, and ships — only to collapse under real-world edge cases.

### The Cost of Unstructured Generation

Without a specification layer, AI-generated code lacks:

- **Boundary definitions** — no clear contracts between modules
- **Error taxonomy** — no systematic handling of failure modes  
- **State machine awareness** — no explicit lifecycle modeling

### Specification-First Development

The solution is forcing a structured PRD phase *before* any code generation begins. A well-structured PRD captures:

1. **System constraints** — performance budgets, security boundaries, data invariants
2. **User flows** — complete journey maps with branching logic
3. **API contracts** — typed interfaces with error responses
4. **Architecture decisions** — explicit trade-off documentation

### How Specifys AI Enforces Structure

Specifys AI implements a guided specification workflow that produces LLM-optimized PRDs. Every section is validated against a schema, ensuring completeness before generation begins.

The result: AI-generated code that actually works in production, because it was built on a foundation of explicit constraints rather than implicit assumptions.`,
        category: "engineering",
        targetProductCta: "specifys",
        publishedAt: new Date("2026-05-20"),
      },
      {
        title: "Visual Architecture Maps: Reducing Cognitive Load on Complex Codebases",
        slug: "visual-architecture-maps-cognitive-load",
        excerpt:
          "How automated repository visualization transforms developer onboarding and code comprehension.",
        content: `## The Cognitive Load Crisis

Modern codebases are growing exponentially. A typical SaaS product now spans hundreds of thousands of lines across dozens of services. New engineers face a daunting onboarding curve that can take months to overcome.

### The Problem with Text-Based Navigation

Traditional code navigation tools — grep, IDE search, file trees — force developers to build mental models from sequential text scanning. This is fundamentally inefficient for understanding *relationships* between components.

### Visual Architecture as a Solution

Automated visual architecture maps transform code comprehension by:

- **Rendering dependency graphs** as interactive node trees
- **Highlighting coupling patterns** between modules
- **Surfacing dead code** and orphaned dependencies
- **Mapping data flow** across service boundaries

### Rift Code's Approach

Rift Code connects directly to your GitHub repositories and generates comprehensive structural maps automatically. The visual output includes:

- Repository-level architecture trees
- File dependency graphs with weight indicators
- Automated code review annotations
- Onboarding-optimized walkthroughs

Teams using visual architecture tools report 60% faster onboarding and 40% fewer architectural regressions.`,
        category: "developer-tools",
        targetProductCta: "riftcode",
        publishedAt: new Date("2026-05-15"),
      },
      {
        title: "The MCP Revolution: How Model Context Protocol Changes IDE Workflows",
        slug: "mcp-revolution-ide-workflows",
        excerpt:
          "Understanding the Model Context Protocol and how visual workflow builders are reshaping developer tooling.",
        content: `## What is MCP?

The Model Context Protocol (MCP) is an open standard for connecting AI models to external data sources and tools. It creates a universal interface between LLMs and the systems they need to interact with.

### Why MCP Matters for Developers

Traditional AI integrations require custom glue code for every tool connection. MCP standardizes this with:

- **Typed tool definitions** — structured schemas for every capability
- **Context injection** — seamless data flow from sources to models
- **Composable workflows** — chain multiple tools into pipelines

### The Visual Workflow Paradigm

While MCP provides the protocol layer, the next frontier is **visual workflow composition**. Instead of writing configuration files, developers can:

1. **Drag and drop** tool nodes onto a canvas
2. **Draw connections** between data sources and actions
3. **Preview execution** in real-time
4. **Deploy directly** to their IDE environment

### Building the Future

The intersection of MCP, visual programming, and IDE integration creates a powerful new category of developer tooling. By abstracting the complexity of protocol configuration into intuitive visual interfaces, teams can build sophisticated AI workflows without deep protocol knowledge.

This is the direction of modern developer tooling: **visual, composable, and deeply integrated**.`,
        category: "ai-tooling",
        targetProductCta: "mcp",
        publishedAt: new Date("2026-05-10"),
      },
    ],
  });

  await prisma.news.createMany({
    data: [
      {
        headline: "prd.it Opens New R&D Headquarters in Herzliya, Israel",
        content:
          "We are thrilled to announce the opening of our new R&D headquarters in Herzliya, Israel. The state-of-the-art office will serve as the engineering hub for all three product verticals, housing our growing team of AI researchers, full-stack engineers, and product architects.",
        location: "Herzliya",
        datePosted: new Date("2026-05-01"),
      },
      {
        headline: "Specifys AI Reaches 10,000 Generated PRDs Milestone",
        content:
          "Specifys AI has crossed a major milestone — 10,000 production-ready PRDs generated through our structured specification platform. Teams across startups and enterprises are using Specifys to eliminate vibe coding and build software on solid architectural foundations.",
        location: "Global",
        datePosted: new Date("2026-04-20"),
      },
      {
        headline: "Rift Code Launches GitHub Integration for Enterprise Teams",
        content:
          "Rift Code now supports direct GitHub Enterprise integration, enabling large organizations to generate visual architecture maps and automated code reviews across their entire repository ecosystem. The integration supports SSO, fine-grained permissions, and custom review policies.",
        location: "Global",
        datePosted: new Date("2026-04-10"),
      },
      {
        headline: "prd.it Expands to San Francisco with Growth Office",
        content:
          "prd.it has established a new growth and marketing office in San Francisco, USA. The office will focus on go-to-market strategy, enterprise partnerships, and community building across the North American developer ecosystem.",
        location: "San Francisco",
        datePosted: new Date("2026-03-15"),
      },
    ],
  });

  await prisma.job.createMany({
    data: [
      {
        title: "Senior Full-Stack Engineer",
        department: "Engineering",
        location: "Herzliya",
        description:
          "Join our core engineering team building the next generation of AI-powered developer tools. You will work across the entire stack — from database design to real-time UI — on products used by thousands of developers worldwide.",
        requirements:
          "5+ years of full-stack experience with TypeScript/React/Node.js. Strong understanding of database design (SQL and NoSQL). Experience with AI/ML integration is a plus. Familiarity with Next.js App Router and server-side rendering patterns.",
        active: true,
      },
      {
        title: "AI/ML Research Engineer",
        department: "Engineering",
        location: "Herzliya",
        description:
          "Drive the intelligence layer behind our product suite. Research and implement LLM-powered features for PRD generation, code analysis, and workflow automation. Collaborate with product and engineering to ship models into production.",
        requirements:
          "3+ years of ML engineering experience. Proficiency in Python and PyTorch/TensorFlow. Experience fine-tuning and deploying LLMs. Strong understanding of NLP and code generation techniques. Published research is a plus.",
        active: true,
      },
      {
        title: "Platform Engineer",
        department: "Engineering",
        location: "Herzliya",
        description:
          "Build and maintain the infrastructure that powers our products. Design scalable deployment pipelines, monitoring systems, and developer tooling. Own the reliability and performance of our production systems.",
        requirements:
          "4+ years of infrastructure/platform engineering experience. Expertise in Docker, Kubernetes, and CI/CD pipelines. Strong understanding of observability (logging, metrics, tracing). Experience with SQLite, PostgreSQL, or similar databases.",
        active: true,
      },
      {
        title: "Head of Growth Marketing",
        department: "Marketing",
        location: "San Francisco",
        description:
          "Lead our growth strategy across all three product verticals. Own acquisition funnels, content marketing, SEO, and developer community engagement. Build and manage a high-performing growth team.",
        requirements:
          "7+ years of growth marketing experience in B2B SaaS. Proven track record of scaling developer-focused products. Deep understanding of SEO, content strategy, and programmatic marketing. Experience with PLG (product-led growth) models.",
        active: true,
      },
      {
        title: "Developer Relations Engineer",
        department: "Marketing",
        location: "San Francisco",
        description:
          "Be the bridge between prd.it and the developer community. Create technical content, speak at conferences, build integrations, and gather feedback to shape our product roadmap. Represent prd.it at major industry events.",
        requirements:
          "3+ years of developer relations or developer advocacy experience. Strong technical background with ability to write code and build demos. Excellent public speaking and technical writing skills. Active presence in developer communities.",
        active: true,
      },
      {
        title: "Content & SEO Strategist",
        department: "Marketing",
        location: "San Francisco",
        description:
          "Own the content engine that drives organic traffic to prd.it and its product ecosystem. Develop editorial strategy, manage the blog, optimize for search engines and AI discovery, and build topical authority in the AI developer tools space.",
        requirements:
          "4+ years of content marketing and SEO experience. Strong technical writing ability — you can explain complex developer concepts clearly. Experience with programmatic SEO and AI-optimized content. Familiarity with developer tools and AI/ML concepts.",
        active: true,
      },
    ],
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
