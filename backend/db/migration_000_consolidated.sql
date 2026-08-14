-- ============================================================
-- CONSOLIDATED MIGRATION: Full Portfolio Schema
-- Execute this entire file in the Supabase SQL Editor.
-- Order: Extensions → Functions → Tables → FK → Indexes
--        → Generated columns → Triggers → RLS → Storage → Seed
-- ============================================================

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- 2. FUNCTIONS (defined before any table references)
-- ============================================================

-- Singleton guard for profile table
CREATE OR REPLACE FUNCTION prevent_multiple_profile_rows()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM profile) >= 1 AND TG_OP = 'INSERT' THEN
    RAISE EXCEPTION 'Only one profile row allowed (singleton table)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 3. ALL CREATE TABLE STATEMENTS
-- ============================================================

-- 3a. PROFILE (singleton — global site settings)
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  initials TEXT,
  role TEXT,
  location TEXT,
  status TEXT,
  tagline TEXT,
  identity TEXT,
  cohort TEXT,
  focus JSONB DEFAULT '[]',
  site_title TEXT,
  site_description TEXT,
  site_keywords TEXT,
  og_image TEXT,
  welcome_text TEXT,
  resume_url TEXT,
  availability_status TEXT,
  blurb TEXT,
  copyright TEXT,
  signature TEXT,
  about_epigraph TEXT,
  about_footnote TEXT,
  about_tags JSONB DEFAULT '[]',
  beyond JSONB DEFAULT '{}',
  philosophy JSONB DEFAULT '{}',
  dispatch JSONB DEFAULT '{}',
  contact_info JSONB DEFAULT '{}',
  footer_nav JSONB DEFAULT '[]',
  marquee_items JSONB DEFAULT '[]',
  chapter_nav JSONB DEFAULT '[]',
  hero_skills JSONB DEFAULT '[]',
  hero_meta JSONB DEFAULT '[]',
  ctas JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3b. EDUCATION
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INTEGER DEFAULT 0,
  era TEXT,
  institution TEXT,
  degree TEXT,
  field TEXT,
  status TEXT,
  start_date TEXT,
  end_date TEXT,
  grade TEXT,
  logo TEXT,
  location TEXT,
  description TEXT,
  highlights JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  section_meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3c. EXPERIENCE
CREATE TABLE IF NOT EXISTS experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INTEGER DEFAULT 0,
  company TEXT,
  role TEXT,
  type TEXT,
  location TEXT,
  start_date TEXT,
  end_date TEXT,
  duration TEXT,
  current BOOLEAN DEFAULT false,
  description TEXT,
  highlights JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  logo TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3d. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INTEGER DEFAULT 0,
  title TEXT,
  tagline TEXT,
  category TEXT,
  role TEXT,
  status TEXT,
  year TEXT,
  url TEXT,
  repo TEXT,
  cover TEXT,
  description TEXT,
  body TEXT,
  highlights JSONB DEFAULT '[]',
  tech JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  links JSONB DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3e. SKILLS
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INTEGER DEFAULT 0,
  name TEXT,
  category TEXT,
  level TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3f. RESEARCH PAPERS
CREATE TABLE IF NOT EXISTS research_papers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INTEGER DEFAULT 0,
  title TEXT,
  authors TEXT,
  journal TEXT,
  year TEXT,
  doi TEXT,
  url TEXT,
  abstract TEXT,
  keywords JSONB DEFAULT '[]',
  category TEXT,
  featured BOOLEAN DEFAULT false,
  citation TEXT,
  publisher TEXT,
  pages TEXT,
  volume TEXT,
  issue TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3g. PUBLICATIONS
CREATE TABLE IF NOT EXISTS publications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INTEGER DEFAULT 0,
  title TEXT,
  publisher TEXT,
  date TEXT,
  url TEXT,
  type TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3h. CERTIFICATIONS
CREATE TABLE IF NOT EXISTS certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INTEGER DEFAULT 0,
  title TEXT,
  issuer TEXT,
  date TEXT,
  expiry TEXT,
  url TEXT,
  credential_id TEXT,
  skills JSONB DEFAULT '[]',
  logo TEXT,
  category TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3i. ABOUT BEATS
CREATE TABLE IF NOT EXISTS about_beats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INTEGER DEFAULT 0,
  no TEXT,
  era TEXT,
  title TEXT,
  lede TEXT,
  body TEXT,
  pull TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3j. ABOUT MILESTONES
CREATE TABLE IF NOT EXISTS about_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INTEGER DEFAULT 0,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3k. ABOUT METRICS
CREATE TABLE IF NOT EXISTS about_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INTEGER DEFAULT 0,
  label TEXT,
  value INTEGER DEFAULT 0,
  suffix TEXT DEFAULT '',
  target_anchor TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3l. AWARDS
CREATE TABLE IF NOT EXISTS awards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INTEGER DEFAULT 0,
  year TEXT,
  highlight BOOLEAN DEFAULT false,
  kind TEXT,
  title TEXT,
  org TEXT,
  category TEXT,
  location TEXT,
  verified BOOLEAN DEFAULT true,
  body TEXT,
  story TEXT,
  why TEXT,
  skills JSONB DEFAULT '[]',
  related JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3m. CAPABILITY DOMAINS
CREATE TABLE IF NOT EXISTS capability_domains (
  id TEXT PRIMARY KEY,
  label TEXT,
  accent TEXT,
  angle REAL DEFAULT 0,
  sort_order INTEGER DEFAULT 0
);

-- 3n. CAPABILITIES (FK to capability_domains)
CREATE TABLE IF NOT EXISTS capabilities (
  id TEXT PRIMARY KEY,
  name TEXT,
  domain TEXT REFERENCES capability_domains(id) ON DELETE SET NULL,
  stage TEXT DEFAULT 'Practicing',
  overview TEXT,
  tools JSONB DEFAULT '[]',
  projects JSONB DEFAULT '[]',
  papers JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  experience JSONB DEFAULT '[]',
  articles JSONB DEFAULT '[]',
  related JSONB DEFAULT '[]',
  next TEXT,
  sort_order INTEGER DEFAULT 0
);

-- 3o. LINKEDIN FEED
CREATE TABLE IF NOT EXISTS linkedin_feed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_name TEXT,
  profile_headline TEXT,
  profile_company TEXT,
  profile_location TEXT,
  profile_url TEXT,
  profile_verified BOOLEAN DEFAULT true,
  followers INTEGER DEFAULT 0,
  connections INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  members_reached INTEGER DEFAULT 0,
  engagements INTEGER DEFAULT 0,
  top_post_reach INTEGER DEFAULT 0,
  featured JSONB DEFAULT '{}',
  editors_pick JSONB DEFAULT '{}',
  latest JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3p. JOURNAL ARTICLES
CREATE TABLE IF NOT EXISTS journal_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  excerpt TEXT,
  category TEXT,
  date TEXT,
  reading_time TEXT,
  cover TEXT,
  url TEXT,
  sort_order INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3q. ECOSYSTEM STATS
CREATE TABLE IF NOT EXISTS ecosystem_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT,
  value INTEGER DEFAULT 0,
  hint TEXT,
  sort_order INTEGER DEFAULT 0
);

-- 3r. RESEARCH THEMES
CREATE TABLE IF NOT EXISTS research_themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT,
  theme TEXT,
  section TEXT DEFAULT 'research',
  sort_order INTEGER DEFAULT 0
);

-- 3s. NAVIGATION ITEMS
CREATE TABLE IF NOT EXISTS navigation_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  n TEXT DEFAULT '00',
  label TEXT NOT NULL,
  section_id TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3t. SOCIAL LINKS
CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  category TEXT DEFAULT 'social',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3u. SITE SECTIONS
CREATE TABLE IF NOT EXISTS site_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  enabled BOOLEAN DEFAULT true,
  mood TEXT DEFAULT 'bone',
  component_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3v. PAGE SEO
CREATE TABLE IF NOT EXISTS page_seo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  og_type TEXT DEFAULT 'website',
  twitter_card TEXT DEFAULT 'summary_large_image',
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  canonical_url TEXT,
  structured_data JSONB DEFAULT '{}',
  noindex BOOLEAN DEFAULT false,
  nofollow BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3w. MEDIA (Supabase Storage references)
CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  alt TEXT DEFAULT '',
  bucket TEXT DEFAULT 'portfolio',
  path TEXT NOT NULL,
  public_url TEXT,
  mime_type TEXT,
  size_bytes INTEGER DEFAULT 0,
  width INTEGER,
  height INTEGER,
  category TEXT DEFAULT 'image',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3x. SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3y. CONTACT SUBMISSIONS
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3z. ANALYTICS EVENTS
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event TEXT,
  page TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  session_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3aa. ADMIN USERS
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 4. INDEXES (all tables now exist)
-- ============================================================

-- Education
CREATE INDEX IF NOT EXISTS idx_education_sort ON education(sort_order);

-- Experience
CREATE INDEX IF NOT EXISTS idx_experience_sort ON experience(sort_order);

-- Projects
CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured) WHERE featured = true;

-- Skills
CREATE INDEX IF NOT EXISTS idx_skills_sort ON skills(sort_order);

-- Research
CREATE INDEX IF NOT EXISTS idx_research_sort ON research_papers(sort_order);
CREATE INDEX IF NOT EXISTS idx_research_featured ON research_papers(featured) WHERE featured = true;

-- Publications
CREATE INDEX IF NOT EXISTS idx_publications_sort ON publications(sort_order);

-- Certifications
CREATE INDEX IF NOT EXISTS idx_certifications_sort ON certifications(sort_order);

-- About
CREATE INDEX IF NOT EXISTS idx_about_beats_sort ON about_beats(sort_order);
CREATE INDEX IF NOT EXISTS idx_about_milestones_sort ON about_milestones(sort_order);
CREATE INDEX IF NOT EXISTS idx_about_metrics_sort ON about_metrics(sort_order);

-- Awards
CREATE INDEX IF NOT EXISTS idx_awards_sort ON awards(sort_order);
CREATE INDEX IF NOT EXISTS idx_awards_highlight ON awards(highlight) WHERE highlight = true;

-- Capabilities
CREATE INDEX IF NOT EXISTS idx_capabilities_domain ON capabilities(domain);
CREATE INDEX IF NOT EXISTS idx_capabilities_sort ON capabilities(sort_order);
CREATE INDEX IF NOT EXISTS idx_capability_domains_sort ON capability_domains(sort_order);

-- Journal
CREATE INDEX IF NOT EXISTS idx_journal_sort ON journal_articles(sort_order);
CREATE INDEX IF NOT EXISTS idx_journal_featured ON journal_articles(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_journal_date ON journal_articles(date);

-- Ecosystem
CREATE INDEX IF NOT EXISTS idx_ecosystem_stats_sort ON ecosystem_stats(sort_order);
CREATE INDEX IF NOT EXISTS idx_research_themes_sort ON research_themes(sort_order);

-- Navigation
CREATE INDEX IF NOT EXISTS idx_nav_sort ON navigation_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_nav_visible ON navigation_items(visible) WHERE visible = true;

-- Social
CREATE INDEX IF NOT EXISTS idx_social_sort ON social_links(sort_order);
CREATE INDEX IF NOT EXISTS idx_social_category ON social_links(category);
CREATE INDEX IF NOT EXISTS idx_social_visible ON social_links(visible) WHERE visible = true;

-- Sections
CREATE INDEX IF NOT EXISTS idx_sections_sort ON site_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_sections_enabled ON site_sections(enabled) WHERE enabled = true;

-- SEO
CREATE INDEX IF NOT EXISTS idx_page_seo_slug ON page_seo(page_slug);

-- Media
CREATE INDEX IF NOT EXISTS idx_media_category ON media(category);
CREATE INDEX IF NOT EXISTS idx_media_bucket ON media(bucket);

-- Settings
CREATE INDEX IF NOT EXISTS idx_settings_key ON site_settings(key);

-- Contact
CREATE INDEX IF NOT EXISTS idx_contact_read ON contact_submissions(read);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at DESC);

-- Analytics
CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics_events(event);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);

-- ============================================================
-- 5. GENERATED COLUMNS (full-text search vectors)
-- ============================================================

ALTER TABLE projects ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(tagline, ''))
) STORED;

ALTER TABLE research_papers ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(abstract, '') || ' ' || coalesce(keywords::text, ''))
) STORED;

ALTER TABLE journal_articles ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(category, ''))
) STORED;

CREATE INDEX IF NOT EXISTS idx_projects_search ON projects USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_research_search ON research_papers USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_journal_search ON journal_articles USING GIN(search_vector);

-- ============================================================
-- 6. TRIGGERS (all tables now exist)
-- ============================================================

-- 6a. Profile singleton trigger
DROP TRIGGER IF EXISTS profile_singleton_trigger ON profile;
CREATE TRIGGER profile_singleton_trigger
  BEFORE INSERT ON profile
  FOR EACH ROW EXECUTE FUNCTION prevent_multiple_profile_rows();

-- 6b. updated_at triggers for all tables that have updated_at column
DO $$
DECLARE
  tbl TEXT;
  tables_with_updated_at TEXT[] := ARRAY[
    'profile', 'education', 'experience', 'projects',
    'research_papers', 'publications', 'certifications',
    'about_beats', 'about_metrics', 'awards',
    'journal_articles', 'navigation_items', 'social_links',
    'site_sections', 'page_seo', 'media', 'site_settings'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables_with_updated_at
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS %I ON %I; CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      tbl || '_updated_at', tbl, tbl || '_updated_at', tbl
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 7. ROW LEVEL SECURITY
-- ============================================================

DO $$
DECLARE
  tbl TEXT;
  tables_list TEXT[] := ARRAY[
    'profile', 'education', 'experience', 'skills', 'projects',
    'research_papers', 'publications', 'certifications',
    'about_beats', 'about_milestones', 'about_metrics', 'awards',
    'capability_domains', 'capabilities', 'linkedin_feed',
    'journal_articles', 'ecosystem_stats', 'research_themes',
    'navigation_items', 'social_links', 'site_sections',
    'page_seo', 'media', 'site_settings', 'contact_submissions',
    'analytics_events', 'admin_users'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables_list
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);

    -- Public read for content tables (NOT private ones)
    IF tbl NOT IN ('contact_submissions', 'analytics_events', 'admin_users') THEN
      EXECUTE format('DROP POLICY IF EXISTS "Public read access" ON %I;', tbl);
      EXECUTE format('CREATE POLICY "Public read access" ON %I FOR SELECT USING (true);', tbl);
    END IF;

    -- Admin full access via service_role / authenticated
    EXECUTE format('DROP POLICY IF EXISTS "Admin full access" ON %I;', tbl);
    EXECUTE format('
      CREATE POLICY "Admin full access" ON %I FOR ALL USING (
        auth.role() = ''authenticated''
      ) WITH CHECK (
        auth.role() = ''authenticated''
      );
    ', tbl);

    -- Admin read-only for admin_users table
    IF tbl = 'admin_users' THEN
      EXECUTE format('DROP POLICY IF EXISTS "Admin users self-read" ON %I;', tbl);
      EXECUTE format('CREATE POLICY "Admin users self-read" ON %I FOR SELECT USING (true);', tbl);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 8. SUPABASE STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('portfolio', 'portfolio', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf', 'video/mp4', 'video/webm'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf', 'video/mp4', 'video/webm'];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('logos', 'logos', true, 2097152, ARRAY['image/svg+xml', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/svg+xml', 'image/png', 'image/webp'];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('documents', 'documents', true, 20971520, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

-- ============================================================
-- 9. STORAGE RLS POLICIES
-- ============================================================

DO $$
DECLARE
  bucket_name TEXT;
  buckets_list TEXT[] := ARRAY['portfolio', 'logos', 'documents'];
BEGIN
  FOREACH bucket_name IN ARRAY buckets_list
  LOOP
    -- Public read
    EXECUTE format('DROP POLICY IF EXISTS "Public read_%s" ON storage.objects;', bucket_name);
    EXECUTE format('CREATE POLICY "Public read_%s" ON storage.objects FOR SELECT USING (bucket_id = %L);', bucket_name, bucket_name);

    -- Authenticated upload
    EXECUTE format('DROP POLICY IF EXISTS "Auth upload_%s" ON storage.objects;', bucket_name);
    EXECUTE format('
      CREATE POLICY "Auth upload_%s" ON storage.objects FOR INSERT WITH CHECK (
        bucket_id = %L AND auth.role() = ''authenticated''
      );
    ', bucket_name, bucket_name);

    -- Authenticated update
    EXECUTE format('DROP POLICY IF EXISTS "Auth update_%s" ON storage.objects;', bucket_name);
    EXECUTE format('
      CREATE POLICY "Auth update_%s" ON storage.objects FOR UPDATE USING (
        bucket_id = %L AND auth.role() = ''authenticated''
      ) WITH CHECK (
        bucket_id = %L AND auth.role() = ''authenticated''
      );
    ', bucket_name, bucket_name, bucket_name);

    -- Authenticated delete
    EXECUTE format('DROP POLICY IF EXISTS "Auth delete_%s" ON storage.objects;', bucket_name);
    EXECUTE format('
      CREATE POLICY "Auth delete_%s" ON storage.objects FOR DELETE USING (
        bucket_id = %L AND auth.role() = ''authenticated''
      );
    ', bucket_name, bucket_name);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 10. DEFAULT SEED DATA
-- ============================================================

-- 10a. Site Settings
INSERT INTO site_settings (key, value, description) VALUES
  ('favicon_dark', '{"url": "/mr-logo-dark.svg", "type": "image/svg+xml"}', 'Favicon for dark mode'),
  ('favicon_light', '{"url": "/mr-logo-light.svg", "type": "image/svg+xml"}', 'Favicon for light mode'),
  ('site_url', '{"url": "https://www.manikantar.in"}', 'Canonical site URL'),
  ('footer_blurb', '{"text": "Building the future of work — one model, one paper, one decision at a time."}', 'Footer blurb text'),
  ('footer_signature', '{"text": "Built with intention · Bengaluru, IN"}', 'Footer signature'),
  ('availability_text', '{"text": "Available for opportunities"}', 'Availability pill text'),
  ('edition_text', '{"text": "Edition · 2026"}', 'Edition display text'),
  ('theme_color', '{"light": "#F8F5EF", "dark": "#0E0E10"}', 'Theme colors'),
  ('primary_color', '{"color": "#D46A2E"}', 'Primary accent color')
ON CONFLICT (key) DO NOTHING;

-- 10b. Navigation Items
INSERT INTO navigation_items (n, label, section_id, sort_order) VALUES
  ('00', 'Home', 'cover', 0),
  ('01', 'About', 'about', 1),
  ('02', 'Education', 'education', 2),
  ('03', 'Experience', 'experience', 3),
  ('04', 'Awards', 'awards', 4),
  ('05', 'Research', 'research', 5),
  ('06', 'Projects', 'work', 6),
  ('07', 'Expertise', 'ecosystem', 7),
  ('08', 'Credentials', 'credentials', 8),
  ('09', 'LinkedIn', 'linkedin', 9),
  ('10', 'Journal', 'journal', 10),
  ('11', 'Manifesto', 'philosophy', 11),
  ('12', 'Beyond', 'beyond-me', 12)
ON CONFLICT DO NOTHING;

-- 10c. Social Links
INSERT INTO social_links (platform, label, url, icon_name, sort_order, category) VALUES
  ('linkedin', 'LinkedIn', 'https://www.linkedin.com/in/manikanta-r', 'Linkedin', 0, 'social'),
  ('github', 'GitHub', 'https://github.com/manikantar', 'Github', 1, 'social'),
  ('instagram', 'Instagram', 'https://instagram.com/mani___894', 'Instagram', 2, 'social'),
  ('facebook', 'Facebook', '#', 'Facebook', 3, 'social'),
  ('email', 'Email', 'mailto:hello@manikantar.in', 'Mail', 4, 'social'),
  ('orcid', 'ORCID', 'https://orcid.org/0009-0005-2576-8731', null, 0, 'professional'),
  ('ssrn', 'SSRN', 'https://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=7670815', null, 1, 'professional'),
  ('blog', 'Blog', 'https://blog.manikantar.in', null, 2, 'professional'),
  ('resume', 'Resume', 'https://www.manikantar.in/resume.pdf', null, 3, 'professional'),
  ('home', 'Home', '#cover', null, 0, 'quick'),
  ('research', 'Research', '#research', null, 1, 'quick'),
  ('projects_footer', 'Projects', '#work', null, 2, 'quick'),
  ('journal_footer', 'Journal', '#journal', null, 3, 'quick'),
  ('linkedin_footer', 'LinkedIn', '#linkedin', null, 4, 'quick'),
  ('contact_footer', 'Contact', '#contact', null, 5, 'quick')
ON CONFLICT DO NOTHING;

-- 10d. Site Sections
INSERT INTO site_sections (section_id, label, sort_order, component_name, mood) VALUES
  ('cover', 'Cover', 0, 'Ch00Cover', 'bone'),
  ('about', 'About', 1, 'Ch01About', 'bone'),
  ('education', 'Education', 2, 'Ch02Education', 'bone'),
  ('experience', 'Experience', 3, 'Ch03Experience', 'bone'),
  ('awards', 'Awards', 4, null, 'ink'),
  ('research', 'Research', 5, 'Ch05Research', 'ink'),
  ('work', 'Projects', 6, 'Ch06Work', 'ink'),
  ('ecosystem', 'Ecosystem', 7, 'Ch07Ecosystem', 'ink'),
  ('credentials', 'Credentials', 8, 'Ch08Credentials', 'bone'),
  ('linkedin', 'LinkedIn', 9, 'Ch09LinkedIn', 'bone'),
  ('journal', 'Journal', 10, 'Ch10Journal', 'bone'),
  ('philosophy', 'Philosophy', 11, 'Ch11Philosophy', 'ink'),
  ('beyond-me', 'Beyond', 12, 'Ch13BeyondMe', 'bone'),
  ('contact', 'Contact', 13, 'Ch12Contact', 'bone')
ON CONFLICT (section_id) DO NOTHING;

-- 10e. Page SEO
INSERT INTO page_seo (page_slug, title, description, keywords, og_type, twitter_card) VALUES
  ('/', 'Manikanta R — HR Analytics · AI Strategy · People Data', 'Manikanta R · MBA candidate in HR & Business Analytics, Bengaluru. Four published papers across IJIRT and SSRN. Building the future of work through AI, analytics and human insight.', 'Manikanta R, HR Analytics, Business Analytics, AI Strategy, People Analytics, MBA, Bengaluru', 'profile', 'summary_large_image')
ON CONFLICT (page_slug) DO NOTHING;

-- 10f. Capability Domains
INSERT INTO capability_domains (id, label, accent, angle, sort_order) VALUES
  ('Analytics', 'Analytics', '#E0533D', -90, 0),
  ('Artificial Intelligence', 'AI & ML', '#7C5CFF', -45, 1),
  ('People & HR', 'People & HR', '#3DA9FC', 0, 2),
  ('Business', 'Business', '#F2B33D', 45, 3),
  ('Leadership', 'Leadership', '#E0533D', 90, 4),
  ('Research', 'Research', '#7C5CFF', 135, 5),
  ('Technology', 'Technology', '#3DA9FC', 180, 6),
  ('Visualization', 'Visualization', '#F2B33D', 225, 7)
ON CONFLICT (id) DO NOTHING;

-- 10g. Ecosystem Stats
INSERT INTO ecosystem_stats (label, value, hint, sort_order) VALUES
  ('Capabilities', 33, 'tracked', 0),
  ('Domains', 8, 'interconnected', 1),
  ('Research Papers', 10, 'IJIRT · SSRN', 2),
  ('Certifications', 14, 'verified', 3),
  ('Projects', 12, 'in portfolio', 4),
  ('Years of Practice', 5, 'and counting', 5),
  ('Learning Hours', 420, 'logged', 6),
  ('Tools in Rotation', 26, 'actively used', 7)
ON CONFLICT DO NOTHING;

-- 10h. Research themes
INSERT INTO research_themes (year, theme, section, sort_order) VALUES
  ('2022', 'Consumer Behaviour', 'research', 0),
  ('2023', 'Retail Analytics', 'research', 1),
  ('2024', 'HR Analytics', 'research', 2),
  ('2024', 'Business Analytics', 'research', 3),
  ('2025', 'AI Strategy', 'research', 4),
  ('2026', 'Future of Work', 'research', 5)
ON CONFLICT DO NOTHING;