import React from 'react';
import { getProjects, getArticles, getTestimonials, getSiteSettings } from '@/lib/cms';

export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { HeroBioSection } from '@/components/sections/HeroBioSection';
import { Manifesto } from '@/components/sections/Manifesto';
import { Services } from '@/components/sections/Services';
import { FeaturedWork } from '@/components/sections/FeaturedWork';
import { Testimonials } from '@/components/sections/Testimonials';
import { Thoughts } from '@/components/sections/Thoughts';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';

export default async function HomePage() {
  const [projects, articles, testimonials, siteSettings] = await Promise.all([
    getProjects(true),
    getArticles(true),
    getTestimonials(),
    getSiteSettings(),
  ]);

  return (
    <main>
      <Navbar />
      <HeroBioSection
        heroPortraitUrl={siteSettings.heroPortraitUrl}
        bioPortraitUrl={siteSettings.bioPortraitUrl}
      />
      <Manifesto />
      <Services />
      <FeaturedWork projects={projects} />
      <Testimonials testimonials={testimonials} />
      <Thoughts articles={articles} />
      <Contact />
      <Footer />
    </main>
  );
}
