import type { Metadata } from "next";
import { Syne, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "Onenept Studios :: read code, prove the gaps";
const SHORT_DESC =
  "I find the places where a codebase and its own documentation disagree, and prove it with a script anyone can run. Two pull requests of mine are merged into datahub-project/datahub, one into CALL-E's agent repo, and six of the fourteen issues I filed against CALL-E are fixed.";

export const metadata: Metadata = {
  title: TITLE,
  description: `${SHORT_DESC} Available for contract work, remote.`,
  metadataBase: new URL("https://onenept.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: TITLE,
    description: SHORT_DESC,
    url: "https://onenept.com",
    siteName: "Onenept Studios",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SHORT_DESC,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Onenept Studios Inc.",
  url: "https://onenept.com",
  email: "admin@onenept.com",
  description:
    "Open source drift audits. Two merged contributions to datahub-project/datahub, one to CALLE-AI/awesome-phone-call-agents, an open helper in google/adk-python written at a maintainer's request, and two live tools: Ariadne, lineage-grounded root cause on DataHub, and Asheard, which reads what actually happened on an AI phone call. Available for contract work, remote.",
  founder: {
    "@type": "Person",
    name: "Chukwudumaga Nnawuogo",
    sameAs: [
      "https://www.linkedin.com/in/cenpierrepapi/",
      "https://github.com/cnpierrepapi",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${grotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
