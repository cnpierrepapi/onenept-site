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

export const metadata: Metadata = {
  title: "Onenept Studios :: live products, settled with evidence",
  description:
    "A one-person product studio run like a trading desk. Flagships Lagisalpha and Spikelines are live now. Every product settles against the real world, and the ones that missed are named in the Dead Book.",
  metadataBase: new URL("https://onenept.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Onenept Studios :: live products, settled with evidence",
    description:
      "A one-person product studio run like a trading desk. Flagships Lagisalpha and Spikelines are live now.",
    url: "https://onenept.com",
    siteName: "Onenept Studios",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onenept Studios :: live products, settled with evidence",
    description:
      "A one-person product studio run like a trading desk. Flagships Lagisalpha and Spikelines are live now.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Onenept Studios Inc.",
  url: "https://onenept.com",
  email: "admin@onenept.com",
  description:
    "A one-person product studio run like a trading desk. Live-market products, settled with evidence.",
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
