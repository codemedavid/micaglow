-- Update Order Statuses Migration
-- This migration updates the order status check constraint to include new statuses:
-- CONFIRMED, PAID, SHIPPED, COMPLETED (in addition to existing PENDING and CANCELLED)

-- Step 1: Drop the existing check constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Step 2: Add the new check constraint with updated statuses
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('PENDING', 'CONFIRMED', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'));

-- Step 3: Update the batches policy if needed (ensure admins can see batches)
-- This ensures admin can see all batches, not just open ones
DROP POLICY IF EXISTS "batches_read" ON batches;

CREATE POLICY "batches_read" ON batches
  FOR SELECT USING (
    status IN ('OPEN', 'FILLING', 'LOCKED', 'PAYMENT') OR
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Step 4: Add policy for admins to update orders
CREATE POLICY "orders_admin_update" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Verify the changes
SELECT 
  'Migration completed successfully. New order statuses available: PENDING, CONFIRMED, PAID, SHIPPED, COMPLETED, CANCELLED' as status;

