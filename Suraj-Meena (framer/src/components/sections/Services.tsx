'use client';

import React from 'react';
import { motion } from 'motion/react';
import styles from './Services.module.css';

interface ServiceItem {
  title: string;
  categories: string[];
}

const SERVICES: ServiceItem[] = [
  {
    title: 'Motion Graphics',
    categories: ['Title Design', 'Kinetic Type', 'Compositing'],
  },
  {
    title: 'Video Editing',
    categories: ['Music Videos', 'Content Series', 'Colour Grading'],
  },
  {
    title: 'Social Media Reels',
    categories: ['Short-Form Cuts', 'Brand Content', 'Fast Turnaround'],
  },
  {
    title: 'Motion Design & VFX',
    categories: ['Particle Systems', 'Visual Effects', 'Brand Motion'],
  },
];

export const Services: React.FC = () => {
  return (
    <section className={styles.servicesSection} id="services">
      <div className={styles.container}>
        <motion.h2
          initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={styles.sectionTitle}
        >
          Services
        </motion.h2>

        <div className={styles.servicesList}>
          {SERVICES.map((srv, idx) => (
            <motion.div
              key={srv.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.65,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={styles.serviceRow}
            >
              <h3 className={styles.serviceTitle}>{srv.title}</h3>
              <div className={styles.categoriesWrap}>
                {srv.categories.map((cat, catIdx) => (
                  <React.Fragment key={cat}>
                    <span className={styles.categoryName}>{cat}</span>
                    {catIdx < srv.categories.length - 1 && (
                      <span className={styles.dot} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
