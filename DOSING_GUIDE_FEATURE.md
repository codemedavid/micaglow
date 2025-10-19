# Dosing Guide Feature

## Overview

A comprehensive dosing guide page that displays all available peptides with detailed information including dosing protocols, mechanisms of action, benefits, side effects, and related peptides.

## Features

### 🎯 Core Functionality

1. **Peptide Listing**
   - Displays all active peptides organized by category
   - Beautiful card-based layout matching homepage vibes
   - Shows peptide icon, name, strength, vendor, and description preview

2. **Search & Filter**
   - Real-time search by name, description, vendor
   - Category filter buttons
   - Active filter display with clear all option
   - Sticky filter bar for easy navigation

3. **Detailed Peptide Dialog**
   - **Dosing Tab** (Primary): Complete dosing protocols with reconstitution, frequency, and guidelines
   - **Overview Tab**: Description, mechanism of action, benefits, half-life, storage
   - **Safety Tab**: Side effects, contraindications, important disclaimers
   - **Stacking Tab**: Recommended peptide combinations

4. **Related Peptides**
   - Automatically shows 6 related peptides from the same category
   - Click to navigate to related peptide details
   - Seamless navigation between peptides

### 🎨 Design

The dosing guide matches the homepage design language:

- **Color Scheme**: Purple/primary theme (#6E56CF)
- **Layout**: Clean, modern card-based design
- **Typography**: Bold headings, readable body text
- **Hover Effects**: Smooth transitions on cards and buttons
- **Gradients**: Subtle background gradients for depth
- **Icons**: Lucide React icons throughout
- **Spacing**: Generous whitespace for readability
- **Mobile-First**: Fully responsive design

### 📱 Page Structure

```
/dosing-guide
├── Hero Section
│   ├── Title & Description
│   └── Stats (peptide count, category count)
├── Info Banner (research use disclaimer)
├── Sticky Filters
│   ├── Search Bar
│   └── Category Buttons
└── Peptide Grid
    ├── Grouped by Category
    └── DosingGuideCard Components
```

### 🔧 Technical Implementation

#### New Files Created

1. **`src/lib/api/peptides.ts`** - Client-side API functions
   - `getAllPeptides()` - Fetch all active peptides
   - `getPeptide(id)` - Fetch single peptide
   - `getRelatedPeptides(peptide)` - Fetch related peptides by category
   - `searchPeptides(query)` - Search peptides
   - `getCategories()` - Get unique categories

2. **`src/lib/api/peptides.server.ts`** - Server-side API functions
   - Same functions as client but using server Supabase client

3. **`src/components/dosing-guide-card.tsx`** - Peptide card component
   - Displays peptide preview
   - Shows dosing protocol count
   - Click to view full details

4. **`src/components/enhanced-peptide-dialog.tsx`** - Full-screen dialog
   - Tabbed interface for different info types
   - Related peptides section
   - Click to navigate between peptides

5. **`src/app/dosing-guide/page.tsx`** - Main dosing guide page
   - Search and filter functionality
   - Peptide grid display
   - Category grouping

#### Database Schema

Uses existing `peptides` table with fields:
- `id`, `name`, `strength`, `vendor`, `category`
- `description`, `mechanism`, `half_life`, `storage`
- `benefits`, `side_effects`, `contraindications` (JSON)
- `dosing` (JSON array of protocols)
- `stacking` (JSON array of recommendations)
- `icon`, `is_active`

#### Navigation Integration

Added links in:
- Homepage header navigation
- Homepage footer
- Dosing guide header

### 🎯 User Flow

1. User visits `/dosing-guide`
2. Sees all peptides organized by category
3. Can search or filter by category
4. Clicks "View Full Details" on any peptide
5. Dialog opens with comprehensive information
6. Can navigate to related peptides from dialog
7. Can close dialog and continue browsing

### 📊 Data Display

**Dosing Protocol Format:**
```typescript
interface DosingProtocol {
  vialSize: string        // e.g., "5mg vial"
  reconstitution: string  // e.g., "Add 2ml BAC water"
  frequency: string       // e.g., "Once daily"
  subcutaneous: string    // Detailed dosing guide
  notes?: string          // Important notes
}
```

### 🎨 Design Elements

**Color Usage:**
- Primary (#6E56CF): Main actions, highlights
- Secondary: Category badges
- Green (#3CCB7F): Benefits, success states
- Amber: Warnings, side effects
- Red: Contraindications, critical warnings

**Card Styles:**
- Gradient backgrounds: `from-card to-primary/[0.01]`
- Hover effects: Shadow increase, border color change
- Rounded corners: Consistent radius
- Border colors: `border-primary/30` on hover

### 🚀 Performance

- **Static Generation**: Uses client-side data fetching with React Query
- **Caching**: React Query handles caching automatically
- **Lazy Loading**: Dialog content loads on-demand
- **Optimized Rendering**: Memoization where appropriate

### ⚠️ Important Notes

1. **Research Use Disclaimer**: Prominent disclaimer on every page
2. **Medical Advice**: Clear warnings about consulting healthcare professionals
3. **Category Fallback**: Handles peptides without categories gracefully
4. **Empty States**: Proper messaging when no peptides found
5. **Loading States**: Shows loading indicators during data fetch

### 📝 Future Enhancements

Potential improvements:
- [ ] Server-side rendering for better SEO
- [ ] PDF export for dosing protocols
- [ ] Favorite/bookmark peptides
- [ ] Print-friendly view
- [ ] Dosing calculator
- [ ] Compare multiple peptides
- [ ] User notes/annotations
- [ ] Share specific peptide links

### 🧪 Testing

To test the feature:
1. Navigate to `/dosing-guide`
2. Try searching for different peptides
3. Click different category filters
4. Open peptide details dialog
5. Navigate through tabs
6. Click related peptides
7. Test mobile responsiveness

### 📚 Related Documentation

- See `PEPTIDE_DATABASE_UPGRADE_GUIDE.md` for database schema
- See `comprehensive-peptides-data.sql` for sample data
- See homepage (`src/app/page.tsx`) for design reference

## Summary

This feature provides a comprehensive, beautiful, and functional dosing guide that matches the existing design system while offering users easy access to critical peptide information with smooth navigation and filtering capabilities.

