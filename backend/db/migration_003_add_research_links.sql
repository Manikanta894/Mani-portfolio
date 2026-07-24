-- ============================================================
-- MIGRATION 003: Add PDF and SSRN URL support to research_papers
-- ============================================================

-- Add columns for SSRN and PDF links
ALTER TABLE IF EXISTS research_papers
  ADD COLUMN IF NOT EXISTS pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS ssrn_url TEXT;