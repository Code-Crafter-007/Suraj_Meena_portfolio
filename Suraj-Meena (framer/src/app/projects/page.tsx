import React from 'react';
import type { Metadata } from 'next';
import { getProjects } from '@/lib/cms';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import ProjectsArchiveClient from './ProjectsArchiveClient';

export const metadata: Metadata = {
  title: 'All Projects & Works | Suraj Meena',
  description:
    'Curated video editing, lyrical music videos, and commercial brand promo archives by Suraj Meena.',
};

export default async function ProjectsPage() {
  const projects = await getProjects(true);

  return (
    <main>
      <Navbar />
      <ProjectsArchiveClient initialProjects={projects} />
      <Footer />
    </main>
  );
}

