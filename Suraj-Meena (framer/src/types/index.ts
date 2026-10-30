export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  videoUrl: string;
  tools: string[];
  featured?: boolean;
}

export interface Service {
  id: string;
  title: string;
  iconName: string;
  capabilities: string[];
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  quote: string;
  avatarUrl: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
}
