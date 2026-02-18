import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { tales, getTaleBySlug } from '@/lib/tales';
import { TaleContent } from './TaleContent';

// ISR: Revalidate every 60 seconds for fresh content
export const revalidate = 60;

export function generateStaticParams() {
  return tales.map((tale) => ({ slug: tale.slug }));
}

// Generate metadata for OG tags, canonical, etc.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tale = getTaleBySlug(slug);
  
  if (!tale) {
    return {
      title: 'Tale Not Found | STEPTEN™',
    };
  }

  const url = `https://stepten.io/tales/${tale.slug}`;
  const ogImage = tale.heroVideo?.replace('.mp4', '.jpg') || tale.heroImage || 'https://stepten.io/images/og-default.jpg';

  return {
    title: `${tale.title} | STEPTEN™`,
    description: tale.excerpt || tale.subtitle || `${tale.title} - A tale from the STEPTEN universe.`,
    
    // Canonical URL
    alternates: {
      canonical: url,
    },
    
    // Open Graph
    openGraph: {
      title: tale.title,
      description: tale.excerpt || tale.subtitle || `${tale.title} - A tale from the STEPTEN universe.`,
      url: url,
      siteName: 'STEPTEN™',
      type: 'article',
      publishedTime: tale.date,
      authors: [tale.author?.name || 'StepTen'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: tale.title,
        },
      ],
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: tale.title,
      description: tale.excerpt || tale.subtitle || `${tale.title} - A tale from the STEPTEN universe.`,
      images: [ogImage],
    },
    
    // Robots
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

export default async function TaleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tale = getTaleBySlug(slug);
  if (!tale) notFound();

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: tale.title,
    description: tale.excerpt || tale.subtitle,
    image: tale.heroVideo?.replace('.mp4', '.jpg') || tale.heroImage,
    datePublished: tale.date,
    dateModified: tale.date,
    author: {
      '@type': 'Person',
      name: tale.author?.name || 'StepTen',
      url: tale.author?.slug ? `https://stepten.io/team/${tale.author.slug}` : 'https://stepten.io',
    },
    publisher: {
      '@type': 'Organization',
      name: 'STEPTEN™',
      logo: {
        '@type': 'ImageObject',
        url: 'https://stepten.io/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://stepten.io/tales/${tale.slug}`,
    },
    wordCount: tale.readTime ? parseInt(tale.readTime) * 200 : undefined,
    articleSection: tale.category || 'Technology',
    keywords: tale.tags?.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TaleContent tale={tale} allTales={tales} />
    </>
  );
}
