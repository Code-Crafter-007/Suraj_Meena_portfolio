import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { SITE_METADATA } from '@/data/site';

const CURRENT_YEAR = 2026;

export const Footer: React.FC = () => {
  const quickLinks = [
    { label: 'Home', href: '/#hero-section' },
    { label: 'About Me', href: '/#bio-section' },
    { label: 'Services', href: '/#services' },
    { label: 'Works', href: '/#work-section' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        {/* Top Section */}
        <div className={styles.topRow}>
          <div className={styles.headingWrap}>
            <h2 className={styles.heading}>Helping Brands Stand Out.</h2>
          </div>

          <div className={styles.columns}>
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

            {/* Contact Column */}
            <div className={styles.column}>
              <h4 className={styles.colTitle}>/Contact</h4>
              <div className={styles.contactLinks}>
                <a href={`mailto:${SITE_METADATA.email}`} className={styles.mailLink}>
                  {SITE_METADATA.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Massive SURAJ Wordmark */}
        <div className={styles.wordmarkWrap} aria-hidden="true">
          <p className={styles.wordmark}>SURAJ</p>
        </div>

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
