import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const serif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const TITLE = "Onenept Studios :: I read the spec, then I measure";
const SHORT_DESC =
  "I find the places where a codebase and its own documentation disagree, and prove it with something anyone can rerun. Two pull requests of mine are merged into datahub-project/datahub, one into CALL-E's agent repo, and six of the fourteen issues I filed against CALL-E are fixed.";

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

export const viewport: Viewport = {
  themeColor: "#f4f1e8",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Onenept Studios Inc.",
  url: "https://onenept.com",
  email: "admin@onenept.com",
  description:
    "Open source drift audits. Two merged contributions to datahub-project/datahub, one to CALLE-AI/awesome-phone-call-agents, an open helper in google/adk-python written at a maintainer's request, six fixed issues in CALL-E's docs and tooling, and threads in Google's agent and GenAI repos. Available for contract work, remote.",
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
      className={`${serif.variable} ${mono.variable} h-full antialiased`}
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
