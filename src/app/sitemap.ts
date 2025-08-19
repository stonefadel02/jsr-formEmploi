import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://jsr-alternance.fr',
      lastModified: new Date(),
    },
    {
      url: 'https://jsr-alternance.fr/pages/tarifs',
      lastModified: new Date(),
    },
    {
      url: 'https://jsr-alternance.fr/auth/login',
      lastModified: new Date(),
    },
  ];
}