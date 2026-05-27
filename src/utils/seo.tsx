import type { Product } from "@/lib/products";

interface ArticleData {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: Date;
  content: string;
}

interface JobData {
  title: string;
  description: string;
  location: string;
  department: string;
  createdAt: Date;
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "prd.it",
    url: "https://prd.it",
    logo: "https://prd.it/logo.png",
    description:
      "A global AI and product engineering company operating at the intersection of product specification, code intelligence, and live generative PRD workspaces.",
    foundingDate: "2024",
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: "Herzliya",
        addressCountry: "IL",
        description: "R&D Headquarters",
      },
      {
        "@type": "PostalAddress",
        addressLocality: "San Francisco",
        addressRegion: "CA",
        addressCountry: "US",
        description: "Growth Office",
      },
    ],
    sameAs: ["https://specifys-ai.com/", "https://rift-code.com/", "https://greenprd.com"],
  };
}

export function generateArticleSchema(article: ArticleData) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    url: `https://prd.it/blog/${article.slug}`,
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.publishedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "prd.it",
      url: "https://prd.it",
    },
    publisher: {
      "@type": "Organization",
      name: "prd.it",
      url: "https://prd.it",
      logo: {
        "@type": "ImageObject",
        url: "https://prd.it/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://prd.it/blog/${article.slug}`,
    },
  };
}

export function generateJobPostingSchema(job: JobData) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.createdAt.toISOString(),
    hiringOrganization: {
      "@type": "Organization",
      name: "prd.it",
      sameAs: "https://prd.it",
      logo: "https://prd.it/logo.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: job.location === "Herzliya" ? "IL" : "US",
        ...(job.location === "San Francisco" ? { addressRegion: "CA" } : {}),
      },
    },
    employmentType: "FULL_TIME",
    industry: "Software Development",
    occupationalCategory: job.department,
  };
}

export function generateSoftwareApplicationSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.description,
    url: product.url.startsWith("http") ? product.url : `https://prd.it${product.url}`,
    image: `https://prd.it${product.images.banner}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "prd.it",
      url: "https://prd.it",
    },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
