-- ============================================================================
-- Add Shipping Information to Orders Table
-- ============================================================================

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_name text,
ADD COLUMN IF NOT EXISTS shipping_address text,
ADD COLUMN IF NOT EXISTS shipping_phone text,
ADD COLUMN IF NOT EXISTS delivery_method text CHECK (delivery_method IN ('Lalamove', 'LBC', 'J&T'));

-- Add comments for documentation
COMMENT ON COLUMN orders.shipping_name IS 'Customer name for shipping';
COMMENT ON COLUMN orders.shipping_address IS 'Full delivery address';
COMMENT ON COLUMN orders.shipping_phone IS 'Contact phone number for delivery';
COMMENT ON COLUMN orders.delivery_method IS 'Preferred delivery method: Lalamove, LBC, or J&T';

-- ============================================================================
-- Update Checkout Function to Include Shipping Information
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_checkout(
  p_user uuid, 
  p_batch uuid,
  p_shipping_name text,
  p_shipping_address text,
  p_shipping_phone text,
  p_delivery_method text
) 
RETURNS uuid AS $$
DECLARE 
  v_order uuid;
  v_cart uuid;
  v_batch_status text;
  v_total numeric(10,2) := 0;
  v_cart_item record;
BEGIN
  -- Lock relevant rows
  PERFORM 1 FROM batches WHERE id = p_batch FOR UPDATE;
  
  -- Validate batch status
  SELECT status INTO v_batch_status FROM batches WHERE id = p_batch;
  
  IF v_batch_status <> 'FILLING' THEN
    RAISE EXCEPTION 'Batch not in FILLING status';
  END IF;
  
  -- Validate shipping information
  IF p_shipping_name IS NULL OR trim(p_shipping_name) = '' THEN
    RAISE EXCEPTION 'Shipping name is required';
  END IF;
  
  IF p_shipping_address IS NULL OR trim(p_shipping_address) = '' THEN
    RAISE EXCEPTION 'Shipping address is required';
  END IF;
  
  IF p_shipping_phone IS NULL OR trim(p_shipping_phone) = '' THEN
    RAISE EXCEPTION 'Shipping phone is required';
  END IF;
  
  IF p_delivery_method NOT IN ('Lalamove', 'LBC', 'J&T') THEN
    RAISE EXCEPTION 'Invalid delivery method. Must be Lalamove, LBC, or J&T';
  END IF;
  
  -- Get user's cart for this batch
  SELECT id INTO v_cart FROM carts 
  WHERE user_id = p_user AND batch_id = p_batch;
  
  IF v_cart IS NULL THEN
    RAISE EXCEPTION 'Cart not found';
  END IF;
  
  -- Validate each cart item and calculate total
  FOR v_cart_item IN 
    SELECT ci.batch_peptide_id, ci.quantity, bp.price_per_vial,
           bp.box_vial_min, bp.boxes_available, bp.vials_filled
    FROM cart_items ci
    JOIN batch_peptides bp ON bp.id = ci.batch_peptide_id
    WHERE ci.cart_id = v_cart
    FOR UPDATE OF bp
  LOOP
    -- Check if adding this quantity exceeds capacity
    IF (v_cart_item.vials_filled + v_cart_item.quantity) > 
       (v_cart_item.boxes_available * v_cart_item.box_vial_min) THEN
      RAISE EXCEPTION 'Insufficient vials available for peptide';
    END IF;
    
    -- Update vials_filled
    UPDATE batch_peptides 
    SET vials_filled = vials_filled + v_cart_item.quantity
    WHERE id = v_cart_item.batch_peptide_id;
    
    -- Accumulate total
    v_total := v_total + (v_cart_item.quantity * v_cart_item.price_per_vial);
  END LOOP;
  
  -- Create order with shipping information
  INSERT INTO orders (
    user_id, 
    batch_id, 
    status, 
    total,
    shipping_name,
    shipping_address,
    shipping_phone,
    delivery_method
  )
  VALUES (
    p_user, 
    p_batch, 
    'PENDING', 
    v_total,
    p_shipping_name,
    p_shipping_address,
    p_shipping_phone,
    p_delivery_method
  )
  RETURNING id INTO v_order;
  
  -- Copy cart items to order items
  INSERT INTO order_items (order_id, batch_peptide_id, quantity, price_per_vial)
  SELECT v_order, ci.batch_peptide_id, ci.quantity, bp.price_per_vial
  FROM cart_items ci
  JOIN batch_peptides bp ON bp.id = ci.batch_peptide_id
  WHERE ci.cart_id = v_cart;
  
  -- Clear the cart
  DELETE FROM cart_items WHERE cart_id = v_cart;
  
  RETURN v_order;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Verification Query (Optional - Run this to verify the changes)
-- ============================================================================

-- Check if columns were added successfully
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders' 
  AND column_name IN ('shipping_name', 'shipping_address', 'shipping_phone', 'delivery_method')
ORDER BY column_name;

-- Check if function was created successfully
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name = 'fn_checkout'
  AND routine_schema = 'public';

