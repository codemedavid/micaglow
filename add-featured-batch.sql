-- Add featured/current batch functionality
-- Run this in Supabase SQL Editor

-- Add is_featured column to batches
ALTER TABLE batches 
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_batches_featured ON batches(is_featured) WHERE is_featured = true;

-- Add comment
COMMENT ON COLUMN batches.is_featured IS 'Marks this batch as the current/featured batch shown to customers';

-- Function to set a batch as featured (auto-unfeatures others)
CREATE OR REPLACE FUNCTION set_featured_batch(batch_id_param uuid)
RETURNS void AS $$
BEGIN
  -- Unfeature all batches first
  UPDATE batches SET is_featured = false WHERE is_featured = true;
  
  -- Feature the selected batch
  UPDATE batches SET is_featured = true WHERE id = batch_id_param;
END;
$$ LANGUAGE plpgsql;

SELECT 'Featured batch functionality added! ✅' as status;

