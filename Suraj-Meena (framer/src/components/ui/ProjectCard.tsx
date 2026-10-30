'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  title: string;
  description: string;
  videoUrl: string;
  delay?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  videoUrl,
  delay = 0,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Viewport-aware autoplay / pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay policy fallback
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={styles.cardContainer}
    >
      <div className={styles.projectCard}>
        {/* 9:16 Video Wrapper */}
        <div className={styles.imageWrap}>
          <video
            ref={videoRef}
            src={videoUrl}
            loop
            muted
            playsInline
            preload="none"
            className={styles.video}
          />
        </div>

        {/* Title & Description */}
        <div className={styles.metaWrap}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </motion.div>
  );
};
