import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://onenept.com", changeFrequency: "weekly", priority: 1 },
    { url: "https://onenept.com/labs", changeFrequency: "weekly", priority: 0.9 },
    { url: "https://onenept.com/emmanuel", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://onenept.com/privacy", changeFrequency: "yearly", priority: 0.3 },
  ];
}
