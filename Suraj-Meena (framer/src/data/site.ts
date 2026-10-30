export interface SiteMetadata {
  creator: string;
  brand: string;
  tagline: string;
  location: string;
  email: string;
  socials: {
    instagramPro: string;
    instagramPersonal: string;
    youtube: string;
    linkedin: string;
    twitter: string;
  };
  initiatives: string[];
  tools: string[];
}

export const SITE_METADATA: SiteMetadata = {
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
