'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import styles from './Navbar.module.css';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/#hero-section' },
  { label: 'About Me', href: '/#bio-section' },
  { label: 'Services', href: '/#services' },
  { label: 'Works', href: '/projects' },
  { label: 'Contact', href: '/#contact' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <header className={styles.headerWrapper}>
      <motion.nav
        initial={shouldReduceMotion ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: shouldReduceMotion ? 0.01 : 0.65,
          delay: shouldReduceMotion ? 0 : 2.18,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={styles.navPill}
      >
        <div className={styles.bar}>
          <Link href="/#hero-section" className={styles.brandName}>
            <span className={styles.rollTrack}>
              <span className={styles.rollFace}>Suraj</span>
              <span className={styles.rollBack} aria-hidden="true">
                Suraj
              </span>
            </span>
          </Link>

          <button
            type="button"
            className={`${styles.menuButton} ${isOpen ? styles.active : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={styles.menuDropdown}
            >
              <ul className={styles.navList}>
                {NAV_ITEMS.map((item, idx) => (
                  <motion.li
                    key={item.label}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05, duration: 0.25 }}
                    className={styles.navItem}
                  >
                    <Link
                      href={item.href}
                      className={styles.navLink}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className={styles.rollTrack}>
                        <span className={styles.rollFace}>{item.label}</span>
                        <span className={styles.rollBack} aria-hidden="true">
                          {item.label}
                        </span>
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
};
