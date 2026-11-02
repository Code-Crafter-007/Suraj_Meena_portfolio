'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { CmsProcessStep } from '@/types/cms';
import { resolveMediaUrl } from '@/lib/mediaResolver';
import styles from './CreativeProcess.module.css';

interface CreativeProcessProps {
  heading?: string;
  intro?: string;
  steps?: CmsProcessStep[];
}

export const CreativeProcess: React.FC<CreativeProcessProps> = ({
  heading,
  intro,
  steps,
}) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  // Sort steps consistently
  const sortedSteps = [...steps].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <section className={styles.processSection} aria-label="Creative Process">
      <div className={styles.container}>
        {/* Editorial Section Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Case Study &amp; Directorial Breakdown</span>
          <h2 className={styles.sectionTitle}>
            {heading || 'Creative Process & Directorial Method'}
          </h2>
          {intro && <p className={styles.sectionIntro}>{intro}</p>}
        </div>

        {/* Steps List */}
        <div className={styles.stepsList}>
          {sortedSteps.map((step, idx) => {
            const stepNum = String(idx + 1).padStart(2, '0');
            const mediaResolved = step.mediaUrl ? resolveMediaUrl(step.mediaUrl) : null;
            const isVideo =
              step.mediaType === 'video' ||
              (mediaResolved && (mediaResolved.isVideo || mediaResolved.provider === 'youtube' || mediaResolved.provider === 'vimeo'));

            return (
              <motion.div
                key={step.id || `step-${idx}`}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={styles.stepCard}
              >
                {/* Meta details */}
                <div className={styles.stepMeta}>
                  <div className={styles.stepHeaderRow}>
                    <span className={styles.stepBadge}>Stage {stepNum}</span>
                  </div>

                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>

                {/* Media Surface */}
                {step.mediaUrl && mediaResolved && (
                  <div className={styles.stepMediaWrapper}>
                    <div className={styles.mediaFrame}>
                      {mediaResolved.provider === 'youtube' || mediaResolved.provider === 'vimeo' ? (
                        <iframe
                          src={mediaResolved.embedUrl}
                          title={step.title}
                          className={styles.mediaIframe}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : isVideo ? (
                        <video
                          src={step.mediaUrl}
                          poster={step.posterUrl}
                          controls
                          playsInline
                          preload="metadata"
                          className={styles.mediaVideo}
                        />
                      ) : (
                        <Image
                          src={step.mediaUrl}
                          alt={step.title}
                          width={1200}
                          height={675}
                          unoptimized={step.mediaUrl.startsWith('http')}
                          className={styles.mediaImage}
                        />
                      )}
                    </div>

                    {step.caption && (
                      <p className={styles.mediaCaption}>{step.caption}</p>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

