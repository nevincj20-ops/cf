import { useEffect } from 'react';

/**
 * High-performance global cursor tracking system
 * Uses requestAnimationFrame and updates CSS variables on the document root
 * strictly avoiding React state re-renders for cursor animation.
 * Complies with Section 28 & Section 41 (60 FPS target).
 */
export function useCursorPhysics() {
  useEffect(() => {
    // Check for reduced motion preference or touch devices
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (prefersReducedMotion || isTouchDevice) {
      document.documentElement.style.setProperty('--mouse-x', '50%');
      document.documentElement.style.setProperty('--mouse-y', '50%');
      document.documentElement.style.setProperty('--cursor-active', '0');
      return;
    }

    let rafId: number | null = null;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    document.documentElement.style.setProperty('--cursor-active', '1');

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(updateCursor);
      }
    };

    const updateCursor = () => {
      // Smooth interpolation for fluid light movement
      const ease = 0.15;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      document.documentElement.style.setProperty('--mouse-x', `${currentX.toFixed(1)}px`);
      document.documentElement.style.setProperty('--mouse-y', `${currentY.toFixed(1)}px`);

      // Keep updating until converged
      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        rafId = requestAnimationFrame(updateCursor);
      } else {
        rafId = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);
}
