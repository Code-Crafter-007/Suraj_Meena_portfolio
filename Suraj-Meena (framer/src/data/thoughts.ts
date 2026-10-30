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
