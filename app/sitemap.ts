import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ['fr', 'en'].flatMap(locale => {
    const prefix = `https://echecsfrance.com/${locale === 'fr' ? '' : `${locale}/`}`
    return [
    {
      url: prefix,
      lastModified: new Date(),
    },
    {
      url: `${prefix}tournois`,
      lastModified: new Date(),
    },
    {
      url: `${prefix}qui-sommes-nous`,
      lastModified: new Date(),
    },
    {
      url: `${prefix}contactez-nous`,
      lastModified: new Date(),
    },
  ]});
}
