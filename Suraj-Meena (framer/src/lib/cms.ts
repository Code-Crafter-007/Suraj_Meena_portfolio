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

// File path for local CMS fallback store (only used for non-configured dev environments)
const STORE_PATH = path.join(process.cwd(), 'src', 'data', 'cms-store.json');

const DEFAULT_SETTINGS: CmsSiteSettings = {
  heroPortraitUrl: '/assets/images/about/creator-portrait-front.png',
  bioPortraitUrl: '/assets/images/about/creator-portrait-front.png',
  creatorName: 'Suraj Meena',
  creatorTagline: 'Visual Editor & Motion Designer',
  location: 'Gandhinagar, India',
  contactEmail: 'surajmeenam946@gmail.com',
};

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey);

export const supabase: SupabaseClient | null = hasSupabaseConfig
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

function assertSupabase(): SupabaseClient {
  if (!supabase) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Supabase client is not configured in production.');
    }
  }
  return supabase!;
}

// Helper: check if string is a valid UUID
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUuid(val: string): boolean {
  return UUID_REGEX.test(val);
}

// ==============================================================================
// LOCAL STORE HELPERS (Fallback Engine for Local Offline Dev Only)
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
// SITE SETTINGS API (Primary: Supabase 'site_settings')
// ==============================================================================
export async function getSiteSettings(): Promise<CmsSiteSettings> {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'general')
      .maybeSingle();

    if (!error && data?.value) {
      return {
        ...DEFAULT_SETTINGS,
        ...(data.value as Partial<CmsSiteSettings>),
      };
    }
  }

  const store = readLocalStore();
  return store.settings || DEFAULT_SETTINGS;
}

export async function saveSiteSettings(updates: Partial<CmsSiteSettings>): Promise<CmsSiteSettings> {
  const current = await getSiteSettings();
  const merged: CmsSiteSettings = {
    ...current,
    ...updates,
  };

  if (hasSupabaseConfig && supabase) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        key: 'general',
        value: merged,
        updated_at: new Date().toISOString(),
      });
    if (error) {
      console.error('Failed to persist site settings to Supabase:', error.message);
      throw error;
    }
  }

  const store = readLocalStore();
  store.settings = merged;
  writeLocalStore(store);

  return merged;
}

// ==============================================================================
// PROJECTS CMS API (Primary: Supabase 'projects')
// ==============================================================================

// Helper mapper from DB row to CmsProject
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProjectFromDb(d: any): CmsProject {
  return {
    id: d.id,
    slug: d.slug,
    title: d.title,
    category: d.category,
    year: d.year || '2025',
    description: d.description || '',
    caseStudy: d.case_study || '',
    videoUrl: d.video_url || '',
    coverUrl: d.cover_url || '',
    tools: d.tools || [],
    galleryUrls: d.gallery_urls || [],
    creativeProcessEnabled: Boolean(d.creative_process_enabled),
    creativeProcessHeading: d.creative_process_heading || 'Creative Process & Directorial Method',
    creativeProcessIntro: d.creative_process_intro || '',
    creativeProcessSteps: Array.isArray(d.creative_process_steps) ? d.creative_process_steps : [],
    featured: d.featured ?? true,
    published: d.published ?? true,
    displayOrder: d.display_order ?? 0,
    createdAt: d.created_at || new Date().toISOString(),
  };
}

export async function getProjects(onlyPublished = true): Promise<CmsProject[]> {
  if (hasSupabaseConfig && supabase) {
    let query = supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (onlyPublished) {
      query = query.eq('published', true);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase getProjects error:', error.message);
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Failed to load projects from Supabase: ${error.message}`);
      }
    } else if (data) {
      return data.map(mapProjectFromDb);
    }
  }

  // Fallback to local store for offline dev only
  const store = readLocalStore();
  let list = store.projects || [];
  if (onlyPublished) {
    list = list.filter((p) => p.published);
  }
  return list.sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getProjectBySlug(slug: string): Promise<CmsProject | null> {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Supabase getProjectBySlug error:', error.message);
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Failed to load project from Supabase: ${error.message}`);
      }
    } else {
      return data ? mapProjectFromDb(data) : null;
    }
  }

  const projects = await getProjects(false);
  return projects.find((p) => p.slug === slug) || null;
}

export async function saveProject(
  project: Partial<CmsProject> & { title: string }
): Promise<CmsProject> {
  const client = assertSupabase();

  const slug =
    project.slug ||
    project.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const payload = {
    slug,
    title: project.title,
    category: project.category || 'Cinematic / Music Video',
    year: project.year || new Date().getFullYear().toString(),
    description: project.description || '',
    case_study: project.caseStudy || '',
    video_url: project.videoUrl || '',
    cover_url: project.coverUrl || '',
    tools: project.tools || [],
    gallery_urls: project.galleryUrls || [],
    creative_process_enabled: project.creativeProcessEnabled ?? false,
    creative_process_heading:
      project.creativeProcessHeading || 'Creative Process & Directorial Method',
    creative_process_intro: project.creativeProcessIntro || '',
    creative_process_steps: project.creativeProcessSteps || [],
    featured: project.featured ?? true,
    published: project.published ?? true,
    display_order: project.displayOrder ?? 0,
    updated_at: new Date().toISOString(),
  };

  if (hasSupabaseConfig && client) {
    let result = null;

    if (project.id && isUuid(project.id)) {
      const { data, error } = await client
        .from('projects')
        .update(payload)
        .eq('id', project.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating project by UUID:', error.message);
        throw error;
      }
      result = data;
    } else {
      // Check if project exists by slug
      const { data: existing } = await client
        .from('projects')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (existing?.id) {
        const { data, error } = await client
          .from('projects')
          .update(payload)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating project by slug:', error.message);
          throw error;
        }
        result = data;
      } else {
        const { data, error } = await client
          .from('projects')
          .insert([payload])
          .select()
          .single();

        if (error) {
          console.error('Error inserting project:', error.message);
          throw error;
        }
        result = data;
      }
    }

    if (result) {
      const mapped = mapProjectFromDb(result);
      // Keep local store in sync
      const store = readLocalStore();
      const existingIdx = store.projects.findIndex(
        (p) => p.id === mapped.id || p.slug === mapped.slug
      );
      if (existingIdx >= 0) {
        store.projects[existingIdx] = mapped;
      } else {
        store.projects.push(mapped);
      }
      writeLocalStore(store);
      return mapped;
    }
  }

  // Fallback for non-configured offline dev
  const store = readLocalStore();
  const completeProject: CmsProject = {
    id: project.id || `proj-${Date.now()}`,
    slug,
    title: project.title,
    category: payload.category,
    year: payload.year,
    description: payload.description,
    caseStudy: payload.case_study,
    videoUrl: payload.video_url,
    coverUrl: payload.cover_url,
    tools: payload.tools,
    galleryUrls: payload.gallery_urls,
    creativeProcessEnabled: payload.creative_process_enabled,
    creativeProcessHeading: payload.creative_process_heading,
    creativeProcessIntro: payload.creative_process_intro,
    creativeProcessSteps: payload.creative_process_steps,
    featured: payload.featured,
    published: payload.published,
    displayOrder: payload.display_order,
    createdAt: project.createdAt || new Date().toISOString(),
  };

  const existingIdx = store.projects.findIndex(
    (p) => p.id === completeProject.id || p.slug === slug
  );
  if (existingIdx >= 0) {
    store.projects[existingIdx] = completeProject;
  } else {
    store.projects.push(completeProject);
  }
  writeLocalStore(store);

  return completeProject;
}

export async function deleteProject(id: string): Promise<boolean> {
  const client = assertSupabase();

  if (hasSupabaseConfig && client) {
    if (isUuid(id)) {
      const { error } = await client.from('projects').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteProject error:', error.message);
        throw error;
      }
    } else {
      // Match either ID or slug
      const { error } = await client
        .from('projects')
        .delete()
        .or(`id.eq.${id},slug.eq.${id}`);
      if (error) {
        console.error('Supabase deleteProject (slug fallback) error:', error.message);
        throw error;
      }
    }
  }

  const store = readLocalStore();
  store.projects = store.projects.filter((p) => p.id !== id && p.slug !== id);
  writeLocalStore(store);

  return true;
}

// ==============================================================================
// ARTICLES / THOUGHTS CMS API (Primary: Supabase 'articles')
// ==============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapArticleFromDb(d: any): CmsArticle {
  return {
    id: d.id,
    slug: d.slug,
    title: d.title,
    category: d.category || 'Thought',
    publicationDate: d.publication_date,
    readingTime: d.reading_time || '4 min read',
    excerpt: d.excerpt || '',
    content: d.content || '',
    coverUrl: d.cover_url || '/assets/images/articles/clear-design-post.png',
    published: d.published ?? true,
    displayOrder: d.display_order ?? 0,
    createdAt: d.created_at || new Date().toISOString(),
  };
}

export async function getArticles(onlyPublished = true): Promise<CmsArticle[]> {
  if (hasSupabaseConfig && supabase) {
    let query = supabase
      .from('articles')
      .select('*')
      .order('display_order', { ascending: true });

    if (onlyPublished) {
      query = query.eq('published', true);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase getArticles error:', error.message);
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Failed to load articles from Supabase: ${error.message}`);
      }
    } else if (data) {
      return data.map(mapArticleFromDb);
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
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Supabase getArticleBySlug error:', error.message);
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Failed to load article from Supabase: ${error.message}`);
      }
    } else {
      return data ? mapArticleFromDb(data) : null;
    }
  }

  const articles = await getArticles(false);
  return articles.find((a) => a.slug === slug) || null;
}

export async function saveArticle(
  article: Partial<CmsArticle> & { title: string }
): Promise<CmsArticle> {
  const client = assertSupabase();

  const slug =
    article.slug ||
    article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const payload = {
    slug,
    title: article.title,
    category: article.category || 'Design & Motion',
    publication_date:
      article.publicationDate ||
      new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    reading_time: article.readingTime || '4 min read',
    excerpt: article.excerpt || '',
    content: article.content || '',
    cover_url: article.coverUrl || '/assets/images/articles/clear-design-post.png',
    published: article.published ?? true,
    display_order: article.displayOrder ?? 0,
    updated_at: new Date().toISOString(),
  };

  if (hasSupabaseConfig && client) {
    let result = null;

    if (article.id && isUuid(article.id)) {
      const { data, error } = await client
        .from('articles')
        .update(payload)
        .eq('id', article.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      const { data: existing } = await client
        .from('articles')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (existing?.id) {
        const { data, error } = await client
          .from('articles')
          .update(payload)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await client
          .from('articles')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        result = data;
      }
    }

    if (result) {
      const mapped = mapArticleFromDb(result);
      const store = readLocalStore();
      const idx = store.articles.findIndex((a) => a.id === mapped.id || a.slug === mapped.slug);
      if (idx >= 0) store.articles[idx] = mapped;
      else store.articles.push(mapped);
      writeLocalStore(store);
      return mapped;
    }
  }

  const store = readLocalStore();
  const fallbackArticle: CmsArticle = {
    id: article.id || `art-${Date.now()}`,
    slug,
    title: payload.title,
    category: payload.category,
    publicationDate: payload.publication_date,
    readingTime: payload.reading_time,
    excerpt: payload.excerpt,
    content: payload.content,
    coverUrl: payload.cover_url,
    published: payload.published,
    displayOrder: payload.display_order,
    createdAt: article.createdAt || new Date().toISOString(),
  };
  const idx = store.articles.findIndex((a) => a.id === fallbackArticle.id || a.slug === slug);
  if (idx >= 0) store.articles[idx] = fallbackArticle;
  else store.articles.push(fallbackArticle);
  writeLocalStore(store);
  return fallbackArticle;
}

export async function deleteArticle(id: string): Promise<boolean> {
  const client = assertSupabase();

  if (hasSupabaseConfig && client) {
    if (isUuid(id)) {
      const { error } = await client.from('articles').delete().eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await client.from('articles').delete().or(`id.eq.${id},slug.eq.${id}`);
      if (error) throw error;
    }
  }

  const store = readLocalStore();
  store.articles = store.articles.filter((a) => a.id !== id && a.slug !== id);
  writeLocalStore(store);
  return true;
}

// ==============================================================================
// TESTIMONIALS CMS API (Primary: Supabase 'testimonials')
// ==============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTestimonialFromDb(d: any): CmsTestimonial {
  return {
    id: d.id,
    authorName: d.author_name,
    authorRole: d.author_role || 'Client',
    quote: d.quote,
    avatarUrl: d.avatar_url || '/assets/images/about/creator-portrait-front.png',
    companyLogo: d.company_logo || '',
    displayOrder: d.display_order ?? 0,
  };
}

export async function getTestimonials(): Promise<CmsTestimonial[]> {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Supabase getTestimonials error:', error.message);
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Failed to load testimonials: ${error.message}`);
      }
    } else if (data) {
      return data.map(mapTestimonialFromDb);
    }
  }

  const store = readLocalStore();
  return (store.testimonials || []).sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function saveTestimonial(
  testimonial: Partial<CmsTestimonial> & { authorName: string; quote: string }
): Promise<CmsTestimonial> {
  const client = assertSupabase();

  const payload = {
    author_name: testimonial.authorName,
    author_role: testimonial.authorRole || 'Client',
    quote: testimonial.quote,
    avatarUrl: testimonial.avatarUrl || '/assets/images/about/creator-portrait-front.png',
    company_logo: testimonial.companyLogo || '',
    display_order: testimonial.displayOrder ?? 0,
    updated_at: new Date().toISOString(),
  };

  if (hasSupabaseConfig && client) {
    let result = null;

    if (testimonial.id && isUuid(testimonial.id)) {
      const { data, error } = await client
        .from('testimonials')
        .update({
          author_name: payload.author_name,
          author_role: payload.author_role,
          quote: payload.quote,
          avatar_url: payload.avatarUrl,
          company_logo: payload.company_logo,
          display_order: payload.display_order,
          updated_at: payload.updated_at,
        })
        .eq('id', testimonial.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await client
        .from('testimonials')
        .insert([
          {
            author_name: payload.author_name,
            author_role: payload.author_role,
            quote: payload.quote,
            avatar_url: payload.avatarUrl,
            company_logo: payload.company_logo,
            display_order: payload.display_order,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    if (result) {
      const mapped = mapTestimonialFromDb(result);
      const store = readLocalStore();
      const idx = store.testimonials.findIndex((t) => t.id === mapped.id);
      if (idx >= 0) store.testimonials[idx] = mapped;
      else store.testimonials.push(mapped);
      writeLocalStore(store);
      return mapped;
    }
  }

  const store = readLocalStore();
  const fallbackTestimonial: CmsTestimonial = {
    id: testimonial.id || `test-${Date.now()}`,
    authorName: payload.author_name,
    authorRole: payload.author_role,
    quote: payload.quote,
    avatarUrl: payload.avatarUrl,
    companyLogo: payload.company_logo,
    displayOrder: payload.display_order,
  };
  const idx = store.testimonials.findIndex((t) => t.id === fallbackTestimonial.id);
  if (idx >= 0) store.testimonials[idx] = fallbackTestimonial;
  else store.testimonials.push(fallbackTestimonial);
  writeLocalStore(store);
  return fallbackTestimonial;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const client = assertSupabase();

  if (hasSupabaseConfig && client) {
    if (isUuid(id)) {
      const { error } = await client.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await client.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    }
  }

  const store = readLocalStore();
  store.testimonials = store.testimonials.filter((t) => t.id !== id);
  writeLocalStore(store);
  return true;
}

// ==============================================================================
// MEDIA GALLERY CMS API (Primary: Supabase 'media_gallery')
// ==============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMediaFromDb(d: any): CmsMedia {
  return {
    id: d.id,
    fileName: d.file_name,
    fileUrl: d.file_url,
    mediaType: d.media_type || 'video',
    title: d.title || '',
    caption: d.caption || '',
    projectSlug: d.project_slug || '',
    posterUrl: d.poster_url || '',
    aspectRatio: d.aspect_ratio || 'vertical',
    displayOrder: d.display_order ?? 0,
    published: d.published ?? true,
    createdAt: d.created_at || new Date().toISOString(),
  };
}

export async function getMedia(): Promise<CmsMedia[]> {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from('media_gallery')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Supabase getMedia error:', error.message);
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Failed to load media: ${error.message}`);
      }
    } else if (data) {
      return data.map(mapMediaFromDb);
    }
  }

  const store = readLocalStore();
  return (store.media || []).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}

export async function getProjectMedia(projectSlug: string): Promise<CmsMedia[]> {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from('media_gallery')
      .select('*')
      .eq('project_slug', projectSlug)
      .eq('published', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Supabase getProjectMedia error:', error.message);
    } else if (data) {
      return data.map(mapMediaFromDb);
    }
  }

  const media = await getMedia();
  return media
    .filter((m) => m.projectSlug === projectSlug && m.published !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}

export async function saveMedia(mediaItem: Omit<CmsMedia, 'id' | 'createdAt'> & { id?: string }): Promise<CmsMedia> {
  const client = assertSupabase();

  const payload = {
    file_name: mediaItem.fileName,
    file_url: mediaItem.fileUrl,
    media_type: mediaItem.mediaType,
    title: mediaItem.title || '',
    caption: mediaItem.caption || '',
    project_slug: mediaItem.projectSlug || '',
    poster_url: mediaItem.posterUrl || '',
    aspect_ratio: mediaItem.aspectRatio || 'vertical',
    display_order: mediaItem.displayOrder ?? 0,
    published: mediaItem.published ?? true,
    updated_at: new Date().toISOString(),
  };

  if (hasSupabaseConfig && client) {
    let result = null;

    if (mediaItem.id && isUuid(mediaItem.id)) {
      const { data, error } = await client
        .from('media_gallery')
        .update(payload)
        .eq('id', mediaItem.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await client
        .from('media_gallery')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    if (result) {
      const mapped = mapMediaFromDb(result);
      const store = readLocalStore();
      const idx = store.media.findIndex((m) => m.id === mapped.id);
      if (idx >= 0) store.media[idx] = mapped;
      else store.media.unshift(mapped);
      writeLocalStore(store);
      return mapped;
    }
  }

  const store = readLocalStore();
  const completeMedia: CmsMedia = {
    ...mediaItem,
    id: mediaItem.id || `media-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const idx = store.media.findIndex((m) => m.id === completeMedia.id);
  if (idx >= 0) store.media[idx] = completeMedia;
  else store.media.unshift(completeMedia);
  writeLocalStore(store);
  return completeMedia;
}

export async function updateMedia(id: string, updates: Partial<CmsMedia>): Promise<CmsMedia | null> {
  const client = assertSupabase();

  if (hasSupabaseConfig && client) {
    // Map camelCase to snake_case
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.caption !== undefined) payload.caption = updates.caption;
    if (updates.projectSlug !== undefined) payload.project_slug = updates.projectSlug;
    if (updates.posterUrl !== undefined) payload.poster_url = updates.posterUrl;
    if (updates.aspectRatio !== undefined) payload.aspect_ratio = updates.aspectRatio;
    if (updates.displayOrder !== undefined) payload.display_order = updates.displayOrder;
    if (updates.published !== undefined) payload.published = updates.published;
    if (updates.fileUrl !== undefined) payload.file_url = updates.fileUrl;
    if (updates.fileName !== undefined) payload.file_name = updates.fileName;

    const query = isUuid(id)
      ? client.from('media_gallery').update(payload).eq('id', id)
      : client.from('media_gallery').update(payload).eq('id', id);

    const { data, error } = await query.select().single();
    if (error) {
      console.error('Supabase updateMedia error:', error.message);
      throw error;
    }
    if (data) {
      const mapped = mapMediaFromDb(data);
      const store = readLocalStore();
      const idx = store.media.findIndex((m) => m.id === id);
      if (idx >= 0) store.media[idx] = mapped;
      writeLocalStore(store);
      return mapped;
    }
  }

  const store = readLocalStore();
  const idx = store.media.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  store.media[idx] = { ...store.media[idx], ...updates };
  writeLocalStore(store);
  return store.media[idx];
}

export async function deleteMedia(id: string): Promise<boolean> {
  const client = assertSupabase();

  if (hasSupabaseConfig && client) {
    const { error } = await client.from('media_gallery').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteMedia error:', error.message);
      throw error;
    }
  }

  const store = readLocalStore();
  store.media = store.media.filter((m) => m.id !== id);
  writeLocalStore(store);
  return true;
}

// ==============================================================================
// CONTACT INQUIRIES API (Primary: Supabase 'contact_messages')
// ==============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMessageFromDb(d: any): CmsContactMessage {
  return {
    id: d.id,
    name: d.name,
    email: d.email,
    projectDetails: d.project_details,
    status: d.status || 'unread',
    createdAt: d.created_at || new Date().toISOString(),
  };
}

export async function getContactMessages(): Promise<CmsContactMessage[]> {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase getContactMessages error:', error.message);
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Failed to load inquiries: ${error.message}`);
      }
    } else if (data) {
      return data.map(mapMessageFromDb);
    }
  }

  const store = readLocalStore();
  return (store.messages || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function saveContactMessage(
  msg: Omit<CmsContactMessage, 'id' | 'createdAt' | 'status'>
): Promise<CmsContactMessage> {
  const client = assertSupabase();

  const payload = {
    name: msg.name,
    email: msg.email,
    project_details: msg.projectDetails,
    status: 'unread',
    archived: false,
    created_at: new Date().toISOString(),
  };

  if (hasSupabaseConfig && client) {
    const { data, error } = await client
      .from('contact_messages')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Supabase saveContactMessage error:', error.message);
      throw error;
    }

    if (data) {
      const mapped = mapMessageFromDb(data);
      const store = readLocalStore();
      store.messages.unshift(mapped);
      writeLocalStore(store);
      return mapped;
    }
  }

  const store = readLocalStore();
  const fallbackMessage: CmsContactMessage = {
    ...msg,
    id: `msg-${Date.now()}`,
    status: 'unread',
    createdAt: new Date().toISOString(),
  };
  store.messages.unshift(fallbackMessage);
  writeLocalStore(store);
  return fallbackMessage;
}

export async function updateContactMessageStatus(
  id: string,
  status: 'unread' | 'read'
): Promise<boolean> {
  const client = assertSupabase();

  if (hasSupabaseConfig && client) {
    const { error } = await client
      .from('contact_messages')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Supabase updateContactMessageStatus error:', error.message);
      throw error;
    }
  }

  const store = readLocalStore();
  const existing = store.messages.find((m) => m.id === id);
  if (existing) {
    existing.status = status;
    writeLocalStore(store);
  }
  return true;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const client = assertSupabase();

  if (hasSupabaseConfig && client) {
    const { error } = await client.from('contact_messages').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteContactMessage error:', error.message);
      throw error;
    }
  }

  const store = readLocalStore();
  store.messages = store.messages.filter((m) => m.id !== id);
  writeLocalStore(store);
  return true;
}

// ==============================================================================
// DASHBOARD STATS
// ==============================================================================
export async function getCmsStats() {
  const [projects, articles, media, messages] = await Promise.all([
    getProjects(false),
    getArticles(false),
    getMedia(),
    getContactMessages(),
  ]);

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
