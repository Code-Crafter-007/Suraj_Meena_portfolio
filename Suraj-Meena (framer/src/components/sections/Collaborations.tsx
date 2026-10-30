'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { COLLABORATIONS_DATA } from '@/data/testimonials';
import styles from './Collaborations.module.css';

export const Collaborations: React.FC = () => {
  return (
    <section className={styles.collaborationsSection} id="collaborations">
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <motion.h2
            initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={styles.sectionTitle}
          >
            Selected Collaborations
          </motion.h2>
        </div>

        {/* 4-Card Perspective Grid matching original Framer Testimonials layout */}
        <div className={styles.cardsGrid}>
          {COLLABORATIONS_DATA.map((collab, idx) => (
            <motion.div
              key={collab.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.65,
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={styles.cardItem}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardHeader}>
                  <div className={styles.projectIcon}>
                    <Image
                      src={collab.visualUrl}
                      alt={collab.projectTitle}
                      width={48}
                      height={48}
                      className={styles.iconImg}
                    />
                  </div>
                  <div className={styles.headerMeta}>
                    <span className={styles.focusLabel}>{collab.focus}</span>
                    <h3 className={styles.projectTitle}>{collab.projectTitle}</h3>
                  </div>
                </div>

                <p className={styles.descriptionText}>{collab.description}</p>

                <div className={styles.footerRow}>
                  <span className={styles.roleLabel}>{collab.role}</span>
                  <div className={styles.toolsTagList}>
                    {collab.tools.map((t) => (
                      <span key={t} className={styles.toolTag}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
