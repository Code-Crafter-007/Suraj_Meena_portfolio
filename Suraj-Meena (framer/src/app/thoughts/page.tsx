import React from 'react';
import type { Metadata } from 'next';
import { getArticles } from '@/lib/cms';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import ThoughtsArchiveClient from './ThoughtsArchiveClient';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Thoughts & Journal | Suraj Meena',
  description:
    'Essays and personal thoughts on motion design, video editing, sensory rhythm, and brand visual systems by Suraj Meena.',
};

export default async function ThoughtsPage() {
  const articles = await getArticles(true);

  return (
    <main>
      <Navbar />
      <ThoughtsArchiveClient initialArticles={articles} />
      <Footer />
    </main>
  );
}

