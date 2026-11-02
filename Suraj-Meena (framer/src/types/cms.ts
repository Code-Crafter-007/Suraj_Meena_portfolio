export interface CmsSiteSettings {
  heroPortraitUrl: string;
  bioPortraitUrl: string;
  creatorName?: string;
  creatorTagline?: string;
  location?: string;
  contactEmail?: string;
}

export interface CmsProcessStep {
  id: string;
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  posterUrl?: string;
  caption?: string;
  sortOrder: number;
}

export interface CmsProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  caseStudy?: string;
  videoUrl: string;
  coverUrl?: string;
  tools: string[];
  galleryUrls?: string[];
  creativeProcessEnabled?: boolean;
  creativeProcessHeading?: string;
  creativeProcessIntro?: string;
  creativeProcessSteps?: CmsProcessStep[];
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface CmsArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  publicationDate: string;
  readingTime?: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  published: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface CmsTestimonial {
  id: string;
  authorName: string;
  authorRole: string;
  quote: string;
  avatarUrl: string;
  companyLogo?: string;
  displayOrder: number;
}

export interface CmsMedia {
  id: string;
  fileName: string;
  fileUrl: string;
  mediaType: 'video' | 'image';
  title?: string;
  caption?: string;
  projectSlug?: string;
  posterUrl?: string;
  aspectRatio?: 'vertical' | 'horizontal' | 'square' | 'auto';
  displayOrder?: number;
  published?: boolean;
  createdAt: string;
}

export interface CmsContactMessage {
  id: string;
  name: string;
  email: string;
  projectDetails: string;
  status: 'unread' | 'read';
  createdAt: string;
}

export interface CmsDataStore {
  settings: CmsSiteSettings;
  projects: CmsProject[];
  articles: CmsArticle[];
  testimonials: CmsTestimonial[];
  media: CmsMedia[];
  messages: CmsContactMessage[];
}
