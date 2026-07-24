# 🚀 Production Deployment Guide

## Prerequisites
- Node.js 20+
- Supabase project (free tier works)
- npm / bun

---

## 1. Supabase Project Setup

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL**, **anon key**, and **service_role key** from Settings → API

### Step 2: Execute Migration SQL
Open **Supabase Dashboard → SQL Editor** and execute files **in this order**:

| Order | File | What it does |
|-------|------|--------------|
| 1 | `backend/db/migration_000_consolidated.sql` | **Single file — everything** |
| OR (alternatively run these individually) | | |
| 1 | `backend/db/migration_001_extend_schema.sql` | Content tables + seed |
| 2 | `backend/db/migration_002_full_dynamic.sql` | Navigation, SEO, media, settings tables |

The consolidated file (`000`) creates:
- ✅ 24 tables with proper columns, defaults, and constraints
- ✅ Auto-updating `updated_at` triggers
- ✅ Singleton enforcement for profile table
- ✅ Foreign key from capabilities → capability_domains
- ✅ Full-text search columns (GIN indexes) on projects, research_papers, journal_articles
- ✅ Performance indexes on all sort_order, featured, and filter columns
- ✅ Row Level Security (RLS) on every table
- ✅ Storage buckets (portfolio, logos, documents) with size limits and MIME types
- ✅ Storage RLS policies (public read, authenticated write)
- ✅ Default seed data for site_settings, navigation_items, social_links, site_sections, page_seo, capability_domains, ecosystem_stats, research_themes

### Step 3: Configure Supabase Storage
The migration creates 3 buckets automatically:
- **portfolio** (10MB limit) — images, SVGs, PDFs, videos
- **logos** (2MB limit) — company/institution logos
- **documents** (20MB limit) — PDFs, Word docs

Each bucket has:
- Public read access (no auth needed)
- Authenticated write/update/delete (admin only)

### Step 4: Create Admin User
Run in Supabase SQL Editor:
```sql
-- Create admin_users table (if not already created by migration)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin users self-read" ON admin_users FOR SELECT USING (auth.role() = 'authenticated');

-- Create your admin user (REPLACE with your email and password)
-- Generate hash: https://bcrypt-generator.com/
INSERT INTO admin_users (email, password_hash, name)
VALUES ('your-email@example.com', '$2a$10$YOUR_GENERATED_HASH_HERE', 'Admin');
```

---

## 2. Backend Configuration

### Step 1: Configure Environment
Create `backend/.env`:
```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-random-secret-key-min-32-chars
```

### Step 2: Seed Data
```bash
cd backend
npm install
node scripts/seed.js
```

This populates:
- Profile with all site-wide settings
- About beats (4 narrative chapters)
- About milestones (6 items)
- About metrics (4 statistics)
- Awards (6 entries)
- Capability domains (8 domains)
- Capabilities (30+ skills)
- Ecosystem stats (8 items)
- Research themes (6 themes)
- Journal articles (6 articles)
- LinkedIn feed (profile + stats)

### Step 3: Start Backend
```bash
npm start
# API runs on http://localhost:5000
```

Test health:
```bash
curl http://localhost:5000/health
```

---

## 3. Frontend Configuration

### Step 1: Environment
Create `.env` in project root:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 2: Start Development
```bash
npm run dev
```

---

## 4. Admin Panel Access

### Login Endpoint
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}'
```

Returns a JWT token. Use this token in Authorization header for admin CRUD:
```
Authorization: Bearer <token>
```

### Available Admin Endpoints
| Category | Endpoints |
|----------|-----------|
| Profile | `/api/admin/profile` (singleton) |
| Education | `/api/admin/education` |
| Experience | `/api/admin/experience` |
| Projects | `/api/admin/projects` |
| Research | `/api/admin/research-papers` |
| Publications | `/api/admin/publications` |
| Certifications | `/api/admin/certifications` |
| Skills | `/api/admin/skills` |
| About | `/api/admin/about-beats`, `/api/admin/about-milestones`, `/api/admin/about-metrics` |
| Awards | `/api/admin/awards` |
| Ecosystem | `/api/admin/capability-domains`, `/api/admin/capabilities`, `/api/admin/ecosystem-stats` |
| LinkedIn | `/api/admin/linkedin-feed` |
| Journal | `/api/admin/journal-articles` |
| Research Themes | `/api/admin/research-themes` |
| Navigation | `/api/admin/navigation-items` |
| Social Links | `/api/admin/social-links` |
| Site Sections | `/api/admin/site-sections` |
| Page SEO | `/api/admin/page-seo` |
| Media | `/api/admin/media` |
| Site Settings | `/api/admin/site-settings` |
| Analytics | `/api/admin/analytics/summary` |
| Contact | `/api/admin/contact` |

---

## 5. Database Schema Overview

### Tables (24 total)

| # | Table | Purpose | Key Fields |
|---|-------|---------|------------|
| 1 | `profile` | Global site settings (singleton) | name, role, location, site_title, hero_skills, ctas, philosophy, beyond, contact_info |
| 2 | `education` | Education entries | institution, degree, field, grade, highlights, skills |
| 3 | `experience` | Work experience | company, role, type, highlights, skills |
| 4 | `projects` | Projects | title, tagline, tech, highlights, featured |
| 5 | `skills` | Individual skills | name, category, level |
| 6 | `research_papers` | Academic papers | title, authors, journal, doi, featured, search_vector (GIN) |
| 7 | `publications` | Other publications | title, publisher, type |
| 8 | `certifications` | Certifications | title, issuer, credential_id, verified |
| 9 | `about_beats` | Narrative story beats | no, era, title, lede, body, pull |
| 10 | `about_milestones` | Key milestones | label |
| 11 | `about_metrics` | Statistics | label, value, suffix, target_anchor |
| 12 | `awards` | Awards & honors | year, kind, title, org, story, why |
| 13 | `capability_domains` | Ecosystem domains | id, label, accent, angle |
| 14 | `capabilities` | Individual capabilities | id, name, domain (FK), stage, tools |
| 15 | `linkedin_feed` | LinkedIn analytics | followers, impressions, featured, editors_pick |
| 16 | `journal_articles` | Blog articles | title, excerpt, category, featured, search_vector (GIN) |
| 17 | `ecosystem_stats` | Dashboard stats | label, value, hint |
| 18 | `research_themes` | Research timeline | year, theme |
| 19 | `navigation_items` | Dynamic nav bar | n, label, section_id, visible |
| 20 | `social_links` | Dynamic footer links | platform, label, url, icon_name, category |
| 21 | `site_sections` | Dynamic section control | section_id, label, visible, enabled, component_name |
| 22 | `page_seo` | Per-page SEO | page_slug, title, description, og_*, twitter_*, canonical_url, structured_data |
| 23 | `media` | Storage references | filename, bucket, path, mime_type, category |
| 24 | `site_settings` | Global key-value config | key, value (JSONB) |
| 25 | `contact_submissions` | Contact form entries | name, email, subject, message, read |
| 26 | `analytics_events` | Page analytics | event, page, referrer, session_id |
| 27 | `admin_users` | Admin authentication | email, password_hash |

### Relationships
```
capabilities.domain → capability_domains.id (ON DELETE SET NULL)
```
All other tables are independent for maximum flexibility.

### Indexes (35+ indexes)
- Sort order indexes on all ordered tables
- Partial indexes on `featured = true` and `visible = true`
- Full-text GIN indexes on projects, research_papers, journal_articles
- Foreign key, category, and date indexes

---

## 6. Production Optimizations

### Caching Strategy
The backend CRUD factory (crudFactory.js) is stateless — every request reads fresh from Supabase. For production:
- Add Supabase built-in caching (the SDK handles ETags)
- Consider Redis for high-traffic pages
- The frontend uses React Query (TanStack Query) for client-side caching

### Security
- ✅ Service role key used server-side only (never exposed to frontend)
- ✅ RLS on all tables
- ✅ JWT-based admin authentication
- ✅ Storage buckets with MIME type restrictions
- ✅ File size limits on uploads
- ✅ SQL injection protection via Supabase parameterized queries

### Performance
- ✅ Database indexes on all query patterns
- ✅ Full-text search support
- ✅ Parallel data fetching (24 API calls via Promise.all)
- ✅ React Query for frontend caching
- ✅ Minimal backend middleware chain

---

## 7. Making Changes in Supabase

Every piece of content is editable from Supabase Dashboard:

1. Open **Supabase Dashboard → Table Editor**
2. Find the table you want to edit
3. Modify values directly
4. Changes are reflected immediately on the website (next page load)

No code changes, no redeployment needed.

### What Can Be Edited
| Component | Supabase Table |
|-----------|---------------|
| Hero (name, tagline, skills, CTAs) | `profile` |
| About section | `about_beats`, `about_milestones`, `about_metrics`, `profile` (epigraph, tags) |
| Education | `education` |
| Experience | `experience` |
| Projects | `projects` |
| Research papers | `research_papers` |
| Publications | `publications` |
| Certifications | `certifications` |
| Awards | `awards` |
| Ecosystem / Expertise | `capability_domains`, `capabilities`, `ecosystem_stats` |
| LinkedIn feed | `linkedin_feed` |
| Journal articles | `journal_articles` |
| Research themes | `research_themes` |
| Philosophy | `profile.philosophy` (JSONB) |
| Beyond / Personal | `profile.beyond` (JSONB) |
| Contact info | `profile.contact_info` (JSONB) |
| Navigation bar | `navigation_items` |
| Footer links | `social_links` |
| Section visibility | `site_sections` |
| Page SEO | `page_seo` |
| Site settings | `site_settings` |
| Media references | `media` |
| Theme colors | `site_settings` (theme_color, primary_color) |
| Favicon | `site_settings` (favicon_dark, favicon_light) |

---

## 8. API Endpoints Summary

### Public (no auth)
```
GET  /api/profile              → site profile (singleton)
GET  /api/education            → all education
GET  /api/experience           → all experience
GET  /api/projects             → all projects
GET  /api/skills               → all skills
GET  /api/research_papers      → all research papers
GET  /api/publications         → all publications
GET  /api/certifications       → all certifications
GET  /api/seo_settings         → all SEO settings
GET  /api/about-beats          → about narrative
GET  /api/about-milestones     → about milestones
GET  /api/about-metrics        → about metrics
GET  /api/awards               → all awards
GET  /api/capability-domains   → ecosystem domains
GET  /api/capabilities         → all capabilities
GET  /api/ecosystem-stats      → dashboard stats
GET  /api/linkedin-feed        → LinkedIn analytics
GET  /api/journal-articles     → journal entries
GET  /api/research-themes      → research themes
GET  /api/navigation-items     → nav items (sorted)
GET  /api/social-links         → social links (sorted)
GET  /api/site-sections        → site sections (sorted)
GET  /api/page-seo             → page SEO (sorted by slug)
GET  /api/media                → media references
GET  /api/site-settings        → site settings
POST /api/analytics/track      → track page visit
POST /api/contact              → submit contact form
```

### Admin (JWT required)
All public endpoints above +:
```
POST   /api/admin/login        → login (email + password)
GET    /api/admin/*            → list all rows
GET    /api/admin/*/:id        → get single row
POST   /api/admin/*            → create row
PUT    /api/admin/*/:id        → update row
PATCH  /api/admin/*/:id        → partial update
DELETE /api/admin/*/:id        → delete row
GET    /api/admin/analytics/summary → analytics summary
GET    /api/admin/contact      → list contact submissions