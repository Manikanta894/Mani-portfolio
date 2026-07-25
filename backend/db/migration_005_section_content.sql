-- ============================================================
-- MIGRATION 005: section_content table
-- Single JSONB table for all hardcoded section text.
-- Every section's labels, titles, intros, button text, etc.
-- lives here so the user can edit any word via Supabase.
-- ============================================================

CREATE TABLE IF NOT EXISTS section_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_section_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_section_content_updated_at ON section_content;
CREATE TRIGGER trg_section_content_updated_at
  BEFORE UPDATE ON section_content
  FOR EACH ROW
  EXECUTE FUNCTION update_section_content_updated_at();

-- Index for fast key lookups
CREATE INDEX IF NOT EXISTS idx_section_content_key ON section_content (section_key);