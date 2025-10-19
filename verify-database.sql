-- Database Verification Script
-- Run this in Supabase SQL Editor to verify your setup

-- 1. Check if all required tables exist
SELECT 
  'Tables Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 10 THEN '✅ All tables exist'
    ELSE '❌ Missing tables. Run supabase-schema.sql'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'profiles', 'whatsapp_whitelist', 'batches', 'peptides', 
    'batch_peptides', 'carts', 'cart_items', 'orders', 
    'order_items', 'whatsapp_logs'
  );

-- 2. Check if whitelist has entries
SELECT 
  'Whitelist Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Whitelist has entries'
    ELSE '❌ Whitelist is empty. Add your WhatsApp number'
  END as status
FROM whatsapp_whitelist;

-- 3. Check if your number is in whitelist
SELECT 
  'Your Number Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ +639154901224 is whitelisted'
    ELSE '❌ +639154901224 NOT in whitelist'
  END as status
FROM whatsapp_whitelist 
WHERE whatsapp_e164 = '+639154901224';

-- 4. Check if peptides table has seed data
SELECT 
  'Peptides Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 10 THEN '✅ Peptides seed data loaded'
    ELSE '⚠️ Peptides table might be empty'
  END as status
FROM peptides;

-- 5. Check if RLS is enabled
SELECT 
  'RLS Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 5 THEN '✅ RLS enabled on required tables'
    ELSE '⚠️ RLS might not be configured'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = true
  AND tablename IN ('profiles', 'carts', 'cart_items', 'orders', 'order_items');

-- 6. Show all whitelisted numbers
SELECT 
  '--- Whitelisted Numbers ---' as info,
  whatsapp_e164,
  note,
  created_at
FROM whatsapp_whitelist
ORDER BY created_at DESC;

-- 7. Show available peptides
SELECT 
  '--- Available Peptides ---' as info,
  name,
  strength,
  vendor,
  category
FROM peptides
ORDER BY name;

-- 8. Show existing batches (if any)
SELECT 
  '--- Existing Batches ---' as info,
  name,
  status,
  opens_at,
  closes_at
FROM batches
ORDER BY created_at DESC;

