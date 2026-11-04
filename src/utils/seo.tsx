import type { Product } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

interface ArticleData {
  title: string;
  slug: string;
  excerpt: string;
  datePublished: string;
  dateModified: string;
  image: string;
}

interface FaqItem {
  question: string;
  answer: string;
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
    url: SITE_URL,
    logo: `${SITE_URL}/apple-icon`,
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
    sameAs: [
      "https://www.specifys-ai.com/",
      "https://rift-code.com/",
      "https://greenprd.com",
      "https://www.adpulse-studio.com",
    ],
  };
}

export function generateBlogPostingSchema(article: ArticleData) {
  const url = `${SITE_URL}/blog/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: [article.image],
    url,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      "@type": "Organization",
      name: "prd.it",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "prd.it",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/apple-icon`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function generateFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
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
      sameAs: SITE_URL,
      logo: `${SITE_URL}/apple-icon`,
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
    url: product.url.startsWith("http") ? product.url : `${SITE_URL}${product.url}`,
    image: `${SITE_URL}${product.images.banner}`,
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
      url: SITE_URL,
    },
  };
}

export function generateBlogSchema(
  posts: { title: string; slug: string; date: string; updated?: string }[],
  meta: { name: string; description: string }
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: meta.name,
    description: meta.description,
    url: `${SITE_URL}/blog`,
    publisher: {
      "@type": "Organization",
      name: "prd.it",
      url: SITE_URL,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
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
