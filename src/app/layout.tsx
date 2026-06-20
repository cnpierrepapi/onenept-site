import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Integration Developer — Chukwudumaga Nnawuogo",
  description:
    "I build AI agents, RAG pipelines, and workflow automations — connecting LLM APIs to real products, from prototype to production. Available for hire on Upwork.",
  metadataBase: new URL("https://onenept.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Integration Developer — Chukwudumaga Nnawuogo",
    description:
      "I build AI agents, RAG pipelines, and workflow automations — connecting LLM APIs to real products, from prototype to production.",
    url: "https://onenept.com",
    siteName: "Onenept Studios",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Integration Developer — Chukwudumaga Nnawuogo",
    description:
      "AI agents, RAG pipelines, and workflow automations — from prototype to production.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Chukwudumaga Nnawuogo",
  jobTitle: "AI Integration Developer",
  description:
    "I build AI agents, RAG pipelines, and workflow automations — connecting LLM APIs to real products, from prototype to production.",
  url: "https://onenept.com",
  email: "admin@onenept.com",
  sameAs: [
    "https://www.linkedin.com/in/cenpierrepapi/",
    "https://github.com/cnpierrepapi",
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Large Language Models",
    "AI Agents",
    "Retrieval Augmented Generation",
    "Next.js",
    "TypeScript",
    "Supabase",
    "Solana",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Onenept Studios Inc.",
    url: "https://onenept.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
