'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIALS_DATA } from '@/data/testimonials';
import { CmsTestimonial } from '@/types/cms';
import styles from './Testimonials.module.css';

interface TestimonialItem {
  id: string;
  authorName: string;
  authorRole: string;
  quote: string;
  avatarUrl: string;
  companyLogo?: string;
}

interface TestimonialsProps {
  testimonials?: CmsTestimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const displayItems: TestimonialItem[] =
    testimonials !== undefined ? testimonials : TESTIMONIALS_DATA;

  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  // Responsive cards-per-view calculation
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCardsPerView(1);
      } else if (width <= 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, displayItems.length - cardsPerView);
  const clampedIndex = Math.min(activeIndex, maxIndex);

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Calculate card translation percentage
  // Gap is 20px. Each step shifts by 1 card + gap.
  const cardWidthPercent = 100 / cardsPerView;
  const gapOffset = (clampedIndex * 20) / cardsPerView;
  const translateX = -(clampedIndex * cardWidthPercent);

  return (
    <section className={styles.testimonialsSection} id="testimonials">
      <div className={styles.container}>
        {/* Header Row with Title and Minimal Carousel Controls */}
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

          {/* Carousel Arrows */}
          <div className={styles.controlsRow}>
            <button
              type="button"
              onClick={handlePrev}
              disabled={clampedIndex === 0}
              className={`${styles.navButton} ${clampedIndex === 0 ? styles.disabled : ''}`}
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={clampedIndex >= maxIndex}
              className={`${styles.navButton} ${clampedIndex >= maxIndex ? styles.disabled : ''}`}
              aria-label="Next testimonials"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Viewport (Strict Single Row) */}
        <div className={styles.carouselViewport}>
          <motion.div
            ref={trackRef}
            className={styles.carouselTrack}
            animate={{
              x: shouldReduceMotion
                ? `${translateX}%`
                : `calc(${translateX}% - ${gapOffset}px)`,
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 28,
              mass: 0.8,
            }}
            drag={cardsPerView === 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_e, info) => {
              if (info.offset.x > 40 && activeIndex > 0) {
                handlePrev();
              } else if (info.offset.x < -40 && activeIndex < maxIndex) {
                handleNext();
              }
            }}
          >
            {displayItems.map((item) => (
              <div
                key={item.id}
                className={styles.cardItem}
                style={{
                  flex: `0 0 calc(${cardWidthPercent}% - ${(20 * (cardsPerView - 1)) / cardsPerView}px)`,
                }}
              >
                <div className={styles.cardInner}>
                  <div className={styles.cardTop}>
                    <div className={styles.logoSlot}>
                      {Boolean(item.companyLogo) && (
                        <Image
                          src={item.companyLogo!}
                          alt="Client company"
                          width={90}
                          height={24}
                          unoptimized={item.companyLogo!.startsWith('http')}
                          style={{ objectFit: 'contain', height: 24, width: 'auto' }}
                        />
                      )}
                    </div>

                    <div className={styles.quoteScrollArea}>
                      <p className={styles.quoteText}>&ldquo;{item.quote}&rdquo;</p>
                    </div>
                  </div>

                  <div className={styles.authorRow}>
                    {item.avatarUrl && (
                      <div className={styles.avatarWrap}>
                        <Image
                          src={item.avatarUrl}
                          alt={item.authorName}
                          width={40}
                          height={40}
                          unoptimized={item.avatarUrl.startsWith('http')}
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
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
