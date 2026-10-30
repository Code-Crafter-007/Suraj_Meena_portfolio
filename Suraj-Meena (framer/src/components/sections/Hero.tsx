'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import styles from './Hero.module.css';

export const Hero: React.FC = () => {
  return (
    <section className={styles.heroSection} id="hero-section">
      <div className={styles.container}>
        {/* Main Title Group with Floating 3D Objects */}
        <div className={styles.titleWrap}>
          {/* Top Left Floating 3D Object */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={styles.holoTopLeft}
          >
            <motion.div
              animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
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

          {/* Primary Massive Editorial Title */}
          <h1 className={styles.headline}>
            <span className={styles.wordWrap}>
              <motion.span
                initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={styles.word}
              >
                VISUAL
              </motion.span>
            </span>
            <span className={styles.wordWrap}>
              <motion.span
                initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={styles.word}
              >
                EDITOR
              </motion.span>
            </span>
          </h1>

          {/* Bottom Right Floating 3D Object */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={styles.holoBottomRight}
          >
            <motion.div
              animate={{ y: [4, -4, 4], rotate: [2, -2, 2] }}
              transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
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

        {/* Creator Portrait Composition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={styles.avatarCard}
        >
          <div className={styles.portraitWrap}>
            <Image
              src="/assets/images/about/creator-portrait-front.png"
              alt="Portrait of Suraj Meena"
              width={1448}
              height={1086}
              priority
              className={styles.portraitImg}
            />
          </div>
        </motion.div>

        {/* Bottom Information Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className={styles.bottomInfo}
        >
          <div className={styles.infoLeft}>
            <span className={styles.copyright}>©2026</span>
          </div>
          <div className={styles.infoRight}>
            <span className={styles.creatingSince}>/CREATING SINCE 2024</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
