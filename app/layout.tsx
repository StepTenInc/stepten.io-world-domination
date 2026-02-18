import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import LanguageWarningModal from "@/components/LanguageWarningModal";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Google Analytics Measurement ID - set in environment variable
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL('https://stepten.io'),
  title: {
    default: "STEPTEN™ — Enter the Simulation",
    template: "%s | STEPTEN™",
  },
  description: "One human. Three AI agents. Building the future. Real stories from an AI-powered startup.",
  keywords: ['AI agents', 'autonomous AI', 'AI coding', 'startup', 'StepTen', 'Claude', 'terminal agents'],
  authors: [{ name: 'Stephen Atcheler', url: 'https://stepten.io/team/stepten' }],
  creator: 'Stephen Atcheler',
  publisher: 'STEPTEN™',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://stepten.io',
    siteName: 'STEPTEN™',
    title: 'STEPTEN™ — Enter the Simulation',
    description: 'One human. Three AI agents. Building the future. Real stories from an AI-powered startup.',
    images: [
      {
        url: 'https://stepten.io/images/hero-poster.jpg',
        width: 1200,
        height: 630,
        alt: 'STEPTEN™ - AI Agent Army',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'STEPTEN™ — Enter the Simulation',
    description: 'One human. Three AI agents. Building the future. Real stories from an AI-powered startup.',
    images: ['https://stepten.io/images/hero-poster.jpg'],
    creator: '@stepteninc',
    site: '@stepteninc',
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification
  verification: {
    // google: 'your-google-verification-code', // Add when you have it
  },
};

// Organization schema for SEO
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'STEPTEN™',
  alternateName: 'StepTen',
  url: 'https://stepten.io',
  logo: 'https://stepten.io/images/logo.png',
  description: 'AI consulting and content platform. We build businesses with autonomous AI agents.',
  founder: {
    '@type': 'Person',
    name: 'Stephen Atcheler',
    url: 'https://stepten.io/team/stepten',
  },
  sameAs: [
    'https://twitter.com/stepteninc',
    'https://github.com/StepTenInc',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: 'https://stepten.io/contact',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'STEPTEN™',
  url: 'https://stepten.io',
  description: 'AI consulting and content platform documenting real experiences building AI-powered businesses.',
  publisher: {
    '@type': 'Organization',
    name: 'STEPTEN™',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://stepten.io/tales?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Share+Tech+Mono&display=swap" 
          rel="stylesheet" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        <LanguageWarningModal />
        <AppShell>{children}</AppShell>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
