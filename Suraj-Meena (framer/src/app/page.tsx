import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Bio } from '@/components/sections/Bio';
import { Manifesto } from '@/components/sections/Manifesto';
import { Services } from '@/components/sections/Services';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Bio />
      <Manifesto />
      <Services />
    </main>
  );
}
