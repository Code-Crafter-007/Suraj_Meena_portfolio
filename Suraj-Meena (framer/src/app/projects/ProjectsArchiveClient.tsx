'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { CmsProject } from '@/types/cms';
import { ProjectCard } from '@/components/ui/ProjectCard';
import styles from './projects.module.css';

interface Props {
  initialProjects: CmsProject[];
}

export default function ProjectsArchiveClient({ initialProjects }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(initialProjects.map((p) => p.category)))];

  const filtered = initialProjects.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  return (
    <section className={styles.archiveSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/" className={styles.breadcrumb}>
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={styles.title}
          >
            All Projects & Works
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={styles.subtitle}
          >
            A curated archive of commercial lifestyle reels, musical visualizers, and impact documentaries.
            Every frame edited with intentional rhythm and motion.
          </motion.p>
        </div>

        {/* Categories Filter */}
        <div className={styles.filterRow}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.filterPill} ${
                selectedCategory === cat ? styles.filterPillActive : ''
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className={styles.grid}>
          {filtered.map((proj, idx) => (
            <ProjectCard
              key={proj.id}
              title={proj.title}
              description={proj.description}
              videoUrl={proj.videoUrl}
              slug={proj.slug}
              delay={idx * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

