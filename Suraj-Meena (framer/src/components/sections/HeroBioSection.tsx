
'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'motion/react';

import { Portrait3DCard } from './Portrait3DCard';
import styles from './HeroBioSection.module.css';

export const HeroBioSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // --------------------------------------------------
  // SCROLL-BASED PORTRAIT FLIP MATHEMATICS
  // --------------------------------------------------

  // Progress at which the flip rotation (0 -> 180 deg) completes.
  // Must always be <= 0.85 so that rotation finishes reliably before the section ends,
  // preventing the card from remaining tilted on viewports with height <= 800px.
  const [flipEndProgress, setFlipEndProgress] = useState(0.75);

  useEffect(() => {
    const updateFlipDistance = () => {
      const vh = window.innerHeight || 800;
      // Target a deliberate flip travel (~650px), clamped safely between 0.55 and 0.85.
      // This guarantees that rotation reaches exactly 180° on every screen size (including <= 800px)
      // while leaving ample scroll progress for the settled card to be viewed inside Bio.
      const raw = 650 / vh;
      const clamped = Math.min(0.85, Math.max(0.55, raw));
      setFlipEndProgress(clamped);
    };

    updateFlipDistance();

    window.addEventListener('resize', updateFlipDistance);

    return () => {
      window.removeEventListener('resize', updateFlipDistance);
    };
  }, []);

  // Track scrolling within the combined Hero + Bio wrapper.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Rotation: grayscale front → edge-on → colour back.
  const rotateYRaw = useTransform(
    scrollYProgress,
    [0, flipEndProgress],
    [0, 180],
    { clamp: true }
  );

  // Portrait grows as it transitions into the Bio section.
  const scaleRaw = useTransform(
    scrollYProgress,
    [0, flipEndProgress],
    [0.58, 1],
    { clamp: true }
  );

  // Slight vertical movement during the transition.
  const translateYRaw = useTransform(
    scrollYProgress,
    [0, flipEndProgress],
    [-20, 0],
    { clamp: true }
  );

  // Smooth, responsive spring animation (bypassed when prefers-reduced-motion is active).
  const springConfig = {
    stiffness: 180,
    damping: 30,
    mass: 0.25,
  };

  const rotateYSpring = useSpring(rotateYRaw, springConfig);
  const scaleSpring = useSpring(scaleRaw, springConfig);
  const translateYSpring = useSpring(translateYRaw, springConfig);

  const rotateY = shouldReduceMotion ? rotateYRaw : rotateYSpring;
  const scale = shouldReduceMotion ? scaleRaw : scaleSpring;
  const translateY = shouldReduceMotion ? translateYRaw : translateYSpring;

  return (
    <div ref={containerRef} className={styles.heroBioWrapper}>

      {/* ================= HERO SECTION ================= */}
      <section className={styles.heroSection} id="hero-section">
        <div className={styles.heroContainer}>

          <div className={styles.titleWrap}>

            {/* Top-left floating ornament */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.9,
                delay: shouldReduceMotion ? 0 : 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={styles.holoTopLeft}
            >
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: [-4, 4, -4],
                        rotate: [-2, 2, -2],
                      }
                }
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: 'easeInOut',
                }}
                className={styles.holoImageWrap}
              >
                <Image
                  src="/assets/images/hero/holo-ribbon-3d.png"
                  alt="3D Holographic Ribbon"
                  width={2550}
                  height={2550}
                  priority
                  className={styles.holoImg}
                />
              </motion.div>
            </motion.div>

            {/* Main headline */}
            <h1 className={styles.headline}>
              <span className={styles.wordWrap}>
                <motion.span
                  initial={
                    shouldReduceMotion
                      ? { opacity: 1, y: 0, filter: 'none' }
                      : { opacity: 0, y: 18, filter: 'blur(4px)' }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                  }}
                  transition={{
                    duration: shouldReduceMotion ? 0.01 : 0.8,
                    delay: shouldReduceMotion ? 0 : 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={styles.word}
                >
                  VISUAL
                </motion.span>
              </span>

              <span className={styles.wordWrap}>
                <motion.span
                  initial={
                    shouldReduceMotion
                      ? { opacity: 1, y: 0, filter: 'none' }
                      : { opacity: 0, y: 18, filter: 'blur(4px)' }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                  }}
                  transition={{
                    duration: shouldReduceMotion ? 0.01 : 0.8,
                    delay: shouldReduceMotion ? 0 : 0.25,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={styles.word}
                >
                  EDITOR
                </motion.span>
              </span>
            </h1>

            {/* Bottom-right floating ornament */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.9,
                delay: shouldReduceMotion ? 0 : 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={styles.holoBottomRight}
            >
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: [4, -4, 4],
                        rotate: [2, -2, 2],
                      }
                }
                transition={{
                  repeat: Infinity,
                  duration: 7,
                  ease: 'easeInOut',
                }}
                className={styles.holoImageWrap}
              >
                <Image
                  src="/assets/images/hero/holo-triangle-3d.png"
                  alt="3D Holographic Triangle"
                  width={2550}
                  height={2550}
                  priority
                  className={styles.holoImg}
                />
              </motion.div>
            </motion.div>

          </div>

          {/* Bottom information row */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.8, delay: shouldReduceMotion ? 0 : 0.5 }}
            className={styles.bottomInfo}
          >
            <div className={styles.infoLeft}>
              <span className={styles.copyright}>
                ©2026
              </span>
            </div>

            <div className={styles.infoRight}>
              <span className={styles.creatingSince}>
                /CREATING SINCE 2024
              </span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ================= STICKY 3D PORTRAIT ================= */}
      <div className={styles.stickyAvatarWrap}>
        <div className={styles.stickyContainer}>
          <div className={styles.avatarWrap}>
            <Portrait3DCard
              rotateY={rotateY}
              scale={scale}
              translateY={translateY}
            />
          </div>
        </div>
      </div>

      {/* ================= BIO SECTION ================= */}
      <section className={styles.bioSection} id="bio-section">
        <div className={styles.bioContainer}>

          {/* Left column */}
          <div className={styles.bioLeftCol}>

            <motion.h2
              initial={
                shouldReduceMotion
                  ? { opacity: 1, y: 0, filter: 'none' }
                  : { opacity: 0, y: 15, filter: 'blur(8px)' }
              }
              whileInView={{
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
              }}
              viewport={{
                once: true,
                margin: '-80px',
              }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={styles.greeting}
            >
              Hey!
            </motion.h2>

            <motion.p
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                margin: '-80px',
              }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.8,
                delay: shouldReduceMotion ? 0 : 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={styles.introStatement}
            >
              I&apos;m Suraj, a motion designer and visual editor based in Gandhinagar,
              currently running Dincharyaaaa — sharing editing and filmmaking
              with other creatives.
            </motion.p>

          </div>

          {/* Center portrait spacer */}
          <div
            className={styles.bioCenterColSpacer}
            aria-hidden="true"
          />

          {/* Right column */}
          <div className={styles.bioRightCol}>

            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                margin: '-80px',
              }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.8,
                delay: shouldReduceMotion ? 0 : 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={styles.paragraphs}
            >
              <p>
                I&apos;m a video editor and motion designer with 2+ years
                of experience since 2024, focused on turning raw footage
                into work that holds attention — from music videos to
                content series to motion graphics.
              </p>

              <p>
                I work across After Effects and Premiere Pro, handling
                everything from cut and color to compositing and title
                design. I also run Dincharyaaaa, a channel on editing,
                filmmaking, and freelancing for creatives.
              </p>
            </motion.div>

            {/* Get started CTA */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                margin: '-80px',
              }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.8,
                delay: shouldReduceMotion ? 0 : 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={styles.actionWrap}
            >
              <Link
                href="#contact"
                className={styles.getStartedButton}
              >
                <span className={styles.btnText}>
                  Get Started
                </span>

                <div className={styles.arrowIconWrap}>
                  <span className={styles.arrowBg} />

                  <svg
                    className={styles.arrowSvg}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
};
