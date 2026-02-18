import { MetadataRoute } from 'next';
import { tales } from '@/lib/tales';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://stepten.io';
  
  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/tales`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/team`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/travel`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  // Tale pages
  const talePages = tales.map((tale) => ({
    url: `${baseUrl}/tales/${tale.slug}`,
    lastModified: new Date(tale.date),
    changeFrequency: 'weekly' as const,
    priority: tale.isPillar ? 0.9 : tale.featured ? 0.85 : 0.8,
  }));

  // Team member pages
  const teamPages = ['stepten', 'pinky', 'reina', 'clark'].map((member) => ({
    url: `${baseUrl}/team/${member}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...talePages, ...teamPages];
}
