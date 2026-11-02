import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  CmsProject,
  CmsArticle,
  CmsTestimonial,
  CmsMedia,
  CmsContactMessage,
  CmsSiteSettings,
  CmsDataStore,
} from '@/types/cms';

// File path for local CMS fallback store
const STORE_PATH = path.join(process.cwd(), 'src', 'data', 'cms-store.json');

const DEFAULT_SETTINGS: CmsSiteSettings = {
  heroPortraitUrl: '/assets/images/about/creator-portrait-front.png',
  bioPortraitUrl: '/assets/images/about/creator-portrait-front.png',
  creatorName: 'Suraj Meena',
  creatorTagline: 'Visual Editor & Motion Designer',
  location: 'Gandhinagar, India',
  contactEmail: 'surajmeenam946@gmail.com',
};

// Initialize optional Supabase client if environment variables are present
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey);

export const supabase: SupabaseClient | null = hasSupabaseConfig
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

// ==============================================================================
// LOCAL STORE HELPERS (Fallback Engine)
// ==============================================================================
function readLocalStore(): CmsDataStore {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(data) as Partial<CmsDataStore>;
      return {
        settings: parsed.settings || DEFAULT_SETTINGS,
        projects: parsed.projects || [],
        articles: parsed.articles || [],
        testimonials: parsed.testimonials || [],
        media: parsed.media || [],
        messages: parsed.messages || [],
      };
    }
  } catch (err) {
    console.error('Error reading local CMS store:', err);
  }
  return {
    settings: DEFAULT_SETTINGS,
    projects: [],
    articles: [],
    testimonials: [],
    media: [],
    messages: [],
  };
}

function writeLocalStore(store: CmsDataStore): void {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local CMS store:', err);
  }
}

// ==============================================================================
// SITE SETTINGS API
// ==============================================================================
export async function getSiteSettings(): Promise<CmsSiteSettings> {
  const store = readLocalStore();
  return store.settings || DEFAULT_SETTINGS;
}

export async function saveSiteSettings(updates: Partial<CmsSiteSettings>): Promise<CmsSiteSettings> {
  const store = readLocalStore();
  store.settings = {
    ...(store.settings || DEFAULT_SETTINGS),
    ...updates,
  };
  writeLocalStore(store);
  return store.settings;
}

// ==============================================================================
// PROJECTS CMS API
// ==============================================================================
export async function getProjects(onlyPublished = true): Promise<CmsProject[]> {
  if (hasSupabaseConfig && supabase) {
    let query = supabase.from('projects').select('*').order('display_order', { ascending: true });
    if (onlyPublished) {
      query = query.eq('published', true);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map((d) => ({
        id: d.id,
        slug: d.slug,
        title: d.title,
        category: d.category,
        year: d.year,
        description: d.description,
        caseStudy: d.case_study,
        videoUrl: d.video_url,
        coverUrl: d.cover_url,
        tools: d.tools || [],
        galleryUrls: d.gallery_urls || [],
        creativeProcessEnabled: d.creative_process_enabled ?? false,
        creativeProcessHeading: d.creative_process_heading,
        creativeProcessIntro: d.creative_process_intro,
        creativeProcessSteps: d.creative_process_steps || [],
        featured: d.featured,
        published: d.published,
        displayOrder: d.display_order,
        createdAt: d.created_at,
      }));
    }
  }

  // Fallback to local store
  const store = readLocalStore();
  let list = store.projects || [];
  if (onlyPublished) {
    list = list.filter((p) => p.published);
  }
  return list.sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getProjectBySlug(slug: string): Promise<CmsProject | null> {
  const projects = await getProjects(false);
  return projects.find((p) => p.slug === slug) || null;
}

export async function saveProject(project: Partial<CmsProject> & { title: string }): Promise<CmsProject> {
  const slug =
    project.slug ||
    project.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const id = project.id || `proj-${Date.now()}`;
  const completeProject: CmsProject = {
    id,
    slug,
    title: project.title,
    category: project.category || 'General',
    year: project.year || new Date().getFullYear().toString(),
    description: project.description || '',
    caseStudy: project.caseStudy || '',
    videoUrl: project.videoUrl || '',
    coverUrl: project.coverUrl || '',
    tools: project.tools || [],
    galleryUrls: project.galleryUrls || [],
    creativeProcessEnabled: project.creativeProcessEnabled ?? false,
    creativeProcessHeading: project.creativeProcessHeading || 'Creative Process & Directorial Method',
    creativeProcessIntro: project.creativeProcessIntro || '',
    creativeProcessSteps: project.creativeProcessSteps || [],
    featured: project.featured ?? true,
    published: project.published ?? true,
    displayOrder: project.displayOrder ?? 0,
    createdAt: project.createdAt || new Date().toISOString(),
  };

  if (hasSupabaseConfig && supabase) {
    const payload = {
      slug: completeProject.slug,
      title: completeProject.title,
      category: completeProject.category,
      year: completeProject.year,
      description: completeProject.description,
      case_study: completeProject.caseStudy,
      video_url: completeProject.videoUrl,
      cover_url: completeProject.coverUrl,
      tools: completeProject.tools,
      gallery_urls: completeProject.galleryUrls,
      featured: completeProject.featured,
      published: completeProject.published,
      display_order: completeProject.displayOrder,
      updated_at: new Date().toISOString(),
    };

    if (project.id && !project.id.startsWith('proj-')) {
      await supabase.from('projects').update(payload).eq('id', project.id);
    } else {
      await supabase.from('projects').insert([payload]);
    }
  }

  // Always update local store so local dev reflects changes instantly
  const store = readLocalStore();
  const existingIdx = store.projects.findIndex((p) => p.id === id || p.slug === slug);
  if (existingIdx >= 0) {
    store.projects[existingIdx] = completeProject;
  } else {
    store.projects.push(completeProject);
  }
  writeLocalStore(store);

  return completeProject;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (hasSupabaseConfig && supabase && !id.startsWith('proj-')) {
    await supabase.from('projects').delete().eq('id', id);
  }
  const store = readLocalStore();
  store.projects = store.projects.filter((p) => p.id !== id);
  writeLocalStore(store);
  return true;
}

// ==============================================================================
// ARTICLES / THOUGHTS CMS API
// ==============================================================================
export async function getArticles(onlyPublished = true): Promise<CmsArticle[]> {
  if (hasSupabaseConfig && supabase) {
    let query = supabase.from('articles').select('*').order('display_order', { ascending: true });
    if (onlyPublished) {
      query = query.eq('published', true);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map((d) => ({
        id: d.id,
        slug: d.slug,
        title: d.title,
        category: d.category,
        publicationDate: d.publication_date,
        excerpt: d.excerpt,
        content: d.content,
        coverUrl: d.cover_url,
        published: d.published,
        displayOrder: d.display_order,
        createdAt: d.created_at,
      }));
    }
  }

  const store = readLocalStore();
  let list = store.articles || [];
  if (onlyPublished) {
    list = list.filter((a) => a.published);
  }
  return list.sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getArticleBySlug(slug: string): Promise<CmsArticle | null> {
  const articles = await getArticles(false);
  return articles.find((a) => a.slug === slug) || null;
}

export async function saveArticle(article: Partial<CmsArticle> & { title: string }): Promise<CmsArticle> {
  const slug =
    article.slug ||
    article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const id = article.id || `art-${Date.now()}`;
  const completeArticle: CmsArticle = {
    id,
    slug,
    title: article.title,
    category: article.category || 'Thought',
    publicationDate:
      article.publicationDate ||
      new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readingTime: article.readingTime || '4 min read',
    excerpt: article.excerpt || '',
    content: article.content || '',
    coverUrl: article.coverUrl || '/assets/images/articles/clear-design-post.png',
    published: article.published ?? true,
    displayOrder: article.displayOrder ?? 0,
    createdAt: article.createdAt || new Date().toISOString(),
  };

  const store = readLocalStore();
  const existingIdx = store.articles.findIndex((a) => a.id === id || a.slug === slug);
  if (existingIdx >= 0) {
    store.articles[existingIdx] = completeArticle;
  } else {
    store.articles.push(completeArticle);
  }
  writeLocalStore(store);

  return completeArticle;
}

export async function deleteArticle(id: string): Promise<boolean> {
  const store = readLocalStore();
  store.articles = store.articles.filter((a) => a.id !== id);
  writeLocalStore(store);
  return true;
}

// ==============================================================================
// TESTIMONIALS CMS API
// ==============================================================================
export async function getTestimonials(): Promise<CmsTestimonial[]> {
  const store = readLocalStore();
  return (store.testimonials || []).sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function saveTestimonial(
  testimonial: Partial<CmsTestimonial> & { authorName: string; quote: string }
): Promise<CmsTestimonial> {
  const id = testimonial.id || `test-${Date.now()}`;
  const completeTestimonial: CmsTestimonial = {
    id,
    authorName: testimonial.authorName,
    authorRole: testimonial.authorRole || 'Client',
    quote: testimonial.quote,
    avatarUrl: testimonial.avatarUrl || '/assets/images/about/creator-portrait-front.png',
    companyLogo: testimonial.companyLogo || '',
    displayOrder: testimonial.displayOrder ?? 0,
  };

  const store = readLocalStore();
  const existingIdx = store.testimonials.findIndex((t) => t.id === id);
  if (existingIdx >= 0) {
    store.testimonials[existingIdx] = completeTestimonial;
  } else {
    store.testimonials.push(completeTestimonial);
  }
  writeLocalStore(store);

  return completeTestimonial;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const store = readLocalStore();
  store.testimonials = store.testimonials.filter((t) => t.id !== id);
  writeLocalStore(store);
  return true;
}

// ==============================================================================
// MEDIA GALLERY CMS API
// ==============================================================================
export async function getMedia(): Promise<CmsMedia[]> {
  const store = readLocalStore();
  return store.media || [];
}

export async function getProjectMedia(projectSlug: string): Promise<CmsMedia[]> {
  const store = readLocalStore();
  const allMedia = store.media || [];
  return allMedia
    .filter((m) => m.projectSlug === projectSlug && m.published !== false)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

export async function saveMedia(mediaItem: Partial<CmsMedia> & { fileUrl: string; fileName: string }): Promise<CmsMedia> {
  const completeMedia: CmsMedia = {
    id: mediaItem.id || `media-${Date.now()}`,
    fileName: mediaItem.fileName,
    fileUrl: mediaItem.fileUrl,
    mediaType: mediaItem.mediaType || 'video',
    title: mediaItem.title || '',
    caption: mediaItem.caption || '',
    projectSlug: mediaItem.projectSlug || '',
    posterUrl: mediaItem.posterUrl || '',
    aspectRatio: mediaItem.aspectRatio || 'vertical',
    displayOrder: mediaItem.displayOrder ?? 0,
    published: mediaItem.published ?? true,
    createdAt: mediaItem.createdAt || new Date().toISOString(),
  };

  const store = readLocalStore();
  const existingIdx = store.media.findIndex((m) => m.id === completeMedia.id);
  if (existingIdx >= 0) {
    store.media[existingIdx] = completeMedia;
  } else {
    store.media.unshift(completeMedia);
  }
  writeLocalStore(store);

  return completeMedia;
}

export async function updateMedia(id: string, updates: Partial<CmsMedia>): Promise<CmsMedia | null> {
  const store = readLocalStore();
  const idx = store.media.findIndex((m) => m.id === id);
  if (idx === -1) return null;

  store.media[idx] = {
    ...store.media[idx],
    ...updates,
  };
  writeLocalStore(store);
  return store.media[idx];
}

export async function deleteMedia(id: string): Promise<boolean> {
  const store = readLocalStore();
  store.media = store.media.filter((m) => m.id !== id);
  writeLocalStore(store);
  return true;
}

// ==============================================================================
// CONTACT INQUIRIES API
// ==============================================================================
export async function getContactMessages(): Promise<CmsContactMessage[]> {
  const store = readLocalStore();
  return (store.messages || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function saveContactMessage(
  msg: Omit<CmsContactMessage, 'id' | 'createdAt' | 'status'>
): Promise<CmsContactMessage> {
  const completeMessage: CmsContactMessage = {
    ...msg,
    id: `msg-${Date.now()}`,
    status: 'unread',
    createdAt: new Date().toISOString(),
  };

  if (hasSupabaseConfig && supabase) {
    await supabase.from('contact_messages').insert([
      {
        name: completeMessage.name,
        email: completeMessage.email,
        project_details: completeMessage.projectDetails,
        status: completeMessage.status,
      },
    ]);
  }

  const store = readLocalStore();
  store.messages.unshift(completeMessage);
  writeLocalStore(store);

  return completeMessage;
}

export async function updateContactMessageStatus(
  id: string,
  status: 'unread' | 'read'
): Promise<boolean> {
  const store = readLocalStore();
  const existing = store.messages.find((m) => m.id === id);
  if (existing) {
    existing.status = status;
    writeLocalStore(store);
    return true;
  }
  return false;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const store = readLocalStore();
  store.messages = store.messages.filter((m) => m.id !== id);
  writeLocalStore(store);
  return true;
}

// ==============================================================================
// DASHBOARD STATS
// ==============================================================================
export async function getCmsStats() {
  const projects = await getProjects(false);
  const articles = await getArticles(false);
  const media = await getMedia();
  const messages = await getContactMessages();

  return {
    totalProjects: projects.length,
    publishedProjects: projects.filter((p) => p.published).length,
    totalArticles: articles.length,
    publishedArticles: articles.filter((a) => a.published).length,
    totalMedia: media.length,
    totalMessages: messages.length,
    unreadMessages: messages.filter((m) => m.status === 'unread').length,
    supabaseConnected: hasSupabaseConfig,
  };
}

