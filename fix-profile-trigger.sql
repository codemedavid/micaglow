-- Fix Profile Creation Issue
-- Run this in Supabase SQL Editor

-- 1. Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'customer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create trigger to call function on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Update RLS policies to allow profile creation
DROP POLICY IF EXISTS "profile_self_update" ON profiles;
CREATE POLICY "profile_self_update" ON profiles
  FOR ALL USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 4. Allow users to insert their own profile
DROP POLICY IF EXISTS "profile_self_insert" ON profiles;
CREATE POLICY "profile_self_insert" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- 5. Verify the setup
SELECT 'Setup Complete! ✅' as status;

