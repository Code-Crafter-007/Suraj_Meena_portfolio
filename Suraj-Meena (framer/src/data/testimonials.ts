export interface Collaboration {
  id: string;
  projectTitle: string;
  focus: string;
  role: string;
  description: string;
  tools: string[];
  visualUrl: string;
}

export const COLLABORATIONS_DATA: Collaboration[] = [
  {
    id: 'tum-aaye-ho',
    projectTitle: 'Tum Aaye Ho',
    focus: 'Lyrical Video Direction & Motion Graphics',
    role: 'Visual Editor & Motion Designer',
    description:
      'Engineered an immersive lyrical narrative with kinetic typography, precise cuts, and emotive color grading to elevate the musical journey.',
    tools: ['After Effects', 'Premiere Pro', 'Photoshop'],
    visualUrl: '/assets/images/hero/holo-triangle-3d.png',
  },
  {
    id: 'mm-cafe',
    projectTitle: 'M & M Restro and Cafe',
    focus: 'Hospitality & Commercial Filmmaking',
    role: 'Cinematographer & Commercial Editor',
    description:
      'Captured the culinary craftsmanship, ambient lighting, and social warmth of a premier destination cafe to drive genuine footfall and brand engagement.',
    tools: ['Premiere Pro', 'DaVinci Resolve'],
    visualUrl: '/assets/images/hero/holo-ribbon-3d.png',
  },
  {
    id: 'mazuri',
    projectTitle: 'Mazuri',
    focus: 'Brand Content & Short-Form Editing',
    role: 'Creative Editor & Sound Designer',
    description:
      'Crafted high-velocity, retention-optimized short-form content with sensory sound effects and dynamic punch cuts tailored for digital food enthusiasts.',
    tools: ['After Effects', 'Sound Design'],
    visualUrl: '/assets/images/articles/clear-design-post.png',
  },
  {
    id: 'nav-nirmaan-obscura',
    projectTitle: 'Nav Nirmaan & OBSCURA',
    focus: 'Documentary Storytelling & Cinematography',
    role: 'Documentary Editor & Photographer',
    description:
      'Directed community-focused documentary storytelling highlighting grassroots empowerment with Nav Nirmaan NGO, grounded by visual framing principles developed through OBSCURA.',
    tools: ['Cinematography', 'Premiere Pro', 'Color Grading'],
    visualUrl: '/assets/images/articles/art-direction-post.png',
  },
];
