import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StepTen - AI is the Creator's Dream",
  description: "I replaced my dev team with AI agents. Not because I hate people. Because I love building, and now I can build anything.",
  openGraph: {
    title: "StepTen - AI is the Creator's Dream",
    description: "I replaced my dev team with AI agents. Not because I hate people. Because I love building.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StepTen - AI is the Creator's Dream",
    description: "I replaced my dev team with AI agents. Not because I hate people. Because I love building.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
