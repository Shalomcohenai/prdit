export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  icon: string;
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
    description:
      "An advanced AI-powered platform tailored for creating production-ready Product Requirements Documents (PRDs) and software architecture specifications. It prevents the common 'vibe coding patchwork trap' by forcing structured, LLM-optimized logic and system constraints before any code generation begins.",
    url: "https://specifys-ai.com/",
    icon: "FileText",
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
    description:
      "An automated repository intelligence and visualization engine. It connects to GitHub to generate comprehensive visual structural maps, architecture trees, and perform high-precision, automated code reviews — drastically reducing onboarding and cognitive load on complex codebases.",
    url: "https://rift-code.com/",
    icon: "GitBranch",
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
    id: "mcp",
    name: "Visual MCP Workflow Engine",
    tagline: "Next-Gen Model Context Protocol Tooling",
    description:
      "A next-generation Model Context Protocol (MCP) tooling ecosystem. It features a rich, node-based visual canvas where developers draw out software engineering workflows, data models, and logic gates. The system automatically injects, mutates, and deploys these architectures directly into local IDE environments in real-time.",
    url: "/products",
    icon: "Workflow",
    features: [
      "Visual node-based canvas",
      "Drag-and-drop workflow builder",
      "Real-time IDE deployment",
      "MCP protocol native",
      "Composable tool chains",
      "Cursor & Claude Desktop support",
    ],
    techSpecs: [
      "MCP standard compliance",
      "Typed tool definitions",
      "Context injection pipeline",
      "Live preview execution",
    ],
    ctaLabel: "Coming Soon",
    gradient: "from-orange-500 to-red-500",
  },
];
