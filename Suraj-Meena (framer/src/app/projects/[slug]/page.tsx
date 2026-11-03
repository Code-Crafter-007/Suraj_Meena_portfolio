import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProjects, getProjectBySlug, getProjectMedia } from '@/lib/cms';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { CinematicVideoCarousel } from '@/components/ui/CinematicVideoCarousel';
import { CreativeProcess } from '@/components/sections/CreativeProcess';
import styles from './projectDetail.module.css';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects(false);
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found | Suraj Meena',
    };
  }

  return {
    title: `${project.title} — Project Film & Visual Gallery | Suraj Meena`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Suraj Meena`,
      description: project.description,
      images: project.coverUrl ? [project.coverUrl] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const [allProjects, projectVideos] = await Promise.all([
    getProjects(true),
    getProjectMedia(slug),
  ]);

  const otherProjects = allProjects.filter((p) => p.slug !== slug).slice(0, 3);

  // Include primary project reel and all additional cuts in the 3D carousel
  const primaryCut = {
    id: `${project.slug}-feature-cut`,
    fileName: `${project.title} Main Reel`,
    fileUrl: project.videoUrl,
    mediaType: 'video' as const,
    title: `${project.title} — Primary Reel`,
    caption: project.description,
    aspectRatio: 'vertical' as const,
    projectSlug: project.slug,
    displayOrder: 0,
    published: true,
    createdAt: project.createdAt,
  };

  const hasMainCut = projectVideos.some((m) => m.fileUrl === project.videoUrl);
  const carouselVideos = hasMainCut
    ? projectVideos
    : [primaryCut, ...projectVideos];

  return (
    <main>
      <Navbar />

      <article className={styles.pageWrapper}>
        <div className={styles.container}>
          {/* Back Navigation */}
          <Link href="/projects" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>All Projects & Works</span>
          </Link>

          {/* Editorial Header */}
          <header className={styles.header}>
            <div className={styles.metaRow}>
              <span className={styles.categoryBadge}>{project.category}</span>
              <span className={styles.yearBadge}>{project.year || '2025'}</span>
            </div>

            <h1 className={styles.title}>{project.title}</h1>
            <p className={styles.description}>{project.description}</p>

            {project.tools && project.tools.length > 0 && (
              <div className={styles.toolsList}>
                {project.tools.map((tool) => (
                  <span key={tool} className={styles.toolTag}>
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* OPTIONAL CREATIVE PROCESS CASE STUDY */}
          {Boolean(project.creativeProcessEnabled && project.creativeProcessSteps && project.creativeProcessSteps.length > 0) && (
            <CreativeProcess
              heading={project.creativeProcessHeading}
              intro={project.creativeProcessIntro}
              steps={project.creativeProcessSteps}
            />
          )}

          {/* CINEMATIC 3D PERSPECTIVE VIDEO CAROUSEL */}
          <CinematicVideoCarousel
            items={carouselVideos}
            projectTitle={project.title}
            category={project.category}
          />

          {/* More Selected Works */}
          {otherProjects.length > 0 && (
            <section className={styles.moreProjects}>
              <h3 className={styles.moreTitle}>More Selected Works</h3>
              <div className={styles.moreGrid}>
                {otherProjects.map((p, idx) => (
                  <ProjectCard
                    key={p.id}
                    title={p.title}
                    description={p.description}
                    videoUrl={p.videoUrl}
                    slug={p.slug}
                    delay={idx * 0.1}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <Footer />
    </main>
  );
}
