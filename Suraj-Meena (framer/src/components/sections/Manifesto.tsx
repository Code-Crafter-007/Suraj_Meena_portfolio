'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from 'motion/react';
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
  shouldReduceMotion: boolean | null;
}

const WordItem: React.FC<WordProps> = ({
  word,
  index,
  total,
  progress,
  shouldReduceMotion,
}) => {
  // Stagger words across the scroll-progress window [0.04, 0.84]
  // With 1.85 overlap for cinematic editorial continuity
  // All words reach 100% sharpness and full opacity by ~0.84,
  // providing a comfortable reading pause [0.84 -> 1.0] before release
  const step = 0.78 / total;
  const start = 0.04 + index * step;
  const end = Math.min(0.86, start + step * 1.85);

  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const blur = useTransform(progress, [start, end], [8, 0]);
  const filter = useTransform(blur, (v) => `blur(${v.toFixed(1)}px)`);
  const y = useTransform(progress, [start, end], [6, 0]);

  if (shouldReduceMotion) {
    return <span className={styles.word}>{word} </span>;
  }

  return (
    <motion.span
      style={{
        opacity,
        filter,
        y,
      }}
      className={styles.word}
    >
      {word}{' '}
    </motion.span>
  );
};

export const Manifesto: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Track sticky scroll progress from the moment the track enters top of viewport (start start)
  // until the 240vh track finishes scrolling (end end)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section ref={trackRef} className={styles.stickyTrack} id="manifesto">
      <div className={styles.stickyViewport}>
        <div className={styles.container}>
          <div className={styles.quoteBlock}>
            {WORDS.map((word, idx) => (
              <WordItem
                key={`${word}-${idx}`}
                word={word}
                index={idx}
                total={WORDS.length}
                progress={scrollYProgress}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
