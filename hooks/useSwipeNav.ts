'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const pageOrder = ['/', '/tales', '/team', '/tools', '/chat', '/about'];

export function useSwipeNav() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const dx = startX - e.changedTouches[0].clientX;
      const dy = Math.abs(startY - e.changedTouches[0].clientY);

      // Need significant horizontal movement, not too much vertical
      if (Math.abs(dx) < 80 || dy > Math.abs(dx) * 0.6) {
        return;
      }

      const currentIndex = pageOrder.indexOf(pathname);
      if (currentIndex === -1) return;

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(6);
      }

      if (dx > 0 && currentIndex < pageOrder.length - 1) {
        // Swipe left → next page
        router.push(pageOrder[currentIndex + 1]);
      } else if (dx < 0 && currentIndex > 0) {
        // Swipe right → previous page
        router.push(pageOrder[currentIndex - 1]);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pathname, router]);
}
