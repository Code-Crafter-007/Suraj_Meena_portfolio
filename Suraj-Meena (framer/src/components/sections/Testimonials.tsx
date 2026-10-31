'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { TESTIMONIALS_DATA } from '@/data/testimonials';
import styles from './Testimonials.module.css';

export const Testimonials: React.FC = () => {
  return (
    <section className={styles.testimonialsSection} id="testimonials">
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <motion.h2
            initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={styles.sectionTitle}
          >
            Testimonials
          </motion.h2>
        </div>

        {/* 4-Card Horizontal Row on Desktop */}
        <div className={styles.cardsRow}>
          {TESTIMONIALS_DATA.map((item, idx) => (
            <motion.div
              key={item.id}
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
                <p className={styles.quoteText}>{item.quote}</p>

                <div className={styles.authorRow}>
                  {item.avatarUrl && (
                    <div className={styles.avatarWrap}>
                      <Image
                        src={item.avatarUrl}
                        alt={item.authorName}
                        width={40}
                        height={40}
                        className={styles.avatarImg}
                      />
                    </div>
                  )}
                  <div className={styles.authorMeta}>
                    <span className={styles.authorName}>{item.authorName}</span>
                    <span className={styles.authorRole}>{item.authorRole}</span>
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
