'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import styles from './Footer.module.css';
import { SITE_METADATA } from '@/data/site';
import { InteractiveWordmark } from './InteractiveWordmark';

const CURRENT_YEAR = 2026;

export const Footer: React.FC = () => {
  const quickLinks = [
    { label: 'Home', href: '/#hero-section' },
    { label: 'About Me', href: '/#bio-section' },
    { label: 'Services', href: '/#services' },
    { label: 'Works', href: '/projects' },
    { label: 'Contact', href: '/#contact' },
  ];

  const socialLinks = [
    { label: 'Instagram', href: SITE_METADATA.socials.instagramPersonal },
    { label: 'YouTube', href: SITE_METADATA.socials.youtube },
    { label: 'LinkedIn', href: SITE_METADATA.socials.linkedin },
    { label: 'X (Twitter)', href: SITE_METADATA.socials.twitter },
  ];

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        {/* Top Section */}
        <div className={styles.topRow}>
          <motion.div
            initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={styles.headingWrap}
          >
            <h2 className={styles.heading}>Helping Brands Stand Out.</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={styles.columns}
          >
            {/* Quick Links Column */}
            <div className={styles.column}>
              <h4 className={styles.colTitle}>/Quick links</h4>
              <nav className={styles.linksNav} aria-label="Footer Quick Links">
                {quickLinks.map((item) => (
                  <Link key={item.label} href={item.href} className={styles.quickLink}>
                    <span className={styles.quickLinkText}>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact & Social Column */}
            <div className={styles.column}>
              <h4 className={styles.colTitle}>/Contact</h4>
              <div className={styles.contactLinks}>
                <a href={`mailto:${SITE_METADATA.email}`} className={styles.mailLink}>
                  {SITE_METADATA.email}
                </a>

                <div className={styles.socialRow}>
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Interactive SURAJ Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <InteractiveWordmark />
        </motion.div>

        {/* Bottom Credits & Copyright */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {CURRENT_YEAR} {SITE_METADATA.creator}. All rights reserved.
          </p>
          <p className={styles.location}>
            Based in {SITE_METADATA.location}
          </p>
        </div>
      </div>
    </footer>
  );
};
