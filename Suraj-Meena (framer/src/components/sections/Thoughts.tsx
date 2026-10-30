'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { THOUGHTS_ARTICLES } from '@/data/thoughts';
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

        {/* Articles List / Grid */}
        <div className={styles.articlesList}>
          {THOUGHTS_ARTICLES.map((article, idx) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.65,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={styles.articleCard}
            >
              <div className={styles.imageWrap}>
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  width={640}
                  height={360}
                  className={styles.coverImg}
                />
              </div>

              <div className={styles.contentWrap}>
                <div className={styles.metaRow}>
                  <span className={styles.categoryBadge}>{article.category}</span>
                  <span className={styles.readingTime}>{article.readingTime}</span>
                </div>

                <h3 className={styles.articleTitle}>{article.title}</h3>
                <p className={styles.subtitle}>{article.subtitle}</p>
                <p className={styles.summary}>{article.summary}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
