-- ============================================================
-- MIGRATION 001: Extend Portfolio Schema for All Dynamic Content
-- ============================================================
-- This migration adds all missing tables needed to make the
-- entire portfolio fully dynamic from Supabase.

-- 1. EXTEND profile table with additional fields
ALTER TABLE IF EXISTS profile 
  ADD COLUMN IF NOT EXISTS site_title TEXT,
  ADD COLUMN IF NOT EXISTS site_description TEXT,
  ADD COLUMN IF NOT EXISTS site_keywords TEXT,
  ADD COLUMN IF NOT EXISTS og_image TEXT,
  ADD COLUMN IF NOT EXISTS welcome_text TEXT,
  ADD COLUMN IF NOT EXISTS tagline TEXT,
  ADD COLUMN IF NOT EXISTS resume_url TEXT,
  ADD COLUMN IF NOT EXISTS availability_status TEXT,
  ADD COLUMN IF NOT EXISTS blurb TEXT,
  ADD COLUMN IF NOT EXISTS copyright TEXT,
  ADD COLUMN IF NOT EXISTS signature TEXT,
  ADD COLUMN IF NOT EXISTS hero_skills JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS hero_meta JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS ctas JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS about_epigraph TEXT,
  ADD COLUMN IF NOT EXISTS about_footnote TEXT,
  ADD COLUMN IF NOT EXISTS about_tags JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS beyond JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS philosophy JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS dispatch JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS contact_info JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS footer_nav JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS marquee_items JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS chapter_nav JSONB DEFAULT '[]';

-- 2. ABOUT BEATS table (narrative)
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

-- 3. ABOUT MILESTONES
CREATE TABLE IF NOT EXISTS about_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INTEGER DEFAULT 0,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ABOUT METRICS
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

-- 5. AWARDS & HONORS
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

-- 6. CAPABILITIES / ECOSYSTEM
CREATE TABLE IF NOT EXISTS capability_domains (
  id TEXT PRIMARY KEY,
  label TEXT,
  accent TEXT,
  angle REAL DEFAULT 0,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS capabilities (
  id TEXT PRIMARY KEY,
  name TEXT,
  domain TEXT REFERENCES capability_domains(id),
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

-- 7. LINKEDIN FEED
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

-- 8. JOURNAL ARTICLES
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

-- 9. ECOSYSTEM DASHBOARD STATS
CREATE TABLE IF NOT EXISTS ecosystem_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT,
  value INTEGER DEFAULT 0,
  hint TEXT,
  sort_order INTEGER DEFAULT 0
);

-- 10. RESEARCH THEMES / EVOLUTION
CREATE TABLE IF NOT EXISTS research_themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT,
  theme TEXT,
  section TEXT DEFAULT 'research',
  sort_order INTEGER DEFAULT 0
);

-- Add section column to research_papers
ALTER TABLE IF EXISTS research_papers
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add featured column to projects
ALTER TABLE IF EXISTS projects
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add section-related fields to education
ALTER TABLE IF EXISTS education
  ADD COLUMN IF NOT EXISTS section_meta JSONB DEFAULT '{}';

-- Enable Row Level Security
ALTER TABLE about_beats ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE capability_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_themes ENABLE ROW LEVEL SECURITY;

-- Public read access policies
DROP POLICY IF EXISTS "Public read access" ON about_beats;
CREATE POLICY "Public read access" ON about_beats FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read access" ON about_milestones;
CREATE POLICY "Public read access" ON about_milestones FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read access" ON about_metrics;
CREATE POLICY "Public read access" ON about_metrics FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read access" ON awards;
CREATE POLICY "Public read access" ON awards FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read access" ON capability_domains;
CREATE POLICY "Public read access" ON capability_domains FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read access" ON capabilities;
CREATE POLICY "Public read access" ON capabilities FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read access" ON linkedin_feed;
CREATE POLICY "Public read access" ON linkedin_feed FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read access" ON journal_articles;
CREATE POLICY "Public read access" ON journal_articles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read access" ON ecosystem_stats;
CREATE POLICY "Public read access" ON ecosystem_stats FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read access" ON research_themes;
CREATE POLICY "Public read access" ON research_themes FOR SELECT USING (true);
