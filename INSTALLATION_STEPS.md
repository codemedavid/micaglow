# Installation Steps for Peptide Database Upgrade

## Prerequisites

Make sure you have access to your Supabase database and have Node.js installed.

## Step 1: Install Required Dependencies

Run the following command to install the Radix UI Tabs component:

```bash
npm install @radix-ui/react-tabs
```

## Step 2: Apply Database Migration

### Option A: Via Supabase Dashboard (Recommended)

1. Open your Supabase Dashboard
2. Navigate to the SQL Editor
3. Open `migrate-peptides-comprehensive.sql`
4. Copy and paste the entire contents
5. Click "Run" to execute the migration

### Option B: Via Command Line (If you have direct database access)

```bash
psql your_database_url < migrate-peptides-comprehensive.sql
```

## Step 3: Load Comprehensive Peptide Data

### Option A: Via Supabase Dashboard

1. Open your Supabase Dashboard
2. Navigate to the SQL Editor
3. Open `comprehensive-peptides-data.sql`
4. Copy and paste the entire contents (this is a large file, it may take a moment)
5. Click "Run" to execute
6. Wait for completion (may take 1-2 minutes)

### Option B: Via Command Line

```bash
psql your_database_url < comprehensive-peptides-data.sql
```

## Step 4: Verify Installation

1. Go to Supabase Dashboard → Table Editor → `peptides` table
2. You should see new columns: `description`, `mechanism`, `benefits`, etc.
3. Check that peptides have data in the new columns
4. Sample verification query:

```sql
SELECT 
  name, 
  category,
  description IS NOT NULL as has_description,
  benefits IS NOT NULL as has_benefits,
  dosing IS NOT NULL as has_dosing
FROM peptides 
WHERE is_active = true
LIMIT 5;
```

## Step 5: Test the Application

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `/batches/[any-batch-id]`
3. You should see "Details" buttons on peptide cards
4. Click a "Details" button to see the comprehensive peptide information dialog
5. Test all tabs: Overview, Dosing, Safety, Stacking

## Expected Results

After successful installation:

✅ New database columns are created  
✅ Comprehensive peptide data is loaded  
✅ Peptide cards show "Details" buttons  
✅ Clicking "Details" opens a dialog with tabs  
✅ All tabs display rich information  
✅ No TypeScript or linting errors  

## Troubleshooting

### Issue: "@radix-ui/react-tabs not found"
**Solution**: Run `npm install @radix-ui/react-tabs`

### Issue: "Column does not exist"
**Solution**: Make sure you ran the migration SQL file first before loading data

### Issue: "Tabs component not rendering"
**Solution**: Clear your Next.js cache:
```bash
rm -rf .next
npm run dev
```

### Issue: "Cannot read properties of undefined"
**Solution**: Make sure peptides have the new fields. Check in Supabase Table Editor

### Issue: TypeScript errors
**Solution**: 
1. Make sure `src/types/database.ts` has been updated
2. Restart your TypeScript server in VS Code
3. Run `npm run lint` to check for issues

## Rollback (If Needed)

If you need to rollback the changes:

```sql
-- Remove new columns (WARNING: This will delete all the new data)
ALTER TABLE peptides 
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS mechanism,
DROP COLUMN IF EXISTS half_life,
DROP COLUMN IF EXISTS storage,
DROP COLUMN IF EXISTS benefits,
DROP COLUMN IF EXISTS side_effects,
DROP COLUMN IF EXISTS contraindications,
DROP COLUMN IF EXISTS dosing,
DROP COLUMN IF EXISTS stacking,
DROP COLUMN IF EXISTS icon,
DROP COLUMN IF EXISTS is_active,
DROP COLUMN IF EXISTS vials_per_box,
DROP COLUMN IF EXISTS specifications;
```

## Next Steps

After successful installation:

1. Review the `PEPTIDE_DATABASE_UPGRADE_GUIDE.md` for advanced usage
2. Customize the peptide detail dialog styling to match your brand
3. Add more peptides or update existing data as needed
4. Implement search and filtering features
5. Create dedicated peptide pages for SEO

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check the Supabase logs for database errors
3. Verify all files are in place:
   - `src/components/peptide-detail-dialog.tsx`
   - `src/components/ui/tabs.tsx`
   - `src/types/database.ts` (updated)
4. Make sure your environment variables are set correctly

## File Checklist

Make sure these files exist:

- ✅ `migrate-peptides-comprehensive.sql`
- ✅ `comprehensive-peptides-data.sql`
- ✅ `src/components/peptide-detail-dialog.tsx`
- ✅ `src/components/ui/tabs.tsx`
- ✅ `src/types/database.ts` (updated)
- ✅ `src/components/peptide-card.tsx` (updated)
- ✅ `PEPTIDE_DATABASE_UPGRADE_GUIDE.md`
- ✅ `INSTALLATION_STEPS.md` (this file)

## Completion

Once everything is working:

1. Test all peptide detail dialogs
2. Verify data accuracy
3. Check mobile responsiveness
4. Deploy to production when ready
5. Update your users about the new detailed product information

---

**Questions?** Refer to `PEPTIDE_DATABASE_UPGRADE_GUIDE.md` for detailed documentation.

