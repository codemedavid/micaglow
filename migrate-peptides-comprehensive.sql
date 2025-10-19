-- Migration: Add comprehensive peptide information
-- This migration adds detailed fields to support full peptide profiles

-- Add new columns to peptides table
ALTER TABLE peptides
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS mechanism TEXT,
ADD COLUMN IF NOT EXISTS half_life TEXT,
ADD COLUMN IF NOT EXISTS storage TEXT DEFAULT 'Store in refrigerator (2-8°C)',
ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS side_effects JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS contraindications JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS dosing JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS stacking JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '🔬',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS vials_per_box INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS specifications JSONB,
ADD COLUMN IF NOT EXISTS price_per_vial NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS price_per_box NUMERIC(10,2);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_peptides_category ON peptides(category);
CREATE INDEX IF NOT EXISTS idx_peptides_vendor ON peptides(vendor);
CREATE INDEX IF NOT EXISTS idx_peptides_is_active ON peptides(is_active);

-- Add full-text search capability
CREATE INDEX IF NOT EXISTS idx_peptides_name_search ON peptides USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_peptides_description_search ON peptides USING gin(to_tsvector('english', COALESCE(description, '')));

COMMENT ON COLUMN peptides.description IS 'Detailed product description and research background';
COMMENT ON COLUMN peptides.mechanism IS 'How the peptide works (mechanism of action)';
COMMENT ON COLUMN peptides.half_life IS 'Biological half-life of the peptide';
COMMENT ON COLUMN peptides.storage IS 'Storage requirements and conditions';
COMMENT ON COLUMN peptides.benefits IS 'JSON array of key benefits';
COMMENT ON COLUMN peptides.side_effects IS 'JSON array of potential side effects';
COMMENT ON COLUMN peptides.contraindications IS 'JSON array of contraindications';
COMMENT ON COLUMN peptides.dosing IS 'JSON array of dosing protocols by vial size';
COMMENT ON COLUMN peptides.stacking IS 'JSON array of recommended stacking combinations';
COMMENT ON COLUMN peptides.icon IS 'Emoji icon for visual categorization';
COMMENT ON COLUMN peptides.specifications IS 'JSON object with technical specifications';
COMMENT ON COLUMN peptides.price_per_vial IS 'Base price per vial (can be overridden in batch_peptides)';
COMMENT ON COLUMN peptides.price_per_box IS 'Base price per box (calculated or set)';

