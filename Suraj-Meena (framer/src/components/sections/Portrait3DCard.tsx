
'use client';

import React from 'react';
import Image from 'next/image';
import { motion, MotionValue } from 'motion/react';
import styles from './HeroBioSection.module.css';

interface Portrait3DCardProps {
  rotateY: MotionValue<number>;
  scale?: MotionValue<number>;
  translateY?: MotionValue<number>;
}

export const Portrait3DCard: React.FC<Portrait3DCardProps> = ({
  rotateY,
  scale,
  translateY,
}) => {
  const portrait = '/assets/images/about/creator-portrait-front.png';

  return (
    <div className={styles.perspectiveWrap}>
      <motion.div
        style={{
          rotateY,
          scale: scale ?? 1,
          translateY: translateY ?? 0,
        }}
        className={styles.card3D}
      >
        {/* FRONT: Same portrait with grayscale filter */}
        <div className={`${styles.face} ${styles.frontFace}`}>
          <Image
            src={portrait}
            alt="Suraj Meena - Grayscale Portrait"
            width={1448}
            height={1086}
            priority
            className={`${styles.portraitImg} ${styles.frontImg}`}
          />
        </div>

        {/* BACK: Original full-colour portrait */}
        <div className={`${styles.face} ${styles.backFace}`}>
          <Image
            src={portrait}  
            alt="Suraj Meena - Colour Portrait"
            width={1448}
            height={1086}
            priority
            className={`${styles.portraitImg} ${styles.backImg}`}
          />
        </div>
      </motion.div>
    </div>
  );
};
