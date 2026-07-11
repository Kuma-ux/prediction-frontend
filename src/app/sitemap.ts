import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://theprobability.site",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://theprobability.site/markets",
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: "https://theprobability.site/how-it-works",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://theprobability.site/help",
      lastModified: new Date(),
      priority: 0.7,
    },
  ];
}
