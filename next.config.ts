import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* the old case-study pages are gone; send their links to the merged work */
  async redirects() {
    return [
      { source: "/case/:slug*", destination: "/#open-source", permanent: true },
    ];
  },
};

export default nextConfig;
