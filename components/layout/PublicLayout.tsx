'use client';

import { Header } from './Header';
import { Footer } from './Footer';
import { MobileDock } from './MobileDock';

interface PublicLayoutProps {
  children: React.ReactNode;
}

/**
 * PublicLayout - Wrapper for all public-facing pages
 * 
 * Provides consistent:
 * - Header with desktop navigation
 * - Footer with links and branding
 * - MobileDock for mobile navigation
 * 
 * Usage:
 * ```tsx
 * export default function SomePage() {
 *   return (
 *     <PublicLayout>
 *       <section>Your content here</section>
 *     </PublicLayout>
 *   );
 * }
 * ```
 */
export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <main>
      <Header />
      {children}
      <Footer />
      <MobileDock />
    </main>
  );
}
