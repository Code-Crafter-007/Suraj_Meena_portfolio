import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Bio } from '@/components/sections/Bio';
import { Manifesto } from '@/components/sections/Manifesto';
import { Services } from '@/components/sections/Services';
import { FeaturedWork } from '@/components/sections/FeaturedWork';
import { Testimonials } from '@/components/sections/Testimonials';
import { Thoughts } from '@/components/sections/Thoughts';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Bio />
      <Manifesto />
      <Services />
      <FeaturedWork />
      <Testimonials />
      <Thoughts />
      <Contact />
      <Footer />
    </main>
  );
}
