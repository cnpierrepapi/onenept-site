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
  "I find the places where a codebase and its own documentation disagree, and prove it with a script anyone can run. Public work in datahub-project/datahub and elsewhere, plus products running in production.";

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
    "Metadata and lineage work. Public contributions to datahub-project/datahub, and Ariadne, a lineage-grounded root cause tool built on DataHub. Available for contract work, remote.",
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
