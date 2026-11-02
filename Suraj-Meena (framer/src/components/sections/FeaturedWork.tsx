'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { PROJECTS_DATA } from '@/data/projects';
import { CmsProject } from '@/types/cms';
import styles from './FeaturedWork.module.css';

interface WorkItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  slug?: string;
}

interface FeaturedWorkProps {
  projects?: CmsProject[];
}

export const FeaturedWork: React.FC<FeaturedWorkProps> = ({ projects }) => {
  const displayProjects: WorkItem[] =
    projects && projects.length > 0 ? projects : PROJECTS_DATA;

  return (
    <section className={styles.projectsSection} id="work-section">
      <div className={styles.container}>
        {/* Title & View All Action */}
        <div className={styles.headerRow}>
          <motion.h2
            initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={styles.sectionTitle}
          >
            <span>Featured</span>
            <br />
            <span>Projects</span>
          </motion.h2>

          <Link href="/projects" className={styles.viewAllButton}>
            <span className={styles.btnText}>View All Work</span>
            <div className={styles.arrowIconWrap}>
              <span className={styles.arrowBg} />
              <svg
                className={styles.arrowSvg}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Project Video Cards Grid */}
        <div className={styles.projectsGrid}>
          {displayProjects.map((project, idx) => {
            const projectSlug = project.slug || project.id;
            return (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                videoUrl={project.videoUrl}
                slug={projectSlug}
                delay={idx * 0.1}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
