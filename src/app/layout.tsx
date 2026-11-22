import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { COMPANY } from "./site";
import "./globals.css";
import Experience from "./fx/Experience";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const sans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const TITLE = "Onenept Studios: platforms, real-life games and stories";
const DESC =
  "Onenept Studios is three things under one roof. Platforms where people earn: Warmleads, Folofolo and SYZYGY. Real-life games that lead people to them: The Come Up and Spot Her. And stories, starting with League of Supernatural Gentlemen, a live-action series. Plus merged work in Google's ADK, DataHub and CALL-E.";

export const metadata: Metadata = {
  title: { default: TITLE, template: "%s :: Onenept Studios" },
  description: DESC,
  metadataBase: new URL("https://onenept.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://onenept.com",
    siteName: "Onenept Studios",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export const viewport: Viewport = {
  themeColor: "#FFF8EE",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.legal,
  alternateName: "Onenept Studios",
  url: "https://onenept.com",
  email: COMPANY.email,
  description: DESC,
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.street,
    addressLocality: "Dover",
    addressRegion: "DE",
    postalCode: "19901",
    addressCountry: "US",
  },
  founder: {
    "@type": "Person",
    name: COMPANY.founder,
    sameAs: [COMPANY.linkedin, COMPANY.github],
  },
  sameAs: [COMPANY.github],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <noscript>
          <style>{".loader{display:none!important}"}</style>
        </noscript>
        {children}
        <Experience />
      </body>
    </html>
  );
}
