-- ==============================================================================
-- SURAJ MEENA PORTFOLIO & CMS — PRODUCTION DATABASE SCHEMA & INITIAL DATA SEED
-- Database: Supabase PostgreSQL (Project: Suraj_Meena_portfolio / jdjtcbgmdppznlvgjpdn)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  creative_process_enabled BOOLEAN DEFAULT false,
  creative_process_heading TEXT DEFAULT 'Creative Process & Directorial Method',
  creative_process_intro TEXT DEFAULT '',
  creative_process_steps JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT true,
  published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ARTICLES / THOUGHTS TABLE
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Design & Motion',
  publication_date TEXT NOT NULL,
  reading_time TEXT DEFAULT '4 min read',
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT 'Client',
  quote TEXT NOT NULL,
  avatar_url TEXT NOT NULL DEFAULT '',
  company_logo TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MEDIA GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.media_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'video',
  title TEXT DEFAULT '',
  caption TEXT DEFAULT '',
  project_slug TEXT,
  poster_url TEXT DEFAULT '',
  aspect_ratio TEXT DEFAULT 'vertical',
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONTACT MESSAGES / INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_details TEXT NOT NULL,
  status TEXT DEFAULT 'unread', -- 'unread' | 'read'
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid duplication
DROP POLICY IF EXISTS "Public projects read access" ON public.projects;
DROP POLICY IF EXISTS "Public articles read access" ON public.articles;
DROP POLICY IF EXISTS "Public testimonials read access" ON public.testimonials;
DROP POLICY IF EXISTS "Public media gallery read access" ON public.media_gallery;
DROP POLICY IF EXISTS "Public site settings read access" ON public.site_settings;
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;

DROP POLICY IF EXISTS "Service role full access projects" ON public.projects;
DROP POLICY IF EXISTS "Service role full access articles" ON public.articles;
DROP POLICY IF EXISTS "Service role full access testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Service role full access media" ON public.media_gallery;
DROP POLICY IF EXISTS "Service role full access contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Service role full access site settings" ON public.site_settings;

-- Public read policies (published content only)
CREATE POLICY "Public projects read access" ON public.projects
  FOR SELECT USING (published = true);

CREATE POLICY "Public articles read access" ON public.articles
  FOR SELECT USING (published = true);

CREATE POLICY "Public testimonials read access" ON public.testimonials
  FOR SELECT USING (published = true);

CREATE POLICY "Public media gallery read access" ON public.media_gallery
  FOR SELECT USING (published = true);

CREATE POLICY "Public site settings read access" ON public.site_settings
  FOR SELECT USING (true);

-- Public insert policy for contact inquiries
CREATE POLICY "Public can submit contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Service role full access policies (for Admin operations via service_role key)
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

CREATE POLICY "Service role full access site settings" ON public.site_settings
  FOR ALL USING (auth.role() = 'service_role');

-- ==============================================================================
-- STORAGE BUCKETS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-posters', 'portfolio-posters', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read storage access portfolio-media" ON storage.objects;
DROP POLICY IF EXISTS "Public read storage access portfolio-posters" ON storage.objects;
DROP POLICY IF EXISTS "Admin write storage access" ON storage.objects;

CREATE POLICY "Public read storage access portfolio-media" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-media');

CREATE POLICY "Public read storage access portfolio-posters" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-posters');

CREATE POLICY "Admin write storage access" ON storage.objects
  FOR ALL USING ((bucket_id = 'portfolio-media' OR bucket_id = 'portfolio-posters') AND auth.role() = 'service_role');

-- ==============================================================================
-- INITIAL CONTENT MIGRATION & DATA SEEDING
-- (Populates database with authentic existing content if tables are empty)
-- ==============================================================================

-- 1. Site Settings
INSERT INTO public.site_settings (key, value)
VALUES (
  'general',
  '{
    "heroPortraitUrl": "/assets/images/about/creator-portrait-front.png",
    "bioPortraitUrl": "/assets/images/about/creator-portrait-front.png",
    "creatorName": "Suraj Meena",
    "creatorTagline": "Visual Editor & Motion Designer",
    "location": "Gandhinagar, India",
    "contactEmail": "surajmeenam946@gmail.com"
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- 2. Projects
INSERT INTO public.projects (slug, title, category, year, description, case_study, video_url, cover_url, tools, gallery_urls, creative_process_enabled, creative_process_heading, creative_process_intro, creative_process_steps, featured, published, display_order)
VALUES
(
  'tum-aaye-ho',
  'Tum Aaye Ho',
  'Cinematic / Music Video',
  '2024',
  'Official lyrical music video crafted using Adobe After Effects, Premiere Pro, and Photoshop.',
  'Tum Aaye Ho is an expressive lyrical music video project centering around melodic timing, rhythmic cuts, and poetic visual atmosphere. Working closely with the artist, we developed a sensory visual treatment balancing soft typography overlays with high-contrast color grading.\n\nThe timeline demanded meticulous keyframing to sync lyric reveal curves directly to vocal timbre changes. Compositing was achieved through custom After Effects motion typography pipelines coupled with Premiere Pro color matching.',
  '/assets/videos/projects/tum-aaye-ho-preview.mp4',
  '/assets/images/hero/opengraph-hero.png',
  ARRAY['After Effects', 'Premiere Pro', 'Photoshop'],
  ARRAY['/assets/images/about/creator-portrait-front.png', '/assets/images/articles/clear-design-post.png'],
  false,
  'Creative Process & Directorial Method',
  '',
  '[]'::jsonb,
  true,
  true,
  1
),
(
  'mm-cafe',
  'M & M Restro and Cafe',
  'Commercial / Destination',
  '2024',
  'Destination cafe aesthetic lifestyle showcase with sensory rhythm and pacing.',
  'Created as an experiential promotional showcase for M & M Restro and Cafe in Gandhinagar. The visual ambition was to capture the acoustic warmth and culinary craftsmanship through dynamic match cuts and warm color grading.\n\nEvery shot was color balanced in DaVinci Resolve with film emulation LUTs, focusing on warm amber highlights and tactile kitchen sound design.',
  '/assets/videos/projects/mm-cafe-preview.mp4',
  '/assets/images/articles/brand-systems-post.png',
  ARRAY['Premiere Pro', 'DaVinci Resolve', 'Sound Design'],
  ARRAY['/assets/images/articles/brand-systems-post.png'],
  false,
  'Creative Process & Directorial Method',
  '',
  '[]'::jsonb,
  true,
  true,
  2
),
(
  'mazuri',
  'Mazuri',
  'Brand Content / Promo',
  '2025',
  'High-tempo culinary promo reel engineered for short-form retention.',
  'A high-velocity social promo built for maximum hook retention and kinetic momentum. Combining rapid-fire speed ramps, directional whip transitions, and bass-heavy audio layering, Mazuri demonstrates commercial editing tuned for social algorithms.',
  '/assets/videos/projects/mazuri-preview.mp4',
  '/assets/images/articles/art-direction-post.png',
  ARRAY['After Effects', 'Sound Design', 'Speed Ramping'],
  ARRAY[]::text[],
  false,
  'Creative Process & Directorial Method',
  '',
  '[]'::jsonb,
  true,
  true,
  3
),
(
  'nav-nirmaan',
  'Nav Nirmaan',
  'Documentary / Non-Profit',
  '2024',
  'Empathetic social documentary spotlighting impactful community initiatives.',
  'An empathetic documentary edit created for Nav Nirmaan NGO. The edit focuses on authentic human connection, patient pacing, and natural light grading that honors the subjects and their community contributions.',
  '/assets/videos/projects/nav-nirmaan-preview.mp4',
  '/assets/images/hero/opengraph-hero.png',
  ARRAY['Premiere Pro', 'Color Grading', 'Interview Pacing'],
  ARRAY[]::text[],
  false,
  'Creative Process & Directorial Method',
  '',
  '[]'::jsonb,
  true,
  true,
  4
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Articles / Thoughts
INSERT INTO public.articles (slug, title, category, publication_date, reading_time, excerpt, content, cover_url, published, display_order)
VALUES
(
  'clear-design',
  'Building Trust Through Clear Design',
  'Design Systems',
  'May 5, 2025',
  '4 min read',
  'How thoughtful visual choices create a stronger sense of reliability for modern brands.',
  'Visual clarity is not merely an aesthetic preference; it is a foundational pillar of user trust. When motion, typography, and negative space coordinate seamlessly, viewers instinctively perceive competence and reliability.\n\nIn video editing and brand motion, clarity means knowing when not to cut. It means letting a frame breathe, allowing kinetic typography to settle before transitioning, and respecting the viewer''s cognitive bandwidth.',
  '/assets/images/articles/clear-design-post.png',
  true,
  1
),
(
  'art-direction',
  'The Role of Art Direction in Branding',
  'Art Direction',
  'Jun 16, 2025',
  '3 min read',
  'Why visual direction helps brands create emotion and a distinct point of view.',
  'Art direction provides the conceptual glue that transforms disparate clips into a unified visual experience. It dictates palette discipline, lens choices, motion curves, and typography hierarchies.\n\nGreat art direction gives commercial work emotional resonance, turning promotional footage into memorable visual culture.',
  '/assets/images/articles/art-direction-post.png',
  true,
  2
),
(
  'brand-systems',
  'How Creative Teams Build Brand Systems',
  'Creative Direction',
  'Aug 22, 2025',
  '5 min read',
  'Frameworks for scaling visual identity across video, motion, and digital interfaces.',
  'A brand system is an evolving toolkit. In motion design, this translates to codified easing curves, title lockups, lower-third standards, and color grading LUTs that ensure multiple editors produce consistent brand output.',
  '/assets/images/articles/brand-systems-post.png',
  true,
  3
)
ON CONFLICT (slug) DO NOTHING;

-- 4. Testimonials
INSERT INTO public.testimonials (author_name, author_role, quote, avatar_url, company_logo, display_order, published)
VALUES
(
  'Vaibhav',
  'Independent artist',
  'Working with Suraj was a great experience! He handled the complete music video production along with promotional reels, delivering everything with creativity, attention to detail, and a great sense of visual storytelling. From the overall editing to the smallest details, he understood the vision and brought it to life beautifully. The final videos were delivered professionally, and the entire process was smooth. Highly recommended for anyone looking for quality video editing and creative content!',
  'https://jdjtcbgmdppznlvgjpdn.supabase.co/storage/v1/object/public/portfolio-posters/uploads/1793643037878-vaibhav.jpeg',
  '/assets/images/testimonials/client-logo-1.png',
  1,
  true
),
(
  'Daniel K.',
  'Indie Maker',
  'Everything feels intentional, from the visual layout to the motion curves. The attention to detail and creative direction elevated our entire release.',
  '/assets/images/testimonials/daniel-k.jpg',
  '/assets/images/testimonials/client-logo-2.png',
  2,
  true
),
(
  'Mark M.',
  'Startup Founder',
  'Saved us weeks of production iterations. We were able to finalize our visual launch quickly, and it still looks completely custom and premium.',
  '/assets/images/testimonials/mark-m.jpg',
  '/assets/images/testimonials/client-logo-3.png',
  3,
  true
),
(
  'Omar H.',
  'Frontend Developer',
  'The quality is insane. Clean structure, smooth animations, and super easy to collaborate with. It feels like a premium creative partnership from start to finish.',
  '/assets/images/testimonials/omar-h.jpg',
  '/assets/images/testimonials/client-logo-4.png',
  4,
  true
),
(
  'Suraj Meena',
  'CEO',
  'Bhai bohot badhiyaaa aadmi hai crazy editing',
  '/assets/images/testimonials/yakoub-kashmiri.jpg',
  '/assets/images/testimonials/client-logo-1.png',
  5,
  true
);

-- 5. Media Gallery
INSERT INTO public.media_gallery (file_name, file_url, media_type, title, caption, project_slug, poster_url, aspect_ratio, display_order, published)
VALUES
(
  'New Media Link',
  'https://youtu.be/vFyx2fG57mE',
  'video',
  'Tum Aaye ho',
  'Tum aaye ho official video',
  'tum-aaye-ho',
  'https://unsplash.com/photos/woman-in-white-dress-against-ivy-wGaPO_Ka-ts',
  'horizontal',
  130,
  true
),
(
  '20261029_170549.mp4',
  '/assets/uploads/1793553204025-20261029_170549.mp4',
  'video',
  'WDFWD',
  '20261029_170549.mp4',
  'tum-aaye-ho',
  '',
  'vertical',
  0,
  true
),
(
  'tum-aaye-ho-preview.mp4',
  '/assets/videos/projects/tum-aaye-ho-preview.mp4',
  'video',
  'Main Lyrical Visualizer Cut',
  'Typography cadence and vocal timing synchronisation in After Effects.',
  'tum-aaye-ho',
  '',
  'vertical',
  1,
  true
),
(
  'tum-aaye-ho-preview.mp4',
  '/assets/videos/projects/tum-aaye-ho-preview.mp4',
  'video',
  'Color Grade & Motion Study',
  'Soft film curves and rhythmic cross-dissolve exploration.',
  'tum-aaye-ho',
  '',
  'vertical',
  2,
  true
),
(
  'mm-cafe-preview.mp4',
  '/assets/videos/projects/mm-cafe-preview.mp4',
  'video',
  'Destination Cafe Showcase',
  'Atmospheric acoustic and culinary pacing designed for Instagram engagement.',
  'tum-aaye-ho',
  '',
  'vertical',
  1,
  true
),
(
  'mm-cafe-preview.mp4',
  '/assets/videos/projects/mm-cafe-preview.mp4',
  'video',
  'Sensory Kitchen Foley Cut',
  'Tactile micro-cuts tuned to natural room acoustics and brew sounds.',
  'mm-cafe',
  '',
  'vertical',
  2,
  true
),
(
  'mm-cafe-preview.mp4',
  '/assets/videos/projects/mm-cafe-preview.mp4',
  'video',
  'Acoustic Espresso Pour Cut',
  'Slow-motion espresso extraction and natural ambient study.',
  'mm-cafe',
  '',
  'vertical',
  3,
  true
),
(
  'mazuri-preview.mp4',
  '/assets/videos/projects/mazuri-preview.mp4',
  'video',
  'High-Velocity Culinary Promo',
  'Kinetic speed ramp sequence engineered for short-form retention.',
  'tum-aaye-ho',
  '',
  'vertical',
  1,
  true
),
(
  'mazuri-preview.mp4',
  '/assets/videos/projects/mazuri-preview.mp4',
  'video',
  'Pan Flare & Flame Acceleration',
  'High-frame-rate flame dynamic cut with custom sound fx.',
  'mazuri',
  '',
  'vertical',
  2,
  true
),
(
  'mazuri-preview.mp4',
  '/assets/videos/projects/mazuri-preview.mp4',
  'video',
  'Macro Texture Grading Study',
  'Rich saturation curves and highlights for commercial food delivery.',
  'mazuri',
  '',
  'vertical',
  3,
  true
),
(
  'nav-nirmaan-preview.mp4',
  '/assets/videos/projects/nav-nirmaan-preview.mp4',
  'video',
  'Community Documentary Spotlight',
  'Empathetic social documentary spotlighting impactful community initiatives.',
  'tum-aaye-ho',
  '',
  'vertical',
  1,
  true
),
(
  'nav-nirmaan-preview.mp4',
  '/assets/videos/projects/nav-nirmaan-preview.mp4',
  'video',
  'Portrait Cadence & Interview Edit',
  'Patient interview cuts honoring natural speech pauses.',
  'nav-nirmaan',
  '',
  'vertical',
  2,
  true
),
(
  'nav-nirmaan-preview.mp4',
  '/assets/videos/projects/nav-nirmaan-preview.mp4',
  'video',
  'Field Audio & Sunlight Rhythm',
  'Ambient field recordings blending into natural daylight cinematography.',
  'nav-nirmaan',
  '',
  'vertical',
  3,
  true
);

-- 6. Contact Messages (Preserving legitimate inquiries)
INSERT INTO public.contact_messages (name, email, project_details, status, archived)
VALUES
(
  'Yeshmita',
  'yeshmitachouhan@gmail.com',
  'Hey Suraj you''re quite good at video editing.',
  'read',
  true
),
(
  'Arjun Sharma',
  'arjun@example.com',
  'Looking for a motion graphic title sequence and color grade for an upcoming 6-episode documentary series.',
  'read',
  true
);
