-- ==============================================================================
-- SURAJ MEENA PORTFOLIO & CMS — SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Run this script in your Supabase Project's SQL Editor to create all tables,
-- RLS policies, storage buckets, and sample seed data.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  year TEXT NOT NULL DEFAULT '2025',
  description TEXT NOT NULL,
  case_study TEXT,
  video_url TEXT NOT NULL,
  cover_url TEXT,
  tools TEXT[] DEFAULT '{}',
  gallery_urls TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT true,
  published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ARTICLES / THOUGHTS TABLE
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Design & Motion',
  publication_date TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_url TEXT,
  published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  quote TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  company_logo TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MEDIA GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.media_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  media_type TEXT NOT NULL, -- 'video' | 'image'
  caption TEXT,
  project_slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONTACT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_details TEXT NOT NULL,
  status TEXT DEFAULT 'unread', -- 'unread' | 'read' | 'archived'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES (Only published content is readable by the public)
CREATE POLICY "Public projects read access" ON public.projects
  FOR SELECT USING (published = true);

CREATE POLICY "Public articles read access" ON public.articles
  FOR SELECT USING (published = true);

CREATE POLICY "Public testimonials read access" ON public.testimonials
  FOR SELECT USING (true);

CREATE POLICY "Public media gallery read access" ON public.media_gallery
  FOR SELECT USING (true);

-- PUBLIC WRITE FOR CONTACT FORM
CREATE POLICY "Public can submit contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- SERVICE ROLE FULL ACCESS (Admin operations using SUPABASE_SERVICE_ROLE_KEY)
CREATE POLICY "Service role full access projects" ON public.projects
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access articles" ON public.articles
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access testimonials" ON public.testimonials
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access media" ON public.media_gallery
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access contact" ON public.contact_messages
  FOR ALL USING (auth.role() = 'service_role');

-- ==============================================================================
-- STORAGE BUCKET CONFIGURATION
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read storage access" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-media');

CREATE POLICY "Admin write storage access" ON storage.objects
  FOR ALL USING (bucket_id = 'portfolio-media' AND auth.role() = 'service_role');

