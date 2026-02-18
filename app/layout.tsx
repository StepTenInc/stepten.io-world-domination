import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import LanguageWarningModal from "@/components/LanguageWarningModal";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "STEPTEN™ — Enter the Simulation",
  description: "Cyberpunk universe. Comic art. Matrix vibes. 86-2000 nostalgia.",
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
