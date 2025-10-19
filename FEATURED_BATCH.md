# ⭐ Featured Batch System

## 🎯 What Changed

**Customers now see only ONE featured batch** at a time on the main page!

## ✅ Features Implemented

### 1. Featured Batch Flag
- Added `is_featured` column to batches table
- Only one batch can be featured at a time
- Admin controls which batch customers see

### 2. Customer View - Single Batch
**Before:**
```
/batches page showed all open batches (could be 10+)
```

**Now:**
```
/batches page shows ONLY the featured batch
Focused, clean, single batch display
```

### 3. Admin Control
- **Set Featured** button in batches list
- Auto-unfeatured other batches when you set a new one
- Visual indicator showing which is featured
- Featured batch highlighted in admin table

## 🚀 Setup

### Step 1: Run Database Migration

**In Supabase SQL Editor, run:**

```sql
-- File: add-featured-batch.sql

ALTER TABLE batches 
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_batches_featured 
ON batches(is_featured) WHERE is_featured = true;

-- Function to set featured batch
CREATE OR REPLACE FUNCTION set_featured_batch(batch_id_param uuid)
RETURNS void AS $$
BEGIN
  UPDATE batches SET is_featured = false WHERE is_featured = true;
  UPDATE batches SET is_featured = true WHERE id = batch_id_param;
END;
$$ LANGUAGE plpgsql;
```

### Step 2: Set Your Featured Batch

**Via Admin UI:**
1. Go to `/admin/batches`
2. Find the batch you want to feature
3. Click **"Set Featured"** button
4. Confirm
5. Done! ✅

**Via SQL (Quick):**
```sql
-- Replace with your batch ID
SELECT set_featured_batch('your-batch-id-here');
```

## 📱 How It Works

### Customer Experience

**Batches Page (`/batches`):**
```
Shows ONLY the current featured batch

⭐ Current Featured Batch

[Large featured batch card]
- Batch name
- Status badge
- Fill progress
- Closes date
- "View Details" button
```

**Benefits:**
- ✅ Clean, focused view
- ✅ No confusion about which batch to order from
- ✅ Clear call-to-action
- ✅ Better mobile experience
- ✅ Faster loading (only 1 batch)

### Admin Experience

**Batches List (`/admin/batches`):**

| Name | Status | Featured | Actions |
|------|--------|----------|---------|
| Nov 2024 Batch | FILLING | ⭐ Yes | Edit Delete |
| Oct 2024 Batch | CLOSED | [Set Featured] | Edit Delete |
| Dec 2024 Batch | DRAFT | [Set Featured] | Edit Delete |

**Features:**
- Featured batch has purple background
- Featured badge shows ⭐ icon
- "Set Featured" button for non-featured batches
- Only ONE batch can be featured at a time

## 🎨 UI Updates

### Customer Batches Page

**Layout:**
- Centered, max-width container
- Large featured batch card
- Badge: "⭐ Current Featured Batch"
- Full-width for better visibility

**Empty State:**
- "No current batch available"
- Clean messaging
- Encourages checking back

### Admin Batches Page

**New Column: "Featured"**
- Shows purple ⭐ badge if featured
- Shows "Set Featured" button if not
- Click to toggle featured status

**Visual Indicators:**
- Featured row: Purple background (`bg-primary/5`)
- Featured badge in batch name
- Star icon for quick identification

## 🔧 Technical Details

### Database

**Column Added:**
```sql
batches.is_featured BOOLEAN DEFAULT false
```

**Index Added:**
```sql
idx_batches_featured (WHERE is_featured = true)
```

**Function Added:**
```sql
set_featured_batch(batch_id_param UUID)
- Unfeatured all batches
- Features the selected batch
- Atomic operation
```

### API

**Customer Query:**
```typescript
getBatches() 
  .eq('is_featured', true)
  // Returns only featured batches
```

**Admin Function:**
```typescript
setFeaturedBatch(batchId)
  .rpc('set_featured_batch')
  // Atomically switches featured batch
```

### Performance

**Optimized Query:**
```sql
-- Before: Could return 10+ batches
SELECT * FROM batches WHERE status IN (...)

-- After: Returns max 1 batch
SELECT * FROM batches 
WHERE status IN (...) AND is_featured = true
```

**Result:**
- ⚡ Faster queries (indexed)
- ⚡ Less data transferred
- ⚡ Cleaner UI

## 📋 Usage Guide

### For Admin

**Setting the Featured Batch:**

1. **Go to `/admin/batches`**
2. **Find the batch** you want to feature
3. **Click "Set Featured"** in the Featured column
4. **Confirm** the dialog
5. See toast: "Featured batch updated!"
6. Featured badge appears
7. Customers now see this batch!

**Switching Featured Batch:**

1. When you set a new batch as featured
2. Previous featured batch automatically unfeatured
3. Only ONE batch featured at any time
4. Instant update on customer page

**Best Practices:**

- ✅ Feature your active FILLING batch
- ✅ Unfeature when batch goes to PAYMENT or CLOSED
- ✅ Feature next batch when ready
- ✅ Keep it simple - one active batch at a time

### For Customers

**What They See:**

1. Go to `/batches`
2. See ONE featured batch prominently
3. Large card with all details
4. Clear "View Details" button
5. No confusion about which to order from

**Benefits:**
- Simple decision making
- Clear what's currently active
- Better focus
- Faster page load

## 🎯 Workflow Example

**Month 1: November Batch**
```bash
Admin:
1. Create "November 2024 Batch"
2. Add all peptides
3. Set status to FILLING
4. Click "Set Featured" ⭐
5. Customers see it!

Customer:
- Sees "November 2024 Batch" only
- Clear this is the current batch
- Orders from it
```

**Month 2: December Batch**
```bash
Admin:
1. November batch fills up
2. Change November to PAYMENT
3. Create "December 2024 Batch"
4. Set up peptides
5. Set status to FILLING
6. Click "Set Featured" on December ⭐
7. December now featured, November automatically unfeatured

Customer:
- Now sees "December 2024 Batch" only
- Previous batch no longer shown
- Clean transition
```

## 💡 Why This is Better

**Before:**
- ❌ Multiple batches shown
- ❌ Customer confusion
- ❌ Which one to order from?
- ❌ Cluttered interface

**Now:**
- ✅ ONE clear batch
- ✅ No confusion
- ✅ Focused experience
- ✅ Clean, simple UI
- ✅ Admin controls what's shown

## 🎨 Visual Design

**Customer Page:**
```
    [ ⭐ Current Featured Batch ]

    ┌─────────────────────────────────┐
    │  November 2024 Group Buy        │
    │  [FILLING Badge]                │
    │                                 │
    │  Progress: 75% filled           │
    │  ████████████░░░░ 38/50 vials  │
    │                                 │
    │  Closes: Nov 30, 2024           │
    │                                 │
    │  [View Details →]               │
    └─────────────────────────────────┘

    Centered, prominent, unmissable
```

**Admin Page:**
```
Row 1: Nov 2024  [FILLING] [⭐ Yes]      Edit Delete
Row 2: Oct 2024  [CLOSED]  [Set Featured] Edit Delete
Row 3: Dec 2024  [DRAFT]   [Set Featured] Edit Delete

Purple highlight on featured row
```

## ✅ Checklist

**Setup:**
- [ ] Run `add-featured-batch.sql` in Supabase
- [ ] Go to `/admin/batches`
- [ ] Click "Set Featured" on your current batch
- [ ] Verify featured badge appears
- [ ] Go to `/batches` as customer
- [ ] See only the featured batch

**Test:**
- [ ] Set different batch as featured
- [ ] Verify previous batch unfeatured automatically
- [ ] Check customer page shows new batch
- [ ] Verify only ONE batch shows

## 🎉 Summary

**What You Get:**
- ⭐ Featured batch system
- 🎯 Single batch focus for customers
- 🔄 Easy switching between batches
- 📊 Admin control over what's shown
- ⚡ Faster customer page (1 batch vs 10)
- 💜 Clean, purple-themed UI

**How to Use:**
1. Run the SQL migration
2. Click "Set Featured" on your active batch
3. Customers see only that batch
4. Switch featured batch anytime
5. Only one featured at a time!

**Customers get a clean, focused experience!** ⭐💜

