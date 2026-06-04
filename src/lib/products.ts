export interface Product {
  id: string;
  name: string;
  tagline: string;
  homeSummary: string;
  description: string;
  url: string;
  images: {
    icon: string;
    logo: string;
    banner: string;
  };
  screenshots: string[];
  features: string[];
  techSpecs: string[];
  ctaLabel: string;
  gradient: string;
}

export const products: Product[] = [
  {
    id: "specifys",
    name: "Specifys AI",
    tagline: "Specification-First PRD Generation",
    homeSummary: "The market-leading tool for structured software planning and PRDs.",
    description:
      "An advanced AI-powered platform tailored for creating production-ready Product Requirements Documents (PRDs) and software architecture specifications. It prevents the common 'vibe coding patchwork trap' by forcing structured, LLM-optimized logic and system constraints before any code generation begins.",
    url: "https://specifys-ai.com/",
    images: {
      icon: "/images/products/specifys/icon.png",
      logo: "/images/products/specifys/logo.png",
      banner: "/images/products/specifys/banner.png",
    },
    screenshots: [
      "/images/products/specifys/screenshot-1.png",
      "/images/products/specifys/screenshot-2.png",
      "/images/products/specifys/screenshot-3.png",
      "/images/products/specifys/screenshot-4.png",
    ],
    features: [
      "Guided specification workflows",
      "LLM-optimized PRD schemas",
      "Architecture decision logging",
      "API contract generation",
      "State machine modeling",
      "Export to Cursor, Claude, GPT",
    ],
    techSpecs: [
      "AI-powered generation pipeline",
      "Structured validation engine",
      "Multi-format export (Markdown, JSON)",
      "Real-time collaboration",
    ],
    ctaLabel: "Try Specifys AI",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "riftcode",
    name: "Rift Code",
    tagline: "Repository Intelligence & Visualization",
    homeSummary: "See any repository as an interactive visual map.",
    description:
      "An automated repository intelligence and visualization engine. It connects to GitHub to generate comprehensive visual structural maps, architecture trees, and perform high-precision, automated code reviews - drastically reducing onboarding and cognitive load on complex codebases.",
    url: "https://rift-code.com/",
    images: {
      icon: "/images/products/riftcode/icon.svg",
      logo: "/images/products/riftcode/logo.png",
      banner: "/images/products/riftcode/banner.png",
    },
    screenshots: [
      "/images/products/riftcode/screenshot-1.png",
      "/images/products/riftcode/screenshot-2.png",
      "/images/products/riftcode/screenshot-3.png",
      "/images/products/riftcode/screenshot-4.png",
    ],
    features: [
      "Visual architecture mapping",
      "Dependency graph rendering",
      "Automated code reviews",
      "GitHub Enterprise integration",
      "Onboarding walkthroughs",
      "Dead code detection",
    ],
    techSpecs: [
      "GitHub API integration",
      "Interactive node-based graphs",
      "SSO & fine-grained permissions",
      "Custom review policies",
    ],
    ctaLabel: "Explore Rift Code",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "greenprd",
    name: "GreenPRD",
    tagline: "Edit Visually, Not in Chat",
    homeSummary:
      "Shape your product on a visual canvas - specs and scaffolding update automatically, without re-prompting an AI chat for every change.",
    description:
      "GreenPRD is a live generative workspace that turns a brief idea into a production-ready PRD through a 7-stage AI pipeline. Unlike typical AI builders, you do not keep rewriting changes in chat. Edit flows, screens, and logic directly on an interactive visual canvas—drag components, reconnect nodes, refine structure—and the specification, Markdown panels, and code scaffolding update to match. Bidirectional sync keeps the graph, engineering-grade docs, and downloadable ZIP aligned through a single state-delta pipeline, so what you see on the canvas is what your build reflects.",
    url: "https://greenprd.com",
    images: {
      icon: "/images/products/mcp/icon.png",
      logo: "/images/products/mcp/logo.png",
      banner: "/images/products/mcp/banner.png",
    },
    screenshots: [
      "/images/products/mcp/screenshot-1.png",
      "/images/products/mcp/screenshot-2.png",
      "/images/products/mcp/screenshot-3.png",
      "/images/products/mcp/screenshot-4.png",
    ],
    features: [
      "Visual editing instead of endless chat re-prompts",
      "7-stage AI generation pipeline",
      "Interactive graph canvas (React Flow)",
      "Bidirectional sync: canvas, Markdown, and code ZIP",
      "Engineering-grade Markdown specifications",
      "Native MCP server for Cursor & Claude Desktop",
    ],
    techSpecs: [
      "Bidirectional state-delta pipeline",
      "React Flow visual canvas",
      "MCP protocol server integration",
      "Token-based consumption ledger",
    ],
    ctaLabel: "Try GreenPRD",
    gradient: "from-emerald-500 to-green-500",
  },
];
