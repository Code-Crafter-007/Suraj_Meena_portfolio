'use client';

import React from 'react';
import { motion } from 'motion/react';
import styles from './Manifesto.module.css';

const WORDS = [
  'From', 'raw', 'footage', 'to', 'final', 'cut.',
  'Motion', 'and', 'edits', 'built', 'to', 'hold', 'attention,',
  'move', 'with', 'intent,', 'and', 'feel', 'considered',
  'from', 'music', 'videos', 'to', 'content', 'series', 'to', 'full', 'brand', 'motion.'
];

export const Manifesto: React.FC = () => {
  return (
    <section className={styles.quoteSection}>
      <div className={styles.container}>
        <div className={styles.quoteBlock}>
          {WORDS.map((word, idx) => (
            <motion.span
              key={`${word}-${idx}`}
              initial={{ color: 'rgba(0, 0, 0, 0.12)' }}
              whileInView={{ color: 'rgb(17, 17, 17)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.3,
                delay: idx * 0.025,
                ease: 'linear',
              }}
              className={styles.word}
            >
              {word}{' '}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};
