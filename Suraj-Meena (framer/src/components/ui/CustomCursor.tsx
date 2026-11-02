'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './CustomCursor.module.css';

export const CustomCursor: React.FC = () => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  const containerRef = useRef<HTMLDivElement>(null);
  const hLineRef = useRef<HTMLDivElement>(null);
  const vLineRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLDivElement>(null);

  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Disable in Admin CMS or on non-fine-pointer devices
    if (isAdmin) return;

    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer || prefersReducedMotion) return;

    // Enabled for desktop viewport
    const container = containerRef.current;
    if (!container) return;

    setIsEnabled(true);

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let isVisible = false;
    let rafId: number | null = null;

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        container.classList.add(styles.locatorVisible);
      }
    };

    const onPointerLeave = () => {
      isVisible = false;
      container.classList.remove(styles.locatorVisible);
    };

    const onPointerEnter = () => {
      isVisible = true;
      container.classList.add(styles.locatorVisible);
    };

    const updatePosition = () => {
      // Smooth interpolation for subtle fluidity without cursor drag lag
      const lerpFactor = 0.5;
      currentX += (mouseX - currentX) * lerpFactor;
      currentY += (mouseY - currentY) * lerpFactor;

      const roundedX = Math.round(currentX);
      const roundedY = Math.round(currentY);

      if (hLineRef.current) {
        hLineRef.current.style.transform = `translate3d(0, ${roundedY}px, 0)`;
      }
      if (vLineRef.current) {
        vLineRef.current.style.transform = `translate3d(${roundedX}px, 0, 0)`;
      }
      if (markerRef.current) {
        markerRef.current.style.transform = `translate3d(${roundedX}px, ${roundedY}px, 0)`;
      }
      if (coordsRef.current) {
        coordsRef.current.style.transform = `translate3d(${roundedX}px, ${roundedY}px, 0)`;
        coordsRef.current.textContent = `X:${roundedX} Y:${roundedY}`;
      }

      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    document.addEventListener('mouseenter', onPointerEnter);

    rafId = requestAnimationFrame(updatePosition);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      document.removeEventListener('mouseenter', onPointerEnter);
    };
  }, [isAdmin]);

  if (isAdmin) return null;

  return (
    <div
      ref={containerRef}
      className={styles.locatorContainer}
      aria-hidden="true"
      style={{ display: isEnabled ? 'block' : 'none' }}
    >
      <div ref={hLineRef} className={styles.hLine} />
      <div ref={vLineRef} className={styles.vLine} />
      <div ref={markerRef} className={styles.marker}>
        <div className={styles.markerDot} />
      </div>
      <div ref={coordsRef} className={styles.coords} />
    </div>
  );
};

