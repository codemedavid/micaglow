-- Add price column to peptides table
-- Run this in Supabase SQL Editor

ALTER TABLE peptides 
ADD COLUMN IF NOT EXISTS price_per_vial numeric(10,2) DEFAULT 950.00 CHECK (price_per_vial >= 0);

-- Update existing peptides with default prices based on common market rates
UPDATE peptides SET price_per_vial = 950.00 WHERE price_per_vial IS NULL;

-- Add comment for clarity
COMMENT ON COLUMN peptides.price_per_vial IS 'Default price per vial for this peptide. Can be overridden when adding to batch.';

SELECT 'Price column added successfully! ✅' as status;

