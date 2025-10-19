-- Add shipping information fields to orders table
-- Run this migration to add shipping details collection

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_name text,
ADD COLUMN IF NOT EXISTS shipping_address text,
ADD COLUMN IF NOT EXISTS shipping_phone text,
ADD COLUMN IF NOT EXISTS delivery_method text CHECK (delivery_method IN ('Lalamove', 'LBC', 'J&T'));

-- Add comment for documentation
COMMENT ON COLUMN orders.shipping_name IS 'Customer name for shipping';
COMMENT ON COLUMN orders.shipping_address IS 'Full delivery address';
COMMENT ON COLUMN orders.shipping_phone IS 'Contact phone number for delivery';
COMMENT ON COLUMN orders.delivery_method IS 'Preferred delivery method: Lalamove, LBC, or J&T';

