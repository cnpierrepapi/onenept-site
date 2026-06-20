import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chukwudumaga Nnawuogo-Pierre — AI Integration Developer",
  description:
    "I build AI agents, RAG pipelines, and workflow automations — connecting LLM APIs to real products, from prototype to production.",
  openGraph: {
    title: "Chukwudumaga Nnawuogo-Pierre — AI Integration Developer",
    description:
      "I build AI agents, RAG pipelines, and workflow automations — connecting LLM APIs to real products, from prototype to production.",
    url: "https://onenept.com",
    siteName: "Onenept Studios",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chukwudumaga Nnawuogo-Pierre — AI Integration Developer",
    description:
      "AI agents, RAG pipelines, and workflow automations — from prototype to production.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
