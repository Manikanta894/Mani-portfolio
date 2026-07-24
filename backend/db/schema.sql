-- ============================================
-- Manikanta Portfolio CMS Schema (Supabase/Postgres)
-- ============================================

create extension if not exists "pgcrypto";

-- HERO / PROFILE (singleton row)
create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  hero_title text,
  hero_subtitle text,
  resume_url text,
  profile_photo_url text,
  cta_buttons jsonb default '[]'::jsonb, -- [{label, url}]
  bio text,
  email text,
  phone text,
  social_links jsonb default '{}'::jsonb, -- {linkedin, github, instagram, facebook}
  updated_at timestamptz default now()
);

-- EDUCATION
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text,
  field text,
  start_date date,
  end_date date,
  description text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- EXPERIENCE
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text,
  start_date date,
  end_date date,
  is_current boolean default false,
  description text,
  highlights text[] default array[]::text[],
  sort_order int default 0,
  created_at timestamptz default now()
);

-- SKILLS
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text, -- e.g. 'Languages', 'Frameworks', 'Tools'
  proficiency int, -- 0-100, optional
  sort_order int default 0,
  created_at timestamptz default now()
);

-- PROJECTS
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  images text[] default array[]::text[],
  technologies text[] default array[]::text[],
  github_url text,
  live_demo_url text,
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- RESEARCH PAPERS
create table if not exists public.research_papers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  pdf_url text,
  cover_image_url text,
  doi text,
  authors text[] default array[]::text[],
  abstract text,
  journal text,
  publication_date date,
  keywords text[] default array[]::text[],
  sort_order int default 0,
  created_at timestamptz default now()
);

-- CERTIFICATIONS
create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  certificate_image_url text,
  issuing_organization text,
  credential_url text,
  issue_date date,
  skills text[] default array[]::text[],
  sort_order int default 0,
  created_at timestamptz default now()
);

-- PUBLICATIONS (distinct from research_papers per requirements doc)
create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  journal text,
  doi text,
  publication_date date,
  read_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- SEO SETTINGS (per-page or global, keyed by page slug)
create table if not exists public.seo_settings (
  id uuid primary key default gen_random_uuid(),
  page_slug text unique not null default 'global',
  title text,
  meta_description text,
  meta_keywords text[],
  og_image_url text,
  canonical_url text,
  structured_data jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- ANALYTICS EVENTS (simple event log; aggregate in queries)
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('visit','resume_download','contact_submit','research_download')),
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index if not exists analytics_events_type_idx on public.analytics_events (event_type);
create index if not exists analytics_events_created_idx on public.analytics_events (created_at desc);

-- CONTACT SUBMISSIONS
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

-- LINKEDIN POSTS (already referenced by existing linkedin.controller.js)
create table if not exists public.linkedin_posts (
  id uuid primary key default gen_random_uuid(),
  content text,
  post_url text,
  image_url text,
  likes int default 0,
  comments int default 0,
  posted_at timestamptz,
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- LINKEDIN STATS SNAPSHOT (for followers/impressions/etc, updated periodically)
create table if not exists public.linkedin_stats (
  id uuid primary key default gen_random_uuid(),
  followers int,
  profile_views int,
  impressions int,
  engagement_rate numeric,
  captured_at timestamptz default now()
);

-- ADMIN USERS (simple auth; use Supabase Auth in production instead if preferred)
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);
