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

const TITLE = "Onenept Studios :: data products, traced to the source";
const SHORT_DESC =
  "A one-person data studio run like a trading desk. Hallmark for provenance in AI advertising, Ariadne for lineage-grounded root cause in production ML, Lagisalpha for settled market calls.";

export const metadata: Metadata = {
  title: TITLE,
  description: `${SHORT_DESC} Three products, one question: where did this come from.`,
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
    "A one-person data studio run like a trading desk. Provenance, lineage and settlement products, each one traced to its source.",
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
