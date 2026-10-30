export interface ThoughtArticle {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readingTime: string;
  imageUrl: string;
  summary: string;
  content: string[];
}

export const THOUGHTS_ARTICLES: ThoughtArticle[] = [
  {
    id: 'art-of-the-cut',
    title: 'The Art of the Cut',
    subtitle: 'Rhythm, emotional pacing, and knowing when not to cut.',
    category: 'Editing & Rhythm',
    readingTime: '4 min read',
    imageUrl: '/assets/images/articles/clear-design-post.png',
    summary:
      'Every cut is a conscious decision to either preserve immersion or pivot viewer emotion. Great editing is not about fast transitions—it is about musicality and intuitive timing.',
    content: [
      'When I first began editing, I measured skill by the density of my timeline. Layers of warp transitions, speed ramps, and stylized flashes felt like proof of effort. But as I worked on narrative pieces and commercial projects, I realized that the strongest cut is often the one the audience never actively notices.',
      'Editing is fundamentally musical. Every piece of footage has an internal tempo dictated by camera movement, subject breath, and ambient sound. When you cut against that rhythm without intent, you break the emotional contract with the viewer.',
      'In projects like lyrical music videos, the cut must anticipate the snare or ride the silence between vocal phrases. Knowing when to hold a frame—allowing the subject’s gaze to settle before changing perspective—is where visual storytelling truly begins.',
    ],
  },
  {
    id: 'every-frame-story',
    title: 'Every Frame Has a Story',
    subtitle: 'Photography, cinematography, and composition lessons from OBSCURA.',
    category: 'Cinematography',
    readingTime: '5 min read',
    imageUrl: '/assets/images/articles/art-direction-post.png',
    summary:
      'Before you edit footage on a digital timeline, you must understand how light, geometric space, and lens choice construct meaning in-camera.',
    content: [
      'My involvement with OBSCURA photography club fundamentally transformed how I evaluate video footage. In still photography, you have no audio cues or temporal motion to hide behind. You have a single frozen rectangle, and every element within that frame either adds to the story or distracts from it.',
      'Carrying that discipline into videography completely shifted my framing choices. I look for natural leading lines, negative space that gives the subject room to breathe, and how atmospheric contrast establishes depth.',
      'Whether shooting a commercial sequence or capturing documentary work with community initiatives, treating every continuous camera movement as a succession of intentional photographs ensures that each second of raw footage carries artistic weight.',
    ],
  },
  {
    id: 'making-motion-mean-something',
    title: 'Making Motion Mean Something',
    subtitle: 'Purposeful motion design, kinetic type, and spatial gravity.',
    category: 'Motion Design',
    readingTime: '4 min read',
    imageUrl: '/assets/images/articles/brand-systems-post.png',
    summary:
      'Keyframing is mechanical; giving motion weight and purpose is an art. If an animation does not convey hierarchy or momentum, it is simply visual noise.',
    content: [
      'In Adobe After Effects, it is easy to become enamored with complex particle systems, 3D extrusions, and heavy compositing tricks. However, the most memorable motion graphics are those grounded in physical intuition.',
      'Kinetic typography, in particular, requires deep empathy for vocal delivery. Words cannot just slide into view on a linear curve; they must accelerate with conviction, decelerate with natural friction, and settle with proportional mass.',
      'When animating titles for music videos or commercial reels, I focus on velocity curves that match the acoustic attack of the audio track. When the visual motion and auditory punch strike simultaneously, the message resonates effortlessly.',
    ],
  },
  {
    id: 'learning-in-public',
    title: 'Learning in Public with Dincharyaaaa',
    subtitle: 'Creative education, workflow transparency, and growing together.',
    category: 'Creative Education',
    readingTime: '3 min read',
    imageUrl: '/assets/images/articles/clear-design-post.png',
    summary:
      'Teaching what you learn accelerates your own craft. Dincharyaaaa was born from a desire to document honest questions and create a collaborative hub for aspiring editors.',
    content: [
      'The traditional mindset in creative industries often leans toward guarding techniques as proprietary secrets. But the digital landscape rewards transparency. When I started Dincharyaaaa, my goal was straightforward: demystify the editing process and share real workflow breakthroughs.',
      'Explaining how to balance color in Premiere Pro, how to composite in After Effects, or how to negotiate client scopes forced me to articulate intuitions I had previously taken for granted.',
      'Learning in public creates accountability. It transforms isolated freelancing into an ongoing conversation with a community of hungry creators who push each other to experiment with bolder visual ideas.',
    ],
  },
  {
    id: 'code-and-creativity',
    title: 'Between Code and Creativity',
    subtitle: 'Where UI/UX architecture and cinematic visual storytelling converge.',
    category: 'Creative Tech',
    readingTime: '5 min read',
    imageUrl: '/assets/images/articles/brand-systems-post.png',
    summary:
      'Web development and video editing share the exact same foundation: user experience, emotional pacing, and respect for the audience’s attention span.',
    content: [
      'To some, writing TypeScript and building Next.js components might feel diametrically opposed to cutting video on a timeline. But to me, they are complementary expressions of the same pursuit.',
      'A video editor sculpts the passage of time; a creative developer sculpts spatial interaction. Both disciplines rely heavily on rhythm: how a page transitions, how a button eases, how typography scales responsively, and how information reveals itself without jarring the viewer.',
      'By bridging the technical discipline of frontend engineering with the visceral sensitivity of cinematography, I strive to build digital environments that feel fluid, intentional, and alive.',
    ],
  },
];
