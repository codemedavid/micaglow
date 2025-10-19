# Peptide Database Upgrade Guide

## Overview

This guide covers the comprehensive upgrade to the peptide database, adding detailed product information including mechanisms of action, dosing protocols, benefits, side effects, and more.

## 🎯 What's New

### New Database Fields

The `peptides` table now includes:

- **`description`** (TEXT): Detailed product description and research background
- **`mechanism`** (TEXT): How the peptide works (mechanism of action)
- **`half_life`** (TEXT): Biological half-life of the peptide
- **`storage`** (TEXT): Storage requirements and conditions
- **`benefits`** (JSONB): Array of key benefits
- **`side_effects`** (JSONB): Array of potential side effects
- **`contraindications`** (JSONB): Array of contraindications
- **`dosing`** (JSONB): Array of dosing protocols by vial size
- **`stacking`** (JSONB): Array of recommended stacking combinations
- **`icon`** (TEXT): Emoji icon for visual categorization
- **`is_active`** (BOOLEAN): Whether the peptide is currently available
- **`vials_per_box`** (INTEGER): Number of vials per box
- **`specifications`** (JSONB): Technical specifications

### Performance Enhancements

- **Full-text search** on name and description
- **Indexed columns** for faster filtering (category, vendor, is_active)
- **JSONB fields** for flexible structured data

## 📦 Implementation Steps

### Step 1: Backup Your Database

```bash
# Always backup before running migrations!
pg_dump your_database > backup_$(date +%Y%m%d).sql
```

### Step 2: Run the Migration

```sql
-- Connect to your Supabase database and run:
\i migrate-peptides-comprehensive.sql
```

Or via Supabase Dashboard:
1. Go to SQL Editor
2. Copy contents of `migrate-peptides-comprehensive.sql`
3. Run the query

### Step 3: Load Comprehensive Peptide Data

```sql
-- Load all the detailed peptide information:
\i comprehensive-peptides-data.sql
```

Or via Supabase Dashboard:
1. Go to SQL Editor
2. Copy contents of `comprehensive-peptides-data.sql`
3. Run the query (this may take a minute)

### Step 4: Verify the Migration

```sql
-- Check that new columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'peptides';

-- Verify data was loaded
SELECT name, category, 
       description IS NOT NULL as has_description,
       benefits IS NOT NULL as has_benefits
FROM peptides 
LIMIT 10;
```

## 🎨 UI Component Updates

### Enhanced Peptide Card Example

```typescript
// src/components/peptide-card-detailed.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Database } from '@/types/database'

type Peptide = Database['public']['Tables']['peptides']['Row']

export function DetailedPeptideCard({ peptide }: { peptide: Peptide }) {
  const benefits = peptide.benefits as string[] || []
  const sideEffects = peptide.side_effects as string[] || []
  const contraindications = peptide.contraindications as string[] || []
  const dosing = peptide.dosing as any[] || []
  const stacking = peptide.stacking as string[] || []

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{peptide.icon || '🔬'}</span>
            <CardTitle>{peptide.name}</CardTitle>
          </div>
          {peptide.category && (
            <Badge variant="secondary">{peptide.category}</Badge>
          )}
        </div>
        {peptide.strength && (
          <p className="text-sm text-muted-foreground">{peptide.strength}</p>
        )}
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dosing">Dosing</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="stacking">Stacking</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {peptide.description && (
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{peptide.description}</p>
              </div>
            )}

            {peptide.mechanism && (
              <div>
                <h4 className="font-semibold mb-2">Mechanism of Action</h4>
                <p className="text-sm text-muted-foreground">{peptide.mechanism}</p>
              </div>
            )}

            {peptide.half_life && (
              <div>
                <h4 className="font-semibold mb-2">Half-Life</h4>
                <p className="text-sm text-muted-foreground">{peptide.half_life}</p>
              </div>
            )}

            {benefits.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Key Benefits</h4>
                <ul className="list-disc list-inside space-y-1">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="dosing" className="space-y-4">
            {dosing.length > 0 ? (
              dosing.map((protocol, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{protocol.vialSize}</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Reconstitution:</strong> {protocol.reconstitution}</p>
                    <p><strong>Frequency:</strong> {protocol.frequency}</p>
                    <p><strong>Dosing:</strong> {protocol.subcutaneous}</p>
                    {protocol.notes && (
                      <p className="text-amber-600"><strong>Note:</strong> {protocol.notes}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No dosing information available</p>
            )}

            {peptide.storage && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Storage: {peptide.storage}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="safety" className="space-y-4">
            {sideEffects.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-amber-600">Potential Side Effects</h4>
                <ul className="list-disc list-inside space-y-1">
                  {sideEffects.map((effect, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">{effect}</li>
                  ))}
                </ul>
              </div>
            )}

            {contraindications.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-destructive">Contraindications</h4>
                <ul className="list-disc list-inside space-y-1">
                  {contraindications.map((contra, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">{contra}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Disclaimer:</strong> Research peptides for educational purposes only. 
                Not for human consumption. Consult with a healthcare professional.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="stacking" className="space-y-4">
            {stacking.length > 0 ? (
              <div>
                <h4 className="font-semibold mb-2">Recommended Stacks</h4>
                <ul className="space-y-2">
                  {stacking.map((stack, idx) => (
                    <li key={idx} className="text-sm p-2 bg-muted rounded-lg">
                      {stack}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No stacking recommendations available</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
```

### Admin Component Updates

```typescript
// Update admin peptide form to include new fields
const peptideSchema = z.object({
  name: z.string().min(2),
  strength: z.string().optional(),
  vendor: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  mechanism: z.string().optional(),
  half_life: z.string().optional(),
  storage: z.string().optional(),
  is_active: z.boolean().default(true),
  vials_per_box: z.number().min(1).default(10),
})
```

## 📊 Example Queries

### Search Peptides by Description

```sql
SELECT name, category, description
FROM peptides
WHERE to_tsvector('english', description) @@ to_tsquery('english', 'weight & loss')
  AND is_active = true
ORDER BY name;
```

### Get All Active Weight Loss Peptides with Full Details

```sql
SELECT 
  name, 
  strength,
  description,
  mechanism,
  benefits,
  dosing
FROM peptides
WHERE category = 'Weight Loss & Metabolic'
  AND is_active = true
ORDER BY name;
```

### Find Peptides by Benefits

```sql
SELECT name, category, benefits
FROM peptides
WHERE benefits @> '["Reduces inflammation"]'::jsonb
  AND is_active = true;
```

### Get Stacking Recommendations

```sql
SELECT 
  p1.name as peptide,
  p1.stacking as recommended_stacks
FROM peptides p1
WHERE p1.name = 'Semaglutide'
  AND is_active = true;
```

## 🔍 API Updates

### Fetch Peptides with Full Details

```typescript
// src/lib/api/peptides.ts
export async function getPeptideDetails(peptideId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('peptides')
    .select('*')
    .eq('id', peptideId)
    .eq('is_active', true)
    .single()
  
  if (error) throw error
  
  return {
    ...data,
    benefits: data.benefits as string[],
    side_effects: data.side_effects as string[],
    contraindications: data.contraindications as string[],
    dosing: data.dosing as DosingProtocol[],
    stacking: data.stacking as string[],
  }
}

export async function searchPeptides(query: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('peptides')
    .select('*')
    .textSearch('name', query, {
      type: 'websearch',
      config: 'english'
    })
    .eq('is_active', true)
    .order('name')
  
  if (error) throw error
  return data
}
```

## 🎯 Key Features Enabled

### 1. **Advanced Filtering**
- Filter by category, vendor, active status
- Full-text search on name and description
- JSONB queries for benefits, side effects, etc.

### 2. **Comprehensive Product Pages**
- Tabbed interface with overview, dosing, safety, stacking
- Rich product information
- Professional medical-style layout

### 3. **Smart Recommendations**
- Stack recommendations based on complementary effects
- Cross-selling opportunities
- Educational content

### 4. **Admin Efficiency**
- Bulk import/export capability
- Rich data management
- Category and vendor analytics

### 5. **User Education**
- Detailed mechanisms of action
- Safety information
- Proper dosing protocols
- Research-backed benefits

## 📈 Database Statistics

After loading the comprehensive data:

```sql
-- Get total peptides by category
SELECT category, COUNT(*) as count
FROM peptides
WHERE is_active = true
GROUP BY category
ORDER BY count DESC;

-- Get peptides with complete information
SELECT 
  COUNT(*) FILTER (WHERE description IS NOT NULL) as has_description,
  COUNT(*) FILTER (WHERE mechanism IS NOT NULL) as has_mechanism,
  COUNT(*) FILTER (WHERE benefits IS NOT NULL) as has_benefits,
  COUNT(*) FILTER (WHERE dosing IS NOT NULL) as has_dosing,
  COUNT(*) as total
FROM peptides
WHERE is_active = true;
```

## 🚀 Next Steps

1. **Update UI Components**: Implement detailed peptide cards with tabs
2. **Add Search**: Implement full-text search in the frontend
3. **Create Filters**: Add advanced filtering by benefits, category, etc.
4. **Build Product Pages**: Create dedicated pages for each peptide
5. **Add Comparisons**: Allow users to compare peptides side-by-side
6. **Implement Favorites**: Let users save their preferred peptides
7. **Export Data**: Add CSV export for admin

## ⚠️ Important Notes

1. **Research Use Only**: Always display disclaimers that peptides are for research purposes only
2. **Medical Advice**: Include warnings to consult healthcare professionals
3. **Data Accuracy**: Verify all dosing and safety information
4. **Regular Updates**: Keep peptide information current with latest research
5. **Compliance**: Ensure all product information complies with regulations

## 🔧 Troubleshooting

### Migration Issues

```sql
-- Check if columns exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'peptides';

-- Rollback if needed (before inserting data)
ALTER TABLE peptides DROP COLUMN IF EXISTS description;
-- ... drop other columns ...
```

### Data Validation

```sql
-- Check for invalid JSONB
SELECT id, name FROM peptides 
WHERE benefits IS NOT NULL 
  AND jsonb_typeof(benefits) != 'array';

-- Fix invalid data
UPDATE peptides 
SET benefits = '[]'::jsonb 
WHERE benefits IS NULL;
```

## 📚 Resources

- [PostgreSQL JSONB Documentation](https://www.postgresql.org/docs/current/datatype-json.html)
- [Full-Text Search in PostgreSQL](https://www.postgresql.org/docs/current/textsearch.html)
- [Supabase Database](https://supabase.com/docs/guides/database)

## 🎉 Summary

This upgrade transforms your peptide database from basic product listings to a comprehensive, educational resource. Users can now:

- **Learn** about mechanisms of action
- **Understand** proper dosing protocols
- **Recognize** safety concerns
- **Discover** complementary stacks
- **Make informed** research decisions

The enhanced data structure supports future features like:
- AI-powered recommendations
- Interactive dosing calculators
- Safety checkers
- Stack builders
- Research paper linking

---

**Version**: 1.0.0  
**Date**: October 19, 2025  
**Author**: Mama Mica Development Team

