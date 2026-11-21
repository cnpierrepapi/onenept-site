import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* the old case-study pages are gone; send their links to the merged work on the founder page */
  async redirects() {
    return [
      { source: "/case/:slug*", destination: "/emmanuel#merged", permanent: true },
    ];
  },
};

export default nextConfig;
