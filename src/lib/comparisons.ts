export interface Comparison {
  slug: string;
  title: string;
  metaDescription: string;
  ourProduct: {
    name: string;
    id: string;
    url: string;
  };
  competitor: {
    name: string;
    description: string;
  };
  headline: string;
  subheadline: string;
  features: {
    name: string;
    ours: string;
    theirs: string;
    advantage: "ours" | "theirs" | "tie";
  }[];
  verdict: string;
}

export const comparisons: Comparison[] = [
  {
    slug: "specifys-vs-notion",
    title: "Specifys AI vs Notion — PRD Generation Comparison",
    metaDescription:
      "Compare Specifys AI and Notion for creating Product Requirements Documents. See why specification-first AI generation outperforms general-purpose docs.",
    ourProduct: {
      name: "Specifys AI",
      id: "specifys",
      url: "https://specifys-ai.com/",
    },
    competitor: {
      name: "Notion",
      description:
        "A general-purpose workspace for docs, wikis, and project management.",
    },
    headline: "Purpose-Built PRD Generation vs General-Purpose Docs",
    subheadline:
      "Notion is great for wikis. Specifys AI is built exclusively for generating production-ready specifications.",
    features: [
      {
        name: "AI PRD Generation",
        ours: "Guided, schema-validated specification workflows with LLM-optimized output",
        theirs: "Basic AI writing assistant without structured PRD schemas",
        advantage: "ours",
      },
      {
        name: "Architecture Documentation",
        ours: "Automated system architecture, ER diagrams, and API contract generation",
        theirs: "Manual documentation with no automated architecture tooling",
        advantage: "ours",
      },
      {
        name: "LLM Export Compatibility",
        ours: "Export specs optimized for Cursor, Claude, GPT code generation",
        theirs: "Generic markdown export without LLM optimization",
        advantage: "ours",
      },
      {
        name: "General Document Editing",
        ours: "Focused on specifications — not a general wiki tool",
        theirs: "Full-featured document editor with rich formatting and embeds",
        advantage: "theirs",
      },
      {
        name: "Validation & Completeness",
        ours: "Schema validation ensures every PRD section is complete before export",
        theirs: "No validation — documents can be incomplete without warnings",
        advantage: "ours",
      },
      {
        name: "Collaboration",
        ours: "Real-time collaboration on specifications",
        theirs: "Mature real-time collaboration with comments and mentions",
        advantage: "tie",
      },
    ],
    verdict:
      "If you need a general-purpose wiki, Notion works well. But if you're building software and need structured, AI-ready specifications that prevent vibe coding, Specifys AI is the specialized tool for the job.",
  },
  {
    slug: "riftcode-vs-github-copilot",
    title: "Rift Code vs GitHub Copilot — Code Intelligence Comparison",
    metaDescription:
      "Compare Rift Code and GitHub Copilot for code understanding and review. See how visual architecture maps complement AI code completion.",
    ourProduct: {
      name: "Rift Code",
      id: "riftcode",
      url: "https://rift-code.com/",
    },
    competitor: {
      name: "GitHub Copilot",
      description:
        "An AI pair programmer that suggests code completions in your editor.",
    },
    headline: "Repository Intelligence vs Code Completion",
    subheadline:
      "Copilot writes code. Rift Code helps you understand the code you already have.",
    features: [
      {
        name: "Visual Architecture Maps",
        ours: "Interactive dependency graphs, file trees, and architecture visualizations",
        theirs: "No architecture visualization — focused on inline suggestions",
        advantage: "ours",
      },
      {
        name: "Automated Code Review",
        ours: "High-precision automated reviews with architectural context",
        theirs: "Copilot code review available but without architectural awareness",
        advantage: "ours",
      },
      {
        name: "AI Code Completion",
        ours: "Not a code completion tool — focused on understanding, not writing",
        theirs: "Best-in-class inline code suggestions and chat-based coding",
        advantage: "theirs",
      },
      {
        name: "Onboarding Acceleration",
        ours: "Visual walkthroughs and structural maps for new team members",
        theirs: "Helps write code faster but doesn't explain existing architecture",
        advantage: "ours",
      },
      {
        name: "Dead Code Detection",
        ours: "Automated detection of orphaned files and unused dependencies",
        theirs: "No dead code detection capabilities",
        advantage: "ours",
      },
      {
        name: "GitHub Integration",
        ours: "Deep GitHub integration with SSO and enterprise permissions",
        theirs: "Native GitHub integration as a first-party product",
        advantage: "tie",
      },
    ],
    verdict:
      "Copilot and Rift Code solve different problems. Copilot helps you write new code faster. Rift Code helps you understand, review, and navigate the code that already exists. For most teams, they're complementary tools.",
  },
  {
    slug: "mcp-vs-langchain",
    title: "Visual MCP Engine vs LangChain — Workflow Automation Comparison",
    metaDescription:
      "Compare prd.it's Visual MCP Workflow Engine with LangChain for building AI developer workflows. Visual canvas vs code-first orchestration.",
    ourProduct: {
      name: "Visual MCP Engine",
      id: "mcp",
      url: "/products",
    },
    competitor: {
      name: "LangChain",
      description:
        "A code-first framework for building applications with language models.",
    },
    headline: "Visual Workflow Canvas vs Code-First Framework",
    subheadline:
      "LangChain requires deep coding expertise. The Visual MCP Engine lets you build workflows by drawing them.",
    features: [
      {
        name: "Visual Workflow Builder",
        ours: "Drag-and-drop node canvas with real-time preview",
        theirs: "Code-only — requires Python/TypeScript proficiency",
        advantage: "ours",
      },
      {
        name: "MCP Protocol Native",
        ours: "Built on the Model Context Protocol standard for universal tool connectivity",
        theirs: "Custom integration patterns — not MCP-native",
        advantage: "ours",
      },
      {
        name: "IDE Deployment",
        ours: "Deploy directly to Cursor, Claude Desktop, and other local IDE environments",
        theirs: "Primarily server-side deployment — not IDE-native",
        advantage: "ours",
      },
      {
        name: "Ecosystem Maturity",
        ours: "Emerging product — building the ecosystem",
        theirs: "Large community with extensive documentation and integrations",
        advantage: "theirs",
      },
      {
        name: "Composability",
        ours: "Visual tool chaining with typed connections between nodes",
        theirs: "Powerful chain/agent composition through code abstractions",
        advantage: "tie",
      },
      {
        name: "Learning Curve",
        ours: "Low — visual interface requires minimal coding knowledge",
        theirs: "Moderate to high — requires understanding of framework abstractions",
        advantage: "ours",
      },
    ],
    verdict:
      "LangChain is powerful for teams with deep Python expertise who want maximum flexibility. The Visual MCP Engine is designed for teams that want to build AI workflows visually and deploy them directly into their IDE — no framework knowledge required.",
  },
];
