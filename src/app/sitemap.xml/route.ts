
import { NextResponse } from 'next/server';

const urls = [
  {
    url: 'https://jsr-alternance.fr',
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 1,
  },
  {
    url: 'https://jsr-alternance.fr/pages/tarifs',
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: 'https://jsr-alternance.fr/auth/login',
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.5,
  },

];

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.map((item) => `
        <url>
          <loc>${item.url}</loc>
          <lastmod>${item.lastModified.toISOString()}</lastmod>
          <changefreq>${item.changeFrequency}</changefreq>
          <priority>${item.priority}</priority>
        </url>
      `).join('')}
    </urlset>
  `;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}