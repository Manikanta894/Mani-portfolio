-- ============================================================
-- MIGRATION 002: Full Dynamic Content System
-- ============================================================
-- This migration adds tables for complete dynamic control:
-- navigation, social links, sections, page SEO, media, site settings

-- 1. NAVIGATION ITEMS - for dynamic PremiumNav
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

-- 2. SOCIAL LINKS - for dynamic SiteFooter
CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  category TEXT DEFAULT 'social', -- 'social', 'professional', 'quick'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. SITE SECTIONS - dynamic section management
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

-- 4. PAGE SEO - per-page SEO metadata
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

-- 5. MEDIA - Supabase Storage references
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

-- 6. SITE SETTINGS - global site configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default site settings
INSERT INTO site_settings (key, value, description) VALUES
  ('favicon_dark', '{"url": "/mr-logo-dark.svg", "type": "image/svg+xml"}', 'Favicon for dark mode'),
  ('favicon_light', '{"url": "/mr-logo-light.svg", "type": "image/svg+xml"}', 'Favicon for light mode'),
  ('site_url', '{"url": "https://manikantar.in"}', 'Canonical site URL'),
  ('footer_blurb', '{"text": "Building the future of work — one model, one paper, one decision at a time."}', 'Footer blurb text'),
  ('footer_signature', '{"text": "Built with intention · Bengaluru, IN"}', 'Footer signature'),
  ('availability_text', '{"text": "Available for opportunities"}', 'Availability pill text'),
  ('edition_text', '{"text": "Edition · 2026"}', 'Edition display text')
ON CONFLICT (key) DO NOTHING;

-- Insert default navigation items
INSERT INTO navigation_items (n, label, section_id, sort_order) VALUES
  ('00', 'Home', 'cover', 0),
  ('01', 'About', 'about', 1),
  ('02', 'Education', 'education', 2),
  ('03', 'Experience', 'experience', 3),
  ('04', 'Awards', 'awards', 4),
  ('05', 'Research', 'research', 5),
  ('06', 'Work', 'work', 6),
  ('07', 'Ecosystem', 'ecosystem', 7),
  ('08', 'Credentials', 'credentials', 8),
  ('09', 'LinkedIn', 'linkedin', 9),
  ('10', 'Journal', 'journal', 10),
  ('11', 'Philosophy', 'philosophy', 11),
  ('12', 'Contact', 'contact', 12),
  ('13', 'Beyond', 'beyond-me', 13)
ON CONFLICT DO NOTHING;

-- Insert default social links
INSERT INTO social_links (platform, label, url, icon_name, sort_order, category) VALUES
  ('linkedin', 'LinkedIn', 'https://www.linkedin.com/in/manikanta-r', 'Linkedin', 0, 'social'),
  ('github', 'GitHub', 'https://github.com/manikantar', 'Github', 1, 'social'),
  ('instagram', 'Instagram', 'https://instagram.com/mani___894', 'Instagram', 2, 'social'),
  ('facebook', 'Facebook', 'https://www.facebook.com/manikanta', 'Facebook', 3, 'social'),
  ('email', 'Email', 'mailto:hello@manikantar.in', 'Mail', 4, 'social'),
  ('orcid', 'ORCID', 'https://orcid.org/0009-0005-2576-8731', null, 5, 'professional'),
  ('ssrn', 'SSRN', 'https://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=7670815', null, 6, 'professional'),
  ('blog', 'Blog', 'https://blog.manikantar.in', null, 7, 'professional'),
  ('resume', 'Resume', 'https://manikantar.in/resume.pdf', null, 8, 'professional'),
  ('home', 'Home', '#cover', null, 0, 'quick'),
  ('research', 'Research', '#research', null, 1, 'quick'),
  ('projects', 'Projects', '#work', null, 2, 'quick'),
  ('journal', 'Journal', '#journal', null, 3, 'quick'),
  ('linkedin', 'LinkedIn', '#linkedin', null, 4, 'quick'),
  ('contact', 'Contact', '#contact', null, 5, 'quick')
ON CONFLICT DO NOTHING;

-- Insert default site sections
INSERT INTO site_sections (section_id, label, sort_order, component_name) VALUES
  ('cover', 'Cover', 0, 'Ch00Cover'),
  ('about', 'About', 1, 'Ch01About'),
  ('education', 'Education', 2, 'Ch02Education'),
  ('experience', 'Experience', 3, 'Ch03Experience'),
  ('awards', 'Awards', 4, null),
  ('research', 'Research', 5, 'Ch05Research'),
  ('work', 'Work', 6, 'Ch06Work'),
  ('ecosystem', 'Ecosystem', 7, 'Ch07Ecosystem'),
  ('credentials', 'Credentials', 8, 'Ch08Credentials'),
  ('linkedin', 'LinkedIn', 9, 'Ch09LinkedIn'),
  ('journal', 'Journal', 10, 'Ch10Journal'),
  ('philosophy', 'Philosophy', 11, 'Ch11Philosophy'),
  ('beyond-me', 'Beyond', 12, 'Ch13BeyondMe'),
  ('contact', 'Contact', 13, 'Ch12Contact')
ON CONFLICT (section_id) DO NOTHING;

-- Insert default page SEO
INSERT INTO page_seo (page_slug, title, description, keywords, og_type) VALUES
  ('/', 'Manikanta R — HR Analytics · AI Strategy · People Data', 'Manikanta R · MBA candidate in HR & Business Analytics, Bengaluru. Four published papers across IJIRT and SSRN.', 'Manikanta R, HR Analytics, Business Analytics, AI Strategy', 'profile')
ON CONFLICT (page_slug) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access policies
DROP POLICY IF EXISTS "Public read access" ON navigation_items;
CREATE POLICY "Public read access" ON navigation_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read access" ON social_links;
CREATE POLICY "Public read access" ON social_links FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read access" ON site_sections;
CREATE POLICY "Public read access" ON site_sections FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read access" ON page_seo;
CREATE POLICY "Public read access" ON page_seo FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read access" ON media;
CREATE POLICY "Public read access" ON media FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read access" ON site_settings;
CREATE POLICY "Public read access" ON site_settings FOR SELECT USING (true);
