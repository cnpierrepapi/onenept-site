import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onenept Studios | AI Tools for Digital Freelancers",
  description:
    "Onenept Studios is an AI development corporation building tools that help digital freelancers grow their business.",
  openGraph: {
    title: "Onenept Studios | AI Tools for Digital Freelancers",
    description:
      "Building AI-powered tools that help digital freelancers grow their business.",
    url: "https://onenept.com",
    siteName: "Onenept Studios",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onenept Studios",
    description:
      "AI-powered tools that help digital freelancers grow their business.",
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
