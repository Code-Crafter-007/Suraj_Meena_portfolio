'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import styles from './Thoughts.module.css';

export const Thoughts: React.FC = () => {
  return (
    <section className={styles.thoughtsSection} id="thoughts">
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <motion.h2
            initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={styles.sectionTitle}
          >
            Thoughts
          </motion.h2>
        </div>

        {/* 3-Card Desktop Editorial Grid */}
        <div className={styles.cardsGrid}>
          {/* Card 1: Building Trust Through Clear Design */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={styles.articleCard}
          >
            <div className={styles.imageWrap}>
              <Image
                src="/assets/images/articles/clear-design-post.png"
                alt="Building Trust Through Clear Design"
                width={640}
                height={360}
                className={styles.coverImg}
              />
              <div className={styles.cardOverlay}>
                <span className={styles.dateLabel}>May 5, 2025</span>
                <h3 className={styles.articleTitle}>
                  Building Trust
                  <br />
                  Through Clear Design
                </h3>
                <p className={styles.articleSubtitle}>
                  How thoughtful visual choices create a stronger sense of reliability for modern brands.
                </p>
              </div>
            </div>
          </motion.article>

          {/* Card 2: The Role of Art Direction in Branding */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={styles.articleCard}
          >
            <div className={styles.imageWrap}>
              <Image
                src="/assets/images/articles/art-direction-post.png"
                alt="The Role of Art Direction in Branding"
                width={640}
                height={360}
                className={styles.coverImg}
              />
              <div className={styles.cardOverlay}>
                <span className={styles.dateLabel}>Jun 16, 2025</span>
                <h3 className={styles.articleTitle}>
                  The Role of Art
                  <br />
                  Direction in Branding
                </h3>
                <p className={styles.articleSubtitle}>
                  Why visual direction helps brands create emotion and a distinct point of view.
                </p>
              </div>
            </div>
          </motion.article>

          {/* Card 3: Solid Black Editorial Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={styles.ctaCard}
          >
            <div className={styles.ctaCardInner}>
              <h3 className={styles.ctaHeading}>
                See how we
                <br />
                shape brands
                <br />
                with clarity and
                <br />
                craft— explore
                <br />
                our blog
              </h3>

              <Link href="#work-section" className={styles.ctaButton}>
                <span className={styles.btnText}>View All Work</span>
                <div className={styles.arrowIconWrap}>
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
