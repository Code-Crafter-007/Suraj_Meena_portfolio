'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { TechBadge } from '@/components/ui/TechBadge';
import { PROJECTS_DATA } from '@/data/projects';
import styles from './page.module.css';

export default function VerificationPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={styles.card}
        >
          <div className={styles.header}>
            <div className={styles.eyebrow}>
              <Terminal size={16} className={styles.iconCyan} />
              <span>PHASE 1 — TECHNICAL FOUNDATION</span>
            </div>
            <h1 className={styles.title}>
              SURAJ MEENA <span className={styles.titleHighlight}>PORTFOLIO</span>
            </h1>
            <p className={styles.subtitle}>
              Technical architecture initialized. Design tokens, typography variables, App Router, Motion, and project data models are active.
            </p>
          </div>

          <div className={styles.divider} />

          <div className={styles.grid}>
            <div className={styles.statusBox}>
              <h2 className={styles.boxTitle}>
                <CheckCircle2 size={18} className={styles.iconViolet} /> Stack Verification
              </h2>
              <div className={styles.badgeList}>
                <TechBadge label="Next.js 16 (App Router)" status="active" />
                <TechBadge label="TypeScript (Strict)" status="active" />
                <TechBadge label="CSS Design Tokens" status="active" />
                <TechBadge label="Motion for React" status="ready" />
                <TechBadge label="GSAP Core" status="ready" />
                <TechBadge label="Lucide React Icons" status="ready" />
              </div>
            </div>

            <div className={styles.statusBox}>
              <h2 className={styles.boxTitle}>
                <Sparkles size={18} className={styles.iconPink} /> Data Hydration Check
              </h2>
              <p className={styles.boxDesc}>
                {PROJECTS_DATA.length} flagship video projects loaded from data layer with original CDN assets.
              </p>
              <ul className={styles.projectList}>
                {PROJECTS_DATA.map((p) => (
                  <li key={p.id} className={styles.projectItem}>
                    <span className={styles.projectName}>{p.title}</span>
                    <span className={styles.projectCategory}>{p.category}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.footerNote}>
            <span>Awaiting user approval before initiating Phase 2 (Layout & Navigation).</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
