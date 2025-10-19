-- Fix WhatsApp Login from Multiple Devices + Password Authentication
-- Run this in Supabase SQL Editor

-- ⚠️ CRITICAL: Before running this SQL, configure Email provider:
-- 
-- Step 1: Go to Supabase Dashboard → Authentication → Providers
-- Step 2: Find "Email" and toggle it ON
-- Step 3: ⚠️ UNCHECK "Confirm email" checkbox
--         (This is REQUIRED - anonymous users can't receive confirmation emails)
-- Step 4: ⚠️ UNCHECK "Secure email change" checkbox (if present)
-- Step 5: Click "Save"
--
-- If you skip this, password creation will fail with errors like:
-- - "Email address is invalid"
-- - "Signups not allowed for otp"
-- - "Email confirmation required"

-- 1. Create a function to safely check if WhatsApp exists (without exposing user IDs)
CREATE OR REPLACE FUNCTION public.check_whatsapp_exists(phone_number text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE whatsapp_e164 = phone_number
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.check_whatsapp_exists(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_whatsapp_exists(text) TO anon;

-- 3. The function above uses SECURITY DEFINER to bypass RLS
-- This is safe because it only returns a boolean, not user data
-- No additional RLS policies needed

-- 4. Create function to transfer WhatsApp from anonymous to email user
CREATE OR REPLACE FUNCTION public.transfer_whatsapp_to_new_user(
  old_user_id uuid,
  new_user_id uuid
)
RETURNS void AS $$
DECLARE
  whatsapp_num text;
BEGIN
  -- Get WhatsApp from old user
  SELECT whatsapp_e164 INTO whatsapp_num
  FROM public.profiles
  WHERE id = old_user_id;
  
  IF whatsapp_num IS NOT NULL THEN
    -- Remove WhatsApp from old user
    UPDATE public.profiles
    SET whatsapp_e164 = NULL
    WHERE id = old_user_id;
    
    -- Add WhatsApp to new user
    INSERT INTO public.profiles (id, whatsapp_e164, role)
    VALUES (new_user_id, whatsapp_num, 'customer')
    ON CONFLICT (id) DO UPDATE
    SET whatsapp_e164 = whatsapp_num;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.transfer_whatsapp_to_new_user(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.transfer_whatsapp_to_new_user(uuid, uuid) TO anon;

-- 5. Optional: Create a function to clean up orphaned anonymous users
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_anonymous_users()
RETURNS void AS $$
BEGIN
  -- Delete anonymous users who don't have a whatsapp_e164 in their profile
  -- and were created more than 24 hours ago
  DELETE FROM auth.users
  WHERE is_anonymous = true
  AND id NOT IN (
    SELECT id FROM public.profiles WHERE whatsapp_e164 IS NOT NULL
  )
  AND created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Verify setup
SELECT 'Setup Complete! ✅' as status;
SELECT 'You can now check WhatsApp numbers across devices.' as message;

