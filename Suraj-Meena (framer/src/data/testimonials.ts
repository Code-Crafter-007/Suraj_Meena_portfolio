export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  avatarUrl: string;
}

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'yakoub-kashmiri',
    quote:
      'Completely changed how I approach visual storytelling and motion. The cuts feel intentional, from the macro pacing to the smallest micro-transitions.',
    authorName: 'Yakoub Kashmiri',
    authorRole: 'Marketing Director',
    avatarUrl: '/assets/images/testimonials/yakoub-kashmiri.jpg',
  },
  {
    id: 'daniel-k',
    quote:
      'Everything feels intentional, from the visual layout to the motion curves. The attention to detail and creative direction elevated our entire release.',
    authorName: 'Daniel K.',
    authorRole: 'Indie Maker',
    avatarUrl: '/assets/images/testimonials/daniel-k.jpg',
  },
  {
    id: 'mark-m',
    quote:
      'Saved us weeks of production iterations. We were able to finalize our visual launch quickly, and it still looks completely custom and premium.',
    authorName: 'Mark M.',
    authorRole: 'Startup Founder',
    avatarUrl: '/assets/images/testimonials/mark-m.jpg',
  },
  {
    id: 'omar-h',
    quote:
      'The quality is insane. Clean structure, smooth animations, and super easy to collaborate with. It feels like a premium creative partnership from start to finish.',
    authorName: 'Omar H.',
    authorRole: 'Frontend Developer',
    avatarUrl: '/assets/images/testimonials/omar-h.jpg',
  },
];
