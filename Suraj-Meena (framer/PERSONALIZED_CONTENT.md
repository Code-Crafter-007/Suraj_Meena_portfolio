# Personalized Content Specification (`PERSONALIZED_CONTENT.md`)

This document collects the complete, authentic data records ready to populate your codebase. All content is placed in typed data structures for easy editing and long-term maintenance.

---

## 1. Site Metadata & Identity (`src/data/site.ts`)

```typescript
export const SITE_METADATA = {
  creator: 'Suraj Meena',
  brand: 'Frame Flicks',
  tagline: 'Video Editor & Creative Developer',
  location: 'Gandhinagar, India',
  email: 'surajmeenam946@gmail.com',
  socials: {
    instagramPro: 'https://www.instagram.com/_frame_flicks_00/',
    instagramPersonal: 'https://www.instagram.com/_dincharyaa/?hl=en',
    youtube: 'https://www.youtube.com/@dincharyaaaa',
    linkedin: 'https://www.linkedin.com/in/suraj-meena-57865321b/',
    twitter: 'https://x.com/code_crafter_00',
  },
  initiatives: ['Dincharyaaaa', 'OBSCURA Photography Club'],
  tools: [
    'Adobe Premiere Pro',
    'Adobe After Effects',
    'Adobe Photoshop',
    'DaVinci Resolve',
    'Next.js',
    'TypeScript',
  ],
};
```

---

## 2. Refined Project Catalog (`src/data/projects.ts`)

```typescript
export const PROJECTS_DATA: Project[] = [
  {
    id: 'tum-aaye-ho',
    title: 'Tum Aaye Ho',
    category: 'Cinematic / Music Video',
    description: 'Official lyrical music video crafted using Adobe After Effects, Premiere Pro, and Photoshop.',
    videoUrl: '/assets/videos/projects/tum-aaye-ho-preview.mp4',
    tools: ['After Effects', 'Premiere Pro', 'Photoshop'],
    featured: true,
  },
  {
    id: 'mm-cafe',
    title: 'M & M Restro and Cafe',
    category: 'Commercial / Destination',
    description: 'Destination cafe aesthetic lifestyle showcase with sensory rhythm and atmospheric pacing.',
    videoUrl: '/assets/videos/projects/mm-cafe-preview.mp4',
    tools: ['Premiere Pro', 'DaVinci Resolve'],
    featured: true,
  },
  {
    id: 'mazuri',
    title: 'Mazuri',
    category: 'Brand Content / Promo',
    description: 'High-tempo culinary promo reel engineered for short-form retention and visual energy.',
    videoUrl: '/assets/videos/projects/mazuri-preview.mp4',
    tools: ['After Effects', 'Sound Design'],
    featured: true,
  },
  {
    id: 'nav-nirmaan',
    title: 'Nav Nirmaan',
    category: 'Documentary / Non-Profit',
    description: 'Empathetic social documentary spotlighting impactful community initiatives.',
    videoUrl: '/assets/videos/projects/nav-nirmaan-preview.mp4',
    tools: ['Premiere Pro', 'Color Grading'],
    featured: true,
  },
];
```

---

## 3. Editorial Journal Posts (`src/data/thoughts.ts`)

```typescript
export interface ThoughtPost {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  imageUrl: string;
  topics: string[];
}

export const THOUGHTS_DATA: ThoughtPost[] = [
  {
    id: 'art-of-the-cut',
    title: 'The Art of the Cut',
    subtitle: 'Why editing is about rhythm, emotional pacing, and knowing when not to cut.',
    date: 'Creative Journal',
    imageUrl: '/assets/images/articles/clear-design-post.png',
    topics: ['Editing', 'Pacing', 'Sound Design'],
  },
  {
    id: 'every-frame-story',
    title: 'Every Frame Has a Story',
    subtitle: 'Reflections from behind the camera with OBSCURA and field cinematography.',
    date: 'Cinematography',
    imageUrl: '/assets/images/articles/art-direction-post.png',
    topics: ['Photography', 'Framing', 'Lighting'],
  },
  {
    id: 'code-and-creativity',
    title: 'Between Code and Creativity',
    subtitle: 'Exploring the intersection of UI/UX, frontend engineering, and visual motion.',
    date: 'Creative Tech',
    imageUrl: '/assets/images/articles/brand-systems-post.png',
    topics: ['Full-Stack', 'Motion', 'UI/UX'],
  },
];
```
