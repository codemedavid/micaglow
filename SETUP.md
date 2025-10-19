# Mama Mica - Setup Guide

## Prerequisites

1. **Node.js 18+** and npm installed
2. **Supabase account** - Sign up at https://supabase.com
3. **Supabase project** created

## Step 1: Clone and Install

```bash
cd /Users/codemedavid/Documents/mama-mica
npm install
```

## Step 2: Set Up Supabase Project

1. Go to https://supabase.com and create a new project
2. Wait for the project to finish provisioning (2-3 minutes)
3. Go to Project Settings → API
4. Copy your:
   - Project URL (looks like `https://xxx.supabase.co`)
   - Anon/Public Key (starts with `eyJ...`)

## Step 3: Create Environment Variables

Create a `.env.local` file in the project root:

```bash
touch .env.local
```

Add the following content (replace with your actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_WHATSAPP=639154901224
```

## Step 4: Set Up Database

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Open the file `supabase-schema.sql` from this project
4. Copy all the SQL content
5. Paste it into the Supabase SQL Editor
6. Click "Run" to execute

This will create:
- All tables (profiles, batches, peptides, etc.)
- Views for batch statistics
- RLS policies for security
- The checkout function
- Sample seed data (peptides and whitelist numbers)

## Step 5: Enable Anonymous Authentication

1. Go to Authentication → Providers in Supabase dashboard
2. Enable "Anonymous sign-ins"
3. Click Save

This allows users to create sessions before verifying their WhatsApp number.

## Step 6: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 7: Test the Application

### Testing as a Customer

1. Go to http://localhost:3000
2. You'll be redirected to `/auth/join`
3. Enter one of the seeded WhatsApp numbers:
   - `+639154901224` (Admin - David)
   - `+639171234567` (Pilot user 1)
   - `+639181234567` (Pilot user 2)
4. Click Continue
5. You should be redirected to `/batches`

Note: There are no batches yet, so you'll need to create one as an admin.

### Testing as an Admin

1. First, sign in with the admin WhatsApp number: `+639154901224`
2. After signing in, you need to update your role in the database:
   - Go to Supabase Dashboard → Table Editor → profiles
   - Find your profile row
   - Change `role` from `customer` to `admin`
   - Save
3. Refresh the page
4. You should now see an "Admin" button in the header
5. Click it to access the admin dashboard

### Creating a Test Batch (Manual - via SQL)

Since the batch creation UI is not yet complete, you can create a test batch manually:

1. Go to Supabase SQL Editor
2. Run this SQL:

```sql
-- Create a test batch
INSERT INTO batches (name, status, opens_at, closes_at) 
VALUES ('Test Batch October 2025', 'FILLING', NOW(), NOW() + INTERVAL '7 days')
RETURNING id;
```

3. Copy the returned batch ID
4. Add peptides to the batch:

```sql
-- Replace 'YOUR_BATCH_ID' with the actual batch ID from step 3
-- Get a peptide ID first
SELECT id, name FROM peptides LIMIT 5;

-- Add peptides to batch (replace IDs)
INSERT INTO batch_peptides (batch_id, peptide_id, box_vial_min, boxes_available, price_per_vial)
VALUES 
  ('YOUR_BATCH_ID', 'PEPTIDE_ID_1', 10, 5, 950.00),
  ('YOUR_BATCH_ID', 'PEPTIDE_ID_2', 10, 3, 850.00),
  ('YOUR_BATCH_ID', 'PEPTIDE_ID_3', 10, 4, 1200.00);
```

5. Now you can see the batch on the batches page and add items to cart!

## Step 8: Testing the Complete Flow

1. **Browse Batches**: Go to `/batches` - you should see your test batch
2. **View Batch Details**: Click on the batch card
3. **Add to Cart**: 
   - Set quantity for any peptide
   - Click "Add to Cart"
4. **View Cart**: Click the "Cart" button in the header
5. **Checkout**: 
   - Click "Proceed to Checkout"
   - You'll be redirected to an order confirmation page
   - The page will automatically redirect to WhatsApp with a prefilled message
6. **View Orders**: Go to "My Orders" to see your order history

## Common Issues

### Build Error: "Cannot read properties of undefined"

This happens when environment variables are missing. Make sure:
1. `.env.local` exists in the project root
2. All required environment variables are set
3. Values don't have quotes around them

### "Not authenticated" errors

Make sure:
1. Anonymous authentication is enabled in Supabase
2. Your WhatsApp number is in the whitelist table
3. You've successfully completed the join flow

### Type Errors

The application uses `(supabase as any)` casts to work around Supabase type inference issues. In a production application, you should:
1. Run `supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts`
2. This generates accurate types from your actual database schema

### Database Errors

If you see database errors:
1. Make sure you ran the entire `supabase-schema.sql` file
2. Check Supabase logs in the dashboard
3. Verify RLS policies are enabled

## Next Steps

1. **Add More Whitelist Numbers**: Insert your own WhatsApp number in the whitelist table
2. **Create Real Batches**: Use the Supabase dashboard to create batches with real data
3. **Customize**: Update branding, colors, and content to match your needs
4. **Deploy**: Deploy to Vercel (see README.md)

## Admin Features (To Be Implemented)

The following admin features have placeholder pages but need implementation:
- Batch creation/editing UI
- Whitelist CSV upload
- Order management interface
- Batch status transitions

For now, these operations can be done via the Supabase dashboard.

## Support

For issues or questions:
- Check the README.md for detailed documentation
- Review the Supabase logs for error details
- Contact the admin via WhatsApp: +63 915 490 1224

