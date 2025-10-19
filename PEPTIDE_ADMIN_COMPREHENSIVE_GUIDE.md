# Comprehensive Peptide Admin Management Guide

## Overview

The admin peptide management system now supports **ALL** peptide fields available in the database, allowing complete control over peptide catalog management.

## ✅ Complete Field Management

### Basic Information
- **Name** * (required) - The peptide name (e.g., "BPC-157", "Semaglutide")
- **Strength** - The dosage strength (e.g., "5mg", "10mg", "15mg")
- **Vendor** - The supplier/vendor name (e.g., "Various", "Vendor A")
- **Category** - Product category (e.g., "Weight Loss & Metabolic", "Healing & Recovery", "Growth Hormone")
- **Icon** - Emoji icon for visual identification (e.g., "💊", "🩹")
- **Vials Per Box** - Number of vials included per box (typically 10)
- **Is Active** - Toggle to show/hide peptide in catalog

### Description & Mechanism
- **Description** - Comprehensive description of what the peptide does
- **Mechanism of Action** - How the peptide works in the body
- **Half Life** - Duration the peptide remains active (e.g., "4-6 hours", "7 days")
- **Storage Instructions** - How to store the peptide (typically "Store in refrigerator (2-8°C)")

### Detailed Information (JSON Format)

#### Benefits (JSON Array)
Array of benefits as strings:
```json
[
  "Accelerates tendon, ligament, muscle, and GI healing",
  "Reduces inflammation",
  "Systemic repair support"
]
```

#### Side Effects (JSON Array)
Array of potential side effects:
```json
[
  "Injection site reactions (redness, swelling)",
  "Nausea, vomiting, diarrhea, constipation",
  "Fatigue, abdominal pain, decreased appetite"
]
```

#### Contraindications (JSON Array)
Array of contraindications:
```json
[
  "Do not use if pregnant, breastfeeding, or history of medullary thyroid carcinoma/MEN 2",
  "Avoid in type 1 diabetes, severe GI disease, or hypersensitivity"
]
```

#### Dosing Instructions (JSON Array of Objects)
Array of dosing protocols with detailed instructions:
```json
[
  {
    "vialSize": "5MG",
    "reconstitution": "Mix with 2mL (200 units) BAC water",
    "frequency": "Dose daily subcutaneously",
    "subcutaneous": "250-500mcg (25-50 units) daily"
  }
]
```

#### Stacking Recommendations (JSON Array)
Array of peptides that work well in combination:
```json
[
  "TB-500: Synergistic repair",
  "GHK-Cu: Skin and connective tissue"
]
```

#### Specifications (JSON Object)
Additional technical specifications:
```json
{
  "purity": "99%",
  "form": "Lyophilized powder"
}
```

### Pricing
- **Price Per Vial (₱)** * (required) - Individual vial price
- **Price Per Box (₱)** - Optional box price (usually vials_per_box × price_per_vial)

## 🎯 Features

### 1. **Full CRUD Operations**
- ✅ Create new peptides with all fields
- ✅ Edit existing peptides completely
- ✅ Delete peptides (with confirmation)
- ✅ View all peptides in table format

### 2. **JSON Field Validation**
- Automatic JSON parsing and validation
- Error handling for malformed JSON
- Pretty-printed JSON in edit mode for easy modification

### 3. **Smart Defaults**
- Pre-filled sensible defaults for common fields
- Storage: "Store in refrigerator (2-8°C)"
- Icon: "💊"
- Vials per box: 10
- Is active: true
- Price per vial: ₱950

### 4. **User-Friendly Interface**
- Organized sections: Basic Info, Description & Mechanism, JSON Details, Pricing
- Scrollable dialog for long forms
- Helpful placeholders and descriptions
- Monospace font for JSON fields
- Toggle switch for is_active status

### 5. **Category & Vendor Management**
- Automatic category extraction and display
- Automatic vendor extraction and display
- Quick reference cards showing all unique categories and vendors

## 📋 How to Use

### Creating a New Peptide

1. Go to `/admin/peptides`
2. Click "Add Peptide" button
3. Fill in at minimum:
   - Name (required)
   - Price per Vial (required)
4. Optionally add:
   - All other fields as needed
   - JSON data in proper format
5. Click "Create"

### Editing an Existing Peptide

1. Go to `/admin/peptides`
2. Find the peptide in the table
3. Click the pencil icon (✏️)
4. Modify any fields
5. JSON fields will be auto-formatted for easy editing
6. Click "Update"

### Deleting a Peptide

1. Go to `/admin/peptides`
2. Find the peptide in the table
3. Click the trash icon (🗑️)
4. Confirm deletion

### Deactivating a Peptide

Instead of deleting, you can deactivate:
1. Edit the peptide
2. Toggle "Active" switch to OFF
3. Update
4. Peptide will no longer show in customer-facing catalog

## 💡 Best Practices

### 1. **Consistent Categories**
Use standardized categories across all peptides:
- "Weight Loss & Metabolic"
- "Healing & Recovery"
- "Growth Hormone"
- "Performance & Fitness"
- "Anti-Aging & Longevity"

### 2. **Strength Naming**
- Always include units (mg, mcg, IU)
- Use consistent format (e.g., "5mg" not "5 mg" or "5MG")

### 3. **JSON Formatting**
- Use double quotes for strings
- Validate JSON before saving (the form will alert you if invalid)
- Keep arrays organized and readable

### 4. **Pricing Strategy**
- Set competitive price_per_vial
- Calculate price_per_box as: `vials_per_box × price_per_vial`
- Batch-specific pricing can override these defaults

### 5. **Description Writing**
- **Description**: Customer-facing, benefit-focused
- **Mechanism**: Technical, how it works
- Keep both concise but informative

## 🔧 Technical Details

### Database Schema
All fields map directly to the `peptides` table in Supabase:

```typescript
interface Peptide {
  id: string
  name: string
  strength: string | null
  vendor: string | null
  category: string | null
  description: string | null
  mechanism: string | null
  half_life: string | null
  storage: string | null
  benefits: Json | null          // JSON array
  side_effects: Json | null      // JSON array
  contraindications: Json | null // JSON array
  dosing: Json | null            // JSON array
  stacking: Json | null          // JSON array
  icon: string | null
  is_active: boolean
  vials_per_box: number | null
  specifications: Json | null    // JSON object
  price_per_vial: number | null
  price_per_box: number | null
  created_at: string
}
```

### API Endpoints
- `createPeptide(data)` - Create new peptide
- `updatePeptide(id, data)` - Update existing peptide
- `deletePeptide(id)` - Delete peptide
- `getAllPeptides()` - Fetch all peptides (admin view)
- `getCategories()` - Get unique categories
- `getVendors()` - Get unique vendors

## 🎨 UI Components Used
- **Dialog** - Modal for create/edit forms
- **Form** - React Hook Form with Zod validation
- **Input** - Text, number inputs
- **Textarea** - Multi-line text for descriptions and JSON
- **Switch** - Toggle for is_active
- **ScrollArea** - Scrollable form content
- **Table** - Peptide listing
- **Badge** - Category/vendor tags

## 📊 Example: Complete Peptide Entry

```json
{
  "name": "BPC-157",
  "strength": "5mg",
  "vendor": "Various",
  "category": "Healing & Recovery",
  "description": "A synthetic peptide derived from a protein in human gastric juice, researched for its regenerative effects on tissues throughout the body.",
  "mechanism": "Synthetic peptide that upregulates growth factors, enhances angiogenesis, and protects GI mucosa.",
  "half_life": "4-6 hours",
  "storage": "Store in refrigerator (2-8°C)",
  "benefits": [
    "Accelerates tendon, ligament, muscle, and GI healing",
    "Reduces inflammation",
    "Systemic repair support"
  ],
  "side_effects": [
    "Minimal; possible injection site reactions"
  ],
  "contraindications": [
    "Hypersensitivity"
  ],
  "dosing": [
    {
      "vialSize": "5MG",
      "reconstitution": "Mix with 2mL (200 units) BAC water",
      "frequency": "Dose daily subcutaneously",
      "subcutaneous": "250-500mcg (25-50 units) daily"
    }
  ],
  "stacking": [
    "TB-500: Synergistic repair",
    "GHK-Cu: Skin and connective tissue"
  ],
  "icon": "🩹",
  "is_active": true,
  "vials_per_box": 10,
  "specifications": {
    "purity": "99%",
    "form": "Lyophilized powder"
  },
  "price_per_vial": 345.00,
  "price_per_box": 3450.00
}
```

## 🚀 What's Next?

The comprehensive peptide management system is now complete! You can:

1. **Import existing peptide data** - Use the SQL files in the repo to populate the database
2. **Create new peptides** - Add new products to your catalog
3. **Update existing peptides** - Modify any field at any time
4. **Manage catalog visibility** - Use is_active to control what customers see
5. **Organize by category** - Group similar peptides together

## 📝 Notes

- All fields except `name` and `price_per_vial` are optional
- JSON fields accept empty strings (will be stored as NULL)
- Form validates JSON syntax before submission
- Changes are immediate (no caching issues)
- Soft delete recommended using `is_active` toggle instead of hard delete

## ✨ Summary

The admin peptide management system now provides **complete control** over all peptide data:
- ✅ All 20+ database fields editable
- ✅ JSON field support with validation
- ✅ User-friendly interface
- ✅ Smart defaults
- ✅ Full CRUD operations
- ✅ Category & vendor tracking
- ✅ Pricing management
- ✅ Active/inactive toggle

