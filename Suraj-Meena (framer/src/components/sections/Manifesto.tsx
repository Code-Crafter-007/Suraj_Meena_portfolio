'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import styles from './Manifesto.module.css';

const WORDS = [
  'From', 'raw', 'footage', 'to', 'final', 'cut.',
  'Motion', 'and', 'edits', 'built', 'to', 'hold', 'attention,',
  'move', 'with', 'intent,', 'and', 'feel', 'considered',
  'from', 'music', 'videos', 'to', 'content', 'series', 'to', 'full', 'brand', 'motion.'
];

interface WordProps {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

const WordItem: React.FC<WordProps> = ({ word, index, total, progress }) => {
  // Map this word's active reveal window across section scroll progress
  // Active window between 0.15 and 0.85 of section progress
  const start = 0.15 + (index / total) * 0.7;
  const end = start + (1 / total) * 0.7;

  // Fully reversible scroll color mapping:
  // Before word start: muted opacity / grey color rgba(17, 17, 17, 0.12)
  // After word end: full dark color rgb(17, 17, 17)
  const color = useTransform(
    progress,
    [start, end],
    ['rgba(17, 17, 17, 0.15)', 'rgb(17, 17, 17)']
  );

  return (
    <motion.span style={{ color }} className={styles.word}>
      {word}{' '}
    </motion.span>
  );
};

export const Manifesto: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track section scroll progress through viewport
  // Starts when top of section enters viewport bottom ('start end'), completes when bottom leaves top ('end start')
  // We use ['start 0.8', 'end 0.3'] for perfectly centered scroll engagement
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.35'],
  });

  return (
    <section ref={containerRef} className={styles.quoteSection} id="manifesto">
      <div className={styles.container}>
        <div className={styles.quoteBlock}>
          {WORDS.map((word, idx) => (
            <WordItem
              key={`${word}-${idx}`}
              word={word}
              index={idx}
              total={WORDS.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
