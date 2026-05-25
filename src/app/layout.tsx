import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "prd.it - AI-Powered Product Engineering",
    template: "%s | prd.it",
  },
  description:
    "prd.it is a global AI and product engineering company building specification-first developer tools. Explore Specifys AI, Rift Code, and the Visual MCP Workflow Engine.",
  metadataBase: new URL("https://prd.it"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "prd.it",
    title: "prd.it - AI-Powered Product Engineering",
    description:
      "Building the future of specification-first development with Specifys AI, Rift Code, and the Visual MCP Workflow Engine.",
  },
  twitter: {
    card: "summary_large_image",
    title: "prd.it - AI-Powered Product Engineering",
    description:
      "Building the future of specification-first development.",
  },
  verification: {
    google: "zkYLYVDNS-JxGpfhHUjL90n72lbQeDVEs436xKQ0Az4",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GHBZJW76GR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GHBZJW76GR');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        <Nav />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
