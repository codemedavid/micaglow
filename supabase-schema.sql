-- Mama Mica Database Schema
-- This file contains the complete database schema for the Mama Mica peptides group buy application

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Users & Profiles
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  whatsapp_e164 text unique, -- e.g., "+639154901224"
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz default now()
);

create table whatsapp_whitelist (
  id bigserial primary key,
  whatsapp_e164 text unique not null,
  note text,
  created_at timestamptz default now()
);

-- Batches & Peptides
create table batches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'DRAFT' 
    check (status in ('DRAFT','OPEN','FILLING','LOCKED','PAYMENT','CLOSED')),
  opens_at timestamptz,
  closes_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table peptides (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  strength text,          -- e.g., 5mg
  vendor text,
  category text,
  created_at timestamptz default now()
);

-- Peptide availability per batch
create table batch_peptides (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references batches(id) on delete cascade,
  peptide_id uuid references peptides(id) on delete cascade,
  box_vial_min int not null check (box_vial_min > 0),
  boxes_available int not null check (boxes_available >= 0),
  price_per_vial numeric(10,2) not null check (price_per_vial >= 0),
  vials_filled int not null default 0 check (vials_filled >= 0),
  unique(batch_id, peptide_id)
);

-- Cart & Orders
create table carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  batch_id uuid references batches(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, batch_id)
);

create table cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid references carts(id) on delete cascade,
  batch_peptide_id uuid references batch_peptides(id) on delete cascade,
  quantity int not null check (quantity > 0)
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  batch_id uuid references batches(id),
  status text not null default 'PENDING' check (status in ('PENDING','VERIFIED','INVALID','CANCELLED')),
  total numeric(10,2) not null default 0,
  created_at timestamptz default now(),
  whatsapp_message text -- snapshot of message sent
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  batch_peptide_id uuid references batch_peptides(id),
  quantity int not null check (quantity > 0),
  price_per_vial numeric(10,2) not null
);

-- Optional: WhatsApp event log
create table whatsapp_logs (
  id bigserial primary key,
  order_id uuid references orders(id) on delete cascade,
  to_number text not null,
  message text not null,
  created_at timestamptz default now()
);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Total vials capacity per batch_peptide
create or replace view v_batch_peptide_capacity as
select bp.id as batch_peptide_id,
       (bp.boxes_available * bp.box_vial_min) as total_vials,
       bp.vials_filled
from batch_peptides bp;

-- Batch overall fill percentage
create or replace view v_batch_fill as
select b.id as batch_id,
       sum(bp.boxes_available * bp.box_vial_min) as total_vials,
       sum(bp.vials_filled) as vials_filled,
       round( (sum(bp.vials_filled)::numeric / nullif(sum(bp.boxes_available * bp.box_vial_min),0)) * 100, 2) as pct
from batches b
left join batch_peptides bp on bp.batch_id = b.id
group by b.id;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Checkout function with transactional guards
create or replace function fn_checkout(
  p_user uuid, 
  p_batch uuid,
  p_shipping_name text,
  p_shipping_address text,
  p_shipping_phone text,
  p_delivery_method text
) 
returns uuid as $$
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
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Profiles: user can read/update self
create policy "profile_self_read" on profiles
  for select using (id = auth.uid());

create policy "profile_self_update" on profiles
  for update using (id = auth.uid());

-- Batches: everyone can read open batches
create policy "batches_read" on batches
  for select using (status in ('OPEN','FILLING','LOCKED','PAYMENT'));

-- Batch peptides: everyone can read
create policy "batch_peptides_read" on batch_peptides
  for select using (true);

-- Carts: user can manage their own cart
create policy "carts_by_owner" on carts
  for all using (user_id = auth.uid());

-- Cart items: user can manage items in their cart
create policy "cart_items_by_owner" on cart_items
  for all using (cart_id in (select id from carts where user_id = auth.uid()));

-- Orders: user can read their own orders, admin can read all
create policy "orders_read" on orders
  for select using (
    user_id = auth.uid() or 
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Order items: user can read items from their orders, admin can read all
create policy "order_items_read" on order_items
  for select using (
    order_id in (select id from orders where user_id = auth.uid()) or
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ============================================================================
-- INDEXES
-- ============================================================================

create index idx_profiles_whatsapp on profiles(whatsapp_e164);
create index idx_batch_peptides_batch on batch_peptides(batch_id);
create index idx_batch_peptides_peptide on batch_peptides(peptide_id);
create index idx_carts_user on carts(user_id);
create index idx_carts_batch on carts(batch_id);
create index idx_cart_items_cart on cart_items(cart_id);
create index idx_orders_user on orders(user_id);
create index idx_orders_batch on orders(batch_id);
create index idx_order_items_order on order_items(order_id);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert sample whitelist numbers (for testing)
insert into whatsapp_whitelist (whatsapp_e164, note) values
 ('+639154901224','Admin - David'),
 ('+639171234567','Pilot user 1'),
 ('+639181234567','Pilot user 2');

-- Insert sample peptides
insert into peptides (name, strength, vendor, category) values
 ('BPC-157','5mg','VendorA','Healing'),
 ('TB-500','5mg','VendorA','Performance'),
 ('CJC-1295','2mg','VendorB','Growth Hormone'),
 ('Ipamorelin','5mg','VendorB','Growth Hormone'),
 ('GHRP-6','5mg','VendorA','Growth Hormone'),
 ('Melanotan II','10mg','VendorC','Cosmetic'),
 ('Thymosin Alpha-1','5mg','VendorA','Immune'),
 ('Selank','5mg','VendorC','Cognitive'),
 ('Semax','5mg','VendorC','Cognitive'),
 ('Epithalon','10mg','VendorB','Anti-Aging');

-- Note: Batches and admin users should be created through the application UI

