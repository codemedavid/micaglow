# Dosing Guide - Design Reference

## Visual Design Breakdown

This document shows how the dosing guide matches the homepage design vibes.

---

## 🎨 Color Palette

### Primary Colors (Same as Homepage)
```css
Primary:    #6E56CF (Purple) - Main actions, highlights, borders
Secondary:  #E9D7FE (Light Purple) - Badges, subtle backgrounds
Accent:     #3CCB7F (Green) - Success, benefits, positive indicators
Warning:    #FDBA37 (Amber) - Warnings, side effects
Error:      #E5484D (Red) - Contraindications, critical warnings
```

### Text Colors
```css
Foreground:       Dark text on light backgrounds
Muted Foreground: Secondary text, descriptions
Background:       White with subtle gradients
```

---

## 📐 Layout Structure

### Page Hierarchy
```
┌─────────────────────────────────────────────────────┐
│  STICKY HEADER (Same as Homepage)                   │
│  [Logo] [Nav Links] [Back to Batches Button]        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  HERO SECTION                                       │
│  ┌──────────────────────────────────────────────┐  │
│  │  [Badge: Comprehensive Resource]              │  │
│  │                                               │  │
│  │  Peptide                                      │  │
│  │  Dosing Guide                                 │  │
│  │                                               │  │
│  │  Description text...                          │  │
│  │                                               │  │
│  │  [Stats: 50+ Peptides] [12 Categories]       │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
├─────────────────────────────────────────────────────┤
│  INFO BANNER (Amber background)                     │
│  ⚠️ Research Use Only disclaimer...                 │
├─────────────────────────────────────────────────────┤
│  STICKY FILTER BAR                                  │
│  [Search Input] [All] [Category 1] [Category 2]... │
│  Active filters: [Filter 1 ×] [Clear all]          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PEPTIDES BY CATEGORY                              │
│                                                     │
│  ────── [🧪 Growth Hormones] ──────                │
│                                                     │
│  [Card 1]  [Card 2]  [Card 3]                      │
│  [Card 4]  [Card 5]  [Card 6]                      │
│                                                     │
│  ────── [🧪 Recovery & Healing] ──────             │
│                                                     │
│  [Card 7]  [Card 8]  [Card 9]                      │
│                                                     │
├─────────────────────────────────────────────────────┤
│  CTA SECTION (Purple Gradient)                      │
│  Ready to Join a Batch?                            │
│  [View Active Batches Button]                      │
└─────────────────────────────────────────────────────┘
```

---

## 🎴 Card Design

### Peptide Card Structure
```
┌────────────────────────────────────────┐
│ 🔬 BPC-157              [Category]    │ ← Header with icon & badge
│ 📦 5mg                                 │ ← Strength
│ 🧪 Vendor Name                         │ ← Vendor
│                                        │
│ Description text showing benefits...   │ ← Description preview
│                                        │
│ ╔══════════════════════════════════╗  │
│ ║ 💊 Dosing Protocols Available    ║  │ ← Dosing preview box
│ ║                                  ║  │   (Gradient background)
│ ║ 5mg: Once daily                  ║  │
│ ║ 10mg: Twice daily                ║  │
│ ║ +2 more protocols                ║  │
│ ╚══════════════════════════════════╝  │
│                                        │
│ [View Full Details →]                 │ ← CTA button
└────────────────────────────────────────┘
   ↑ Hover: Shadow increases, border glows purple
```

---

## 💬 Dialog Design

### Full-Screen Peptide Dialog
```
┌──────────────────────────────────────────────────────────┐
│ × Close                                                   │
│                                                          │
│ 🔬  BPC-157                              [Category]     │
│     5mg • Vendor Name                                    │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ [💊 Dosing] [ℹ️ Overview] [🛡️ Safety] [🔗 Stacking] │   │ ← Tabs
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ DOSING TAB CONTENT:                                     │
│                                                          │
│ 💊 Dosing Protocols                                     │
│                                                          │
│ ┌──────────────────────────────────────┐               │
│ │ ① 5mg vial                            │               │
│ │                                       │               │
│ │ 🧪 Reconstitution                     │               │
│ │ Add 2ml BAC water                    │               │
│ │                                       │               │
│ │ ⏰ Frequency                          │               │
│ │ Once daily                           │               │
│ │                                       │               │
│ │ 📦 Dosing Guide                       │               │
│ │ Start with 0.1ml (250mcg)...         │               │
│ │                                       │               │
│ │ ⚠️ Important Note                     │               │
│ │ Take on empty stomach                │               │
│ └──────────────────────────────────────┘               │
│                                                          │
│ ─────────────────────────────────────────────────────   │
│                                                          │
│ 📦 Related Peptides                                     │
│                                                          │
│ [Card 1]  [Card 2]  [Card 3]                           │
│ [Card 4]  [Card 5]  [Card 6]                           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 🎭 Design Elements

### Typography
```
Hero Heading:     text-5xl md:text-6xl lg:text-7xl font-black
Section Heading:  text-4xl md:text-5xl font-bold
Card Title:       text-lg font-bold
Body Text:        text-sm text-muted-foreground
```

### Spacing
```
Section Padding:  py-16 md:py-20
Card Padding:     p-6
Grid Gap:         gap-6
```

### Borders & Shadows
```
Card Border:      border border-border/50
Hover Border:     border-primary/30
Shadow:           shadow-sm
Hover Shadow:     shadow-xl
```

### Rounded Corners
```
Cards:            rounded-lg
Buttons:          rounded-full (primary CTAs)
                  rounded-lg (secondary)
Badges:           rounded-full
```

---

## 🌈 Gradient Effects

### Hero Background
```css
background: linear-gradient(to bottom, #f7f9ff, white, white)
+ radial-gradient overlay at 30% 20%
```

### Card Backgrounds
```css
background: linear-gradient(to bottom right, 
  var(--card), 
  rgba(110, 86, 207, 0.01)
)
```

### CTA Section
```css
background: linear-gradient(to bottom right,
  var(--primary),
  var(--primary),
  rgba(var(--primary), 0.9)
)
+ radial-gradient overlay at 70% 30%
```

### Dosing Preview Box
```css
background: linear-gradient(to right,
  rgba(110, 86, 207, 0.05),
  rgba(233, 215, 254, 0.05)
)
border: 1px solid rgba(110, 86, 207, 0.1)
```

---

## 🎯 Interactive States

### Buttons
```
Default:  bg-primary text-white rounded-full
Hover:    shadow-lg scale-105
Active:   scale-100
Disabled: opacity-50 cursor-not-allowed
```

### Cards
```
Default:  border-border/50 shadow-sm
Hover:    border-primary/30 shadow-xl translate-y-[-2px]
Active:   shadow-md translate-y-0
```

### Filter Buttons
```
Default:  variant="outline"
Active:   variant="default" (purple background)
Hover:    border-primary/50
```

---

## 📱 Responsive Breakpoints

### Grid Layouts
```css
Mobile:   grid-cols-1     (< 768px)
Tablet:   grid-cols-2     (≥ 768px)
Desktop:  grid-cols-3     (≥ 1024px)
```

### Navigation
```css
Mobile:   Hamburger menu (hidden navigation)
Desktop:  Full navigation visible
```

### Dialog
```css
Mobile:   Full screen, scrollable
Desktop:  Max width 6xl, centered
```

---

## 🎨 Icon Usage

### Category Icons
```
🧪 - General/Lab
💊 - Dosing
🔬 - Research
📦 - Packaging/Strength
⏰ - Timing/Frequency
🛡️ - Safety
⚠️ - Warnings
✓ - Benefits (green checkmark)
× - Close/Remove
→ - Navigation/View More
```

### Colored Icons
```css
Primary Icons:    text-primary (#6E56CF)
Success Icons:    text-[#3CCB7F]
Warning Icons:    text-amber-600
Error Icons:      text-destructive
Muted Icons:      text-muted-foreground
```

---

## 🎪 Animation & Transitions

### Card Hover
```css
transition: all 0.3s ease
hover: translateY(-4px) shadow-xl border-primary/30
```

### Button Hover
```css
transition: all 0.2s ease
hover: scale(1.05) shadow-xl
```

### Dialog Open
```css
animation: fadeIn 0.2s ease-out
```

### Filter Active
```css
transition: background-color 0.2s ease
```

---

## 🔍 Search & Filter Bar

### Layout
```
┌──────────────────────────────────────────────────────┐
│ 🔍 Search peptides...                            [×]│
│                                                      │
│ 🎚️ [All] [Category 1] [Category 2] [Category 3]... │
└──────────────────────────────────────────────────────┘
```

### Sticky Behavior
```css
position: sticky
top: 73px  /* Below main header */
z-index: 30
backdrop-filter: blur(8px)
background: rgba(255, 255, 255, 0.95)
```

---

## 📊 Stats Display

### Format (Matching Homepage)
```
┌──────────────┐  ┌──────────────┐
│ 🧪           │  │ 💊           │
│ 50+          │  │ 12           │
│ Peptides     │  │ Categories   │
└──────────────┘  └──────────────┘
```

### Styling
```css
Icon: w-10 h-10 rounded-full bg-primary/10
Number: text-2xl font-black text-primary
Label: text-xs text-muted-foreground
```

---

## 🎯 Call-to-Action Section

### Design (Same as Homepage)
```
┌──────────────────────────────────────────────┐
│ [Purple Gradient Background with Overlay]    │
│                                              │
│          Ready to Join a Batch?             │
│                                              │
│    Browse our active batches to find        │
│    the peptides you need...                 │
│                                              │
│    [💊 View Active Batches]                 │
│                                              │
└──────────────────────────────────────────────┘
```

---

## ✨ Special Effects

### Radial Gradient Overlays
```css
/* Hero Section */
background: radial-gradient(
  circle at 30% 20%,
  rgba(110, 86, 207, 0.08),
  transparent 50%
)

/* CTA Section */
background: radial-gradient(
  circle at 70% 30%,
  rgba(255, 255, 255, 0.1),
  transparent 50%
)
```

### Section Dividers
```
──────── [🧪 Category Name (12)] ────────
```

### Hover Glow Effect
```css
/* Cards on hover */
box-shadow: 0 20px 25px -5px rgba(110, 86, 207, 0.1),
            0 10px 10px -5px rgba(110, 86, 207, 0.04)
```

---

## 🎨 Badge Styling

### Category Badges
```
[Growth Hormones]  - variant="secondary"
[Recovery]         - variant="secondary"
[Fat Loss]         - variant="secondary"
```

### Status Badges
```
[Available]        - bg-primary text-white
[Low Stock]        - bg-accent text-white
[Coming Soon]      - variant="outline"
```

---

## 📝 Summary

The dosing guide perfectly mirrors the homepage aesthetic with:

✅ **Same color palette** - Purple primary, green accents
✅ **Matching typography** - Bold headings, readable body
✅ **Consistent spacing** - Same padding and gaps
✅ **Identical card style** - Gradients, shadows, hover effects
✅ **Same button style** - Rounded-full primary CTAs
✅ **Matching gradients** - Hero and CTA sections
✅ **Unified navigation** - Same header and footer
✅ **Consistent icons** - Lucide React throughout
✅ **Same animations** - Smooth hover transitions
✅ **Matching badges** - Rounded-full, same colors

The result is a seamless, professional user experience where the dosing guide feels like a natural extension of the homepage.

---

**View it live at: `/dosing-guide`**

