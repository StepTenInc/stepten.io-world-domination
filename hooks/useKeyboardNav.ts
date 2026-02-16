'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const shortcuts: Record<string, string> = {
  h: '/',
  t: '/tales',
  m: '/team',
  o: '/tools',
  c: '/chat',
  a: '/about',
};

export function useKeyboardNav() {
  const router = useRouter();
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing
      const target = e.target as HTMLElement;
      if (target.matches('input, textarea, [contenteditable]')) {
        return;
      }

      // Show shortcuts overlay
      if (e.key === '/' || e.key === '?') {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
        return;
      }

      // Close shortcuts
      if (e.key === 'Escape') {
        setShowShortcuts(false);
        return;
      }

      // Navigation shortcuts
      const href = shortcuts[e.key.toLowerCase()];
      if (href) {
        e.preventDefault();
        router.push(href);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return { showShortcuts, setShowShortcuts };
}
