# Troubleshooting Guide

## ❌ Error: "Failed to create session"

### Problem
You see this error when trying to enter your WhatsApp number on the join page.

### Solution
Anonymous authentication is not enabled in your Supabase project.

**Steps to fix:**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **Authentication** in the left sidebar
4. Click **Providers** tab
5. Scroll down to find **"Anonymous sign-ins"**
6. Toggle it **ON** (it should turn green)
7. Click **Save** button
8. Return to your app and try again

### Why This is Needed
The app uses anonymous authentication to create a temporary session before verifying the WhatsApp number. This allows us to store the user's profile after WhatsApp verification.

---

## ❌ Error: "This WhatsApp number is not authorized"

### Problem
Your WhatsApp number is not in the whitelist.

### Solution

**Option 1: Add via Supabase Dashboard**
1. Go to Supabase Dashboard → Table Editor
2. Open the `whatsapp_whitelist` table
3. Click **Insert row**
4. Fill in:
   - `whatsapp_e164`: Your number in E.164 format (e.g., `+639154901224`)
   - `note`: Optional note (e.g., "My account")
5. Click **Save**

**Option 2: Add via SQL**
```sql
INSERT INTO whatsapp_whitelist (whatsapp_e164, note)
VALUES ('+639171234567', 'My account');
```

---

## ❌ Error: "No batches available"

### Problem
You can sign in but see no batches.

### Solution
Create a test batch using SQL:

```sql
-- 1. Create a batch
INSERT INTO batches (name, status, opens_at, closes_at) 
VALUES ('Test Batch', 'FILLING', NOW(), NOW() + INTERVAL '7 days')
RETURNING id;

-- 2. Get some peptide IDs
SELECT id, name FROM peptides LIMIT 5;

-- 3. Add peptides to batch (replace YOUR_BATCH_ID and PEPTIDE_IDs)
INSERT INTO batch_peptides (batch_id, peptide_id, box_vial_min, boxes_available, price_per_vial)
VALUES 
  ('YOUR_BATCH_ID', 'PEPTIDE_ID_1', 10, 5, 950.00),
  ('YOUR_BATCH_ID', 'PEPTIDE_ID_2', 10, 3, 850.00),
  ('YOUR_BATCH_ID', 'PEPTIDE_ID_3', 10, 4, 1200.00);
```

---

## ❌ Error: "Admin button not showing"

### Problem
You're signed in with the admin WhatsApp number but don't see the admin button.

### Solution
Update your role in the database:

1. Go to Supabase Dashboard → Table Editor
2. Open the `profiles` table
3. Find your profile (search by your WhatsApp number)
4. Double-click the `role` cell
5. Change from `customer` to `admin`
6. Press Enter to save
7. Refresh your browser

---

## ❌ Build Error: "Cannot read properties of undefined"

### Problem
`npm run build` fails with webpack errors.

### Solution
This is a known issue with static generation when environment variables are missing at build time. The app works fine in development mode.

**For development:**
```bash
npm run dev  # This works perfectly
```

**For production:**
- Deploy to Vercel with environment variables set
- The build will succeed in Vercel's environment

---

## ❌ Error: "Database connection failed"

### Problem
Can't connect to Supabase.

### Checklist
1. Verify `.env.local` exists in project root
2. Check the values are correct (no quotes around them)
3. Verify your Supabase project is active
4. Check the Supabase URL doesn't have trailing slash
5. Restart your dev server after changing env vars

**Correct format:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_ADMIN_WHATSAPP=639154901224
```

---

## ❌ Error: "RLS policy violation"

### Problem
Database queries fail with policy errors.

### Solution
Make sure you ran the complete `supabase-schema.sql` file:

1. Go to Supabase Dashboard → SQL Editor
2. Open a new query
3. Copy the ENTIRE contents of `supabase-schema.sql`
4. Paste and run
5. Check for any error messages

---

## ❌ WhatsApp redirect not working

### Problem
After checkout, WhatsApp doesn't open.

### Checklist
1. Make sure `NEXT_PUBLIC_ADMIN_WHATSAPP` is set in `.env.local`
2. Use the number format without `+` (e.g., `639154901224`)
3. Test on a device that has WhatsApp installed
4. Check browser console for errors

---

## ❌ Type errors when building

### Problem
TypeScript errors about Supabase types.

### Why This Happens
The app uses `(supabase as any)` to work around Supabase type inference issues. This is a known limitation.

### Solution (Optional)
Generate proper types from your schema:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Generate types
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

Then remove the `as any` casts and the types should work properly.

---

## 🔍 General Debugging Steps

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

2. **Check Supabase Logs**
   - Go to Supabase Dashboard → Logs
   - Filter by error level
   - Look for auth or database errors

3. **Restart Dev Server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Clear Browser Data**
   - Clear cookies and local storage
   - Try incognito/private mode

5. **Verify Database Setup**
   ```sql
   -- Check if tables exist
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   
   -- Check whitelist
   SELECT * FROM whatsapp_whitelist;
   
   -- Check if RLS is enabled
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

---

## 📞 Still Having Issues?

If none of these solutions work:

1. Check the browser console for specific error messages
2. Check Supabase logs for database errors
3. Verify all environment variables are set correctly
4. Make sure you're using Node.js 18 or higher
5. Try deleting `node_modules` and `.next` and reinstalling:
   ```bash
   rm -rf node_modules .next
   npm install
   npm run dev
   ```

---

## ✅ Quick Health Check

Run these checks to verify everything is set up:

**1. Environment Variables**
```bash
cat .env.local
# Should show your Supabase URL, anon key, and admin WhatsApp
```

**2. Database Tables**
Go to Supabase → Table Editor and verify these tables exist:
- profiles
- whatsapp_whitelist
- batches
- peptides
- batch_peptides
- carts
- cart_items
- orders
- order_items
- whatsapp_logs

**3. Anonymous Auth**
Supabase → Authentication → Providers → Anonymous sign-ins should be **ON**

**4. Whitelist**
Check your WhatsApp number is in the `whatsapp_whitelist` table

**5. Seed Data**
The `peptides` table should have 10 sample peptides

---

## 🎯 Most Common Issues (in order)

1. ✅ Anonymous auth not enabled → Enable it in Supabase
2. ✅ WhatsApp number not whitelisted → Add it to the table
3. ✅ Database schema not run → Run supabase-schema.sql
4. ✅ Environment variables not set → Create .env.local
5. ✅ Role not set to admin → Update in profiles table

