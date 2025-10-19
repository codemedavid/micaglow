# Peptides Separated by Strength - Implementation Guide

## Overview

Instead of having one "Tirzepatide" entry with multiple strengths, we now have:
- ✅ Tirzepatide 5mg (separate product)
- ✅ Tirzepatide 10mg (separate product)
- ✅ Tirzepatide 15mg (separate product)
- ✅ Tirzepatide 20mg (separate product)
- etc.

## Benefits of This Approach

### 1. **Better Product Management**
- Each strength is a distinct SKU
- Easier to manage in batch_peptides table
- Can set different prices per strength
- Can track inventory per strength

### 2. **Clearer User Experience**
- Users select specific strength they need
- No confusion about which strength to order
- Each product card is specific and clear
- Dosing information matches the exact product

### 3. **Simplified Ordering**
- Direct "Add to Cart" for specific strength
- No dropdown menus needed
- Clear product identification
- Better for mobile experience

### 4. **Database Efficiency**
- Simpler queries
- No need to parse strength strings
- Better indexing
- Cleaner joins with batch_peptides

## Database Structure

### Before (Combined)
```sql
INSERT INTO peptides (name, strength, ...) VALUES
('Tirzepatide', '5mg, 10mg, 15mg, 20mg', ...);
```

**Issues:**
- Need to parse strength string
- Unclear which dosing applies to which strength
- Hard to link to batch_peptides
- Confusing for users

### After (Separated)
```sql
INSERT INTO peptides (name, strength, ...) VALUES
('Tirzepatide', '5mg', ...),
('Tirzepatide', '10mg', ...),
('Tirzepatide', '15mg', ...),
('Tirzepatide', '20mg', ...);
```

**Benefits:**
- Clean, specific entries
- Each has tailored dosing info
- Direct relationship with batch_peptides
- Clear for users and admins

## Files Provided

### 1. `comprehensive-peptides-data-by-strength.sql`
Contains all major peptides separated by strength:

**Included peptides:**
- ✅ Semaglutide (2mg, 5mg, 10mg, 15mg, 20mg, 30mg)
- ✅ Tirzepatide (5mg, 10mg, 15mg, 20mg, 30mg, 40mg, 50mg, 60mg)
- ✅ Retatrutide (5mg, 10mg, 15mg, 20mg, 30mg)
- ✅ BPC-157 (5mg, 10mg)
- ✅ TB-500 (5mg, 10mg)
- And more...

### 2. Pattern to Follow
For any peptide with multiple strengths, create separate entries:

```sql
INSERT INTO peptides (name, strength, vendor, category, description, mechanism, half_life, storage, benefits, side_effects, contraindications, dosing, stacking, icon, is_active) VALUES
-- First strength
(
  'Peptide Name',
  '5mg',
  'VendorName',
  'Category',
  'Same description for all strengths',
  'Same mechanism for all strengths',
  'Same half-life',
  'Store in refrigerator (2-8°C)',
  '["Same benefits"]'::jsonb,
  '["Same side effects"]'::jsonb,
  '["Same contraindications"]'::jsonb,
  '[{"vialSize": "5MG", "reconstitution": "Mix with 1mL BAC water", "frequency": "Dose weekly", "subcutaneous": "Specific to 5mg"}]'::jsonb,
  '["Same stacking"]'::jsonb,
  '💊',
  true
),
-- Second strength
(
  'Peptide Name',
  '10mg',
  'VendorName',
  'Category',
  'Same description for all strengths',
  'Same mechanism for all strengths',
  'Same half-life',
  'Store in refrigerator (2-8°C)',
  '["Same benefits"]'::jsonb,
  '["Same side effects"]'::jsonb,
  '["Same contraindications"]'::jsonb,
  '[{"vialSize": "10MG", "reconstitution": "Mix with 2mL BAC water", "frequency": "Dose weekly", "subcutaneous": "Specific to 10mg"}]'::jsonb,
  '["Same stacking"]'::jsonb,
  '💊',
  true
);
```

## Installation

### Step 1: Backup Your Database
```bash
pg_dump your_database > backup_$(date +%Y%m%d).sql
```

### Step 2: Clear Existing Peptides (Optional)
If you want to start fresh:
```sql
TRUNCATE TABLE peptides CASCADE;
```

**⚠️ WARNING:** This will delete ALL existing peptides and related batch_peptides. Only do this if you're sure!

### Step 3: Run the Migration
First, ensure the schema is updated:
```sql
-- Run: migrate-peptides-comprehensive.sql
```

### Step 4: Load Peptides by Strength
```sql
-- Run: comprehensive-peptides-data-by-strength.sql
```

## Querying Peptides

### Get All Strengths of a Peptide
```sql
SELECT name, strength, id
FROM peptides
WHERE name = 'Tirzepatide'
  AND is_active = true
ORDER BY 
  CASE 
    WHEN strength ~ '^[0-9]+mg$' 
    THEN CAST(REGEXP_REPLACE(strength, '[^0-9]', '', 'g') AS INTEGER)
    ELSE 999999
  END;
```

### Group Peptides by Name
```sql
SELECT 
  name,
  category,
  COUNT(*) as variant_count,
  STRING_AGG(strength, ', ' ORDER BY strength) as available_strengths
FROM peptides
WHERE is_active = true
GROUP BY name, category
ORDER BY name;
```

### Find Specific Strength
```sql
SELECT *
FROM peptides
WHERE name = 'Tirzepatide'
  AND strength = '10mg'
  AND is_active = true;
```

## UI Display Options

### Option 1: Show All Variants (Current Approach)
Display each strength as a separate card in the product grid.

**Pros:**
- Simple to implement
- Clear product distinction
- Easy to add to cart

**Cons:**
- More cards to display
- Takes more screen space

### Option 2: Grouped Display with Dropdown
Group by name, show dropdown for strength selection.

**Pros:**
- Cleaner grid
- Less scrolling

**Cons:**
- Extra interaction step
- More complex UI

### Option 3: Expandable Cards
Show main peptide, click to expand and see all strengths.

**Pros:**
- Clean initial view
- Progressive disclosure

**Cons:**
- Hidden options initially
- Requires JavaScript

## Recommended: Option 1 (Current)

The current approach of showing each strength as a separate card is recommended because:

1. **Mobile-First**: Direct tap to select
2. **Clear Pricing**: Each card shows exact price
3. **Simple UX**: No dropdowns or selections needed
4. **Better for Batches**: Each batch_peptide entry is clear
5. **Search-Friendly**: Can search "Tirzepatide 10mg" directly

## Managing in Admin

### Add New Strength Variant

```typescript
// Admin form
const newPeptide = {
  name: 'Tirzepatide',
  strength: '70mg', // NEW strength
  vendor: 'VendorName',
  category: 'Weight Loss & Metabolic',
  description: '...', // Copy from existing
  mechanism: '...', // Copy from existing
  // ... other fields
  dosing: [
    {
      vialSize: '70MG',
      reconstitution: 'Mix with 3.5mL BAC water',
      frequency: 'Dose weekly',
      subcutaneous: 'Calculate doses for 70mg',
    }
  ],
}
```

### Bulk Operations

To add a new strength to all GLP-1 peptides:

```sql
-- Example: Add 25mg variant for all Semaglutide-like peptides
INSERT INTO peptides (name, strength, vendor, category, description, mechanism, half_life, storage, benefits, side_effects, contraindications, dosing, stacking, icon, is_active)
SELECT 
  name,
  '25mg', -- NEW strength
  vendor,
  category,
  description,
  mechanism,
  half_life,
  storage,
  benefits,
  side_effects,
  contraindications,
  -- Update dosing for 25mg
  '[{"vialSize": "25MG", "reconstitution": "Mix with 5mL BAC water", "frequency": "Dose weekly", "subcutaneous": "25mg doses"}]'::jsonb,
  stacking,
  icon,
  true
FROM peptides
WHERE name = 'Semaglutide'
  AND strength = '20mg'; -- Copy from existing
```

## Helper View

A view to group peptides by name:

```sql
CREATE OR REPLACE VIEW v_peptides_grouped AS
SELECT 
  name,
  category,
  ARRAY_AGG(DISTINCT strength ORDER BY strength) as available_strengths,
  COUNT(*) as variant_count,
  MIN(id) as primary_id
FROM peptides
WHERE is_active = true
GROUP BY name, category
ORDER BY name;

-- Usage
SELECT * FROM v_peptides_grouped;
```

## Migration from Combined to Separated

If you have existing combined peptides:

```sql
-- Step 1: Backup
CREATE TABLE peptides_backup AS SELECT * FROM peptides;

-- Step 2: Clear
TRUNCATE TABLE peptides CASCADE;

-- Step 3: Load new structure
-- Run: comprehensive-peptides-data-by-strength.sql

-- Step 4: Verify
SELECT name, COUNT(*) FROM peptides GROUP BY name;
```

## Best Practices

### 1. **Consistent Naming**
- Always use peptide name without strength in `name` field
- Put strength in `strength` field
- Example: name='Tirzepatide', strength='10mg'

### 2. **Dosing Information**
- Each variant should have dosing specific to that vial size
- Include reconstitution volumes
- Provide dose calculations

### 3. **Vendor & Category**
- Keep consistent across all strengths of same peptide
- Makes filtering easier

### 4. **Icons**
- Use same icon for all strengths of same peptide
- Visual consistency

### 5. **Is Active Flag**
- Only set `is_active = true` for available strengths
- Easy to retire old strengths

## Testing Checklist

After implementation:

- [ ] Each peptide strength appears as separate card
- [ ] Dosing information specific to each strength
- [ ] Can add specific strength to cart
- [ ] Price displays correctly per strength
- [ ] Search works for "Peptide 10mg" format
- [ ] Filter by category works
- [ ] Detail dialog shows correct strength info
- [ ] No duplicate entries
- [ ] All strengths marked active

## Performance Considerations

### Query Performance
```sql
-- Good: Direct strength match
SELECT * FROM peptides WHERE name = 'Tirzepatide' AND strength = '10mg';

-- Good: Get all strengths of peptide
SELECT * FROM peptides WHERE name = 'Tirzepatide' ORDER BY strength;

-- Avoid: Wildcard searches on strength
SELECT * FROM peptides WHERE strength LIKE '%10%'; -- Slow!
```

### Indexing
```sql
-- Recommended indexes
CREATE INDEX idx_peptides_name ON peptides(name);
CREATE INDEX idx_peptides_strength ON peptides(strength);
CREATE INDEX idx_peptides_name_strength ON peptides(name, strength);
CREATE INDEX idx_peptides_category_active ON peptides(category, is_active);
```

## Summary

**This approach provides:**
- ✅ Clear product separation
- ✅ Better user experience
- ✅ Simpler database structure
- ✅ Easier inventory management
- ✅ More flexible pricing
- ✅ Better for e-commerce

**Result:**
Each peptide strength is now a first-class product that can be independently managed, priced, and sold!

---

**Questions?** This is the recommended approach for e-commerce peptide catalogs.

