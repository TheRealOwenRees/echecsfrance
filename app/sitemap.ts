import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://echecsfrance.com",
      lastModified: new Date(),
    },
    {
      url: "https://echecsfrance.com/tournois",
      lastModified: new Date(),
    },
    {
      url: "https://echecsfrance.com/qui-sommes-nous",
      lastModified: new Date(),
    },
    {
      url: "https://echecsfrance.com/contactez-nous",
      lastModified: new Date(),
    },
  ];
}
