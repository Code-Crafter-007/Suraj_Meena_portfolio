'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import styles from './Bio.module.css';

export const Bio: React.FC = () => {
  return (
    <section className={styles.bioSection} id="bio-section">
      <div className={styles.container}>
        {/* Title & Introduction */}
        <div className={styles.titleAndIntro}>
          <motion.h2
            initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={styles.greeting}
          >
            Hey!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={styles.introStatement}
          >
            I&apos;m Suraj, a motion designer and visual editor based in Gandhinagar,
            currently running Dincharyaaaa — sharing editing and filmmaking with other creatives.
          </motion.p>
        </div>

        {/* Narrative & Action Link */}
        <div className={styles.bodyWrap}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={styles.paragraphs}
          >
            <p>
              I&apos;m a video editor and motion designer with 2+ years of experience since 2024,
              focused on turning raw footage into work that holds attention — from music videos
              to content series to motion graphics.
            </p>
            <p>
              I work across After Effects and Premiere Pro, handling everything from cut and color
              to compositing and title design. I also run Dincharyaaaa, a channel on editing,
              filmmaking, and freelancing for creatives.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={styles.actionWrap}
          >
            <Link href="#contact" className={styles.getStartedButton}>
              <span className={styles.btnText}>Get Started</span>
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
  );
};
