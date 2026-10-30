'use client';

import React from 'react';
import styles from './TechBadge.module.css';

interface TechBadgeProps {
  label: string;
  status: 'active' | 'ready' | 'pending';
}

export const TechBadge: React.FC<TechBadgeProps> = ({ label, status }) => {
  return (
    <div className={styles.badge}>
      <span className={`${styles.dot} ${styles[status]}`} />
      <span className={styles.label}>{label}</span>
    </div>
  );
};
