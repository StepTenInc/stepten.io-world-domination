import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/lib/posthog";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StepTen.io | Builder. Investor. AI & Automation Obsessed.",
    template: "%s | StepTen.io",
  },
  description:
    "Personal brand hub of an entrepreneur with 20+ years experience. Discover businesses, products, services, and AI-powered content.",
  keywords: [
    "entrepreneur",
    "AI",
    "automation",
    "business",
    "consulting",
    "ShoreAgents",
    "BPO",
  ],
  authors: [{ name: "StepTen" }],
  creator: "StepTen",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stepten.io",
    siteName: "StepTen.io",
    title: "StepTen.io | Builder. Investor. AI & Automation Obsessed.",
    description:
      "Personal brand hub of an entrepreneur with 20+ years experience.",
    images: [
      {
        url: "/images/stepten-logo.png",
        width: 512,
        height: 512,
        alt: "StepTen Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StepTen.io",
    description:
      "Personal brand hub of an entrepreneur with 20+ years experience.",
    images: ["/images/stepten-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
