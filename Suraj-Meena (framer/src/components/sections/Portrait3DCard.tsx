'use client';

import React from 'react';
import Image from 'next/image';
import { motion, MotionValue } from 'motion/react';
import styles from './HeroBioSection.module.css';

interface Portrait3DCardProps {
  rotateY: MotionValue<number>;
  scale?: MotionValue<number>;
  translateY?: MotionValue<number>;
  frontImgUrl?: string;
  backImgUrl?: string;
}

export const Portrait3DCard: React.FC<Portrait3DCardProps> = ({
  rotateY,
  scale,
  translateY,
  frontImgUrl,
  backImgUrl,
}) => {
  const frontImg = frontImgUrl || '/assets/images/about/creator-portrait-front.png';
  const backImg = backImgUrl || frontImg;

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
        {/* FRONT: Front face portrait with grayscale styling */}
        <div className={`${styles.face} ${styles.frontFace}`}>
          <Image
            src={frontImg}
            alt="Suraj Meena - Grayscale Portrait"
            width={1448}
            height={1086}
            priority
            unoptimized={frontImg.startsWith('http')}
            className={`${styles.portraitImg} ${styles.frontImg}`}
          />
        </div>

        {/* BACK: Full-colour portrait */}
        <div className={`${styles.face} ${styles.backFace}`}>
          <Image
            src={backImg}
            alt="Suraj Meena - Colour Portrait"
            width={1448}
            height={1086}
            priority
            unoptimized={backImg.startsWith('http')}
            className={`${styles.portraitImg} ${styles.backImg}`}
          />
        </div>
      </motion.div>
    </div>
  );
};
