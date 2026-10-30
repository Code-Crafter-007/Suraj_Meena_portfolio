import { Service } from '@/types';

export const SERVICES_DATA: Service[] = [
  {
    id: 'motion-graphics',
    title: 'Motion Graphics',
    iconName: 'Sparkles',
    capabilities: ['Title Design', 'Kinetic Type', 'Compositing'],
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    iconName: 'Film',
    capabilities: ['Music Videos', 'Content Series', 'Colour Grading'],
  },
  {
    id: 'social-reels',
    title: 'Social Media Reels',
    iconName: 'Flame',
    capabilities: ['Short-Form Cuts', 'Brand Content', 'Fast Turnaround'],
  },
  {
    id: 'vfx-motion',
    title: 'Motion Design & VFX',
    iconName: 'Wand2',
    capabilities: ['Particle Systems', 'Visual Effects', 'Brand Motion'],
  },
];
