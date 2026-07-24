-- ============================================================
-- MIGRATION 004: Add image_url to certifications
-- ============================================================

ALTER TABLE IF EXISTS certifications
  ADD COLUMN IF NOT EXISTS image_url TEXT;