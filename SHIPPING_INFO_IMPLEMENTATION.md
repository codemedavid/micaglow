# Shipping Information Implementation Guide

## Overview

This document describes the implementation of shipping information collection during checkout. Users must now provide their name, address, phone number, and preferred delivery method before locking in their order.

## Changes Made

### 1. Database Schema Updates ✅

**File:** `add-shipping-info.sql` (NEW)

Added four new columns to the `orders` table:
- `shipping_name` (text) - Customer's full name
- `shipping_address` (text) - Complete delivery address
- `shipping_phone` (text) - Contact phone number
- `delivery_method` (text) - One of: Lalamove, LBC, or J&T

**To apply migration:**
```bash
# Connect to your Supabase database and run:
psql YOUR_DATABASE_URL -f add-shipping-info.sql

# Or use Supabase dashboard SQL editor and paste the contents of add-shipping-info.sql
```

### 2. TypeScript Types Updated ✅

**File:** `src/types/database.ts`

- **FIXED:** Critical type mismatch for order status
  - Changed from: `'PENDING' | 'CONFIRMED' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED'`
  - Changed to: `'PENDING' | 'VERIFIED' | 'INVALID' | 'CANCELLED'` (matches actual DB schema)
- **ADDED:** Shipping information fields to Orders table types

### 3. Database Function Updated ✅

**File:** `supabase-schema.sql`

Updated `fn_checkout` function to:
- Accept shipping parameters: `p_shipping_name`, `p_shipping_address`, `p_shipping_phone`, `p_delivery_method`
- Validate all shipping fields are provided and not empty
- Validate delivery method is one of: Lalamove, LBC, or J&T
- Save shipping information when creating orders

**To update function in Supabase:**
```sql
-- Run the updated fn_checkout function from supabase-schema.sql lines 128-238
-- This will replace the existing function
```

### 4. New Shipping Form Component ✅

**File:** `src/components/shipping-info-form.tsx` (NEW)

A complete form component with:
- Name input field with validation
- Address input field with validation
- Phone number input with format validation
- Delivery method dropdown with three options:
  - **Lalamove** - Same-day delivery
  - **LBC** - 2-3 days delivery
  - **J&T Express** - 2-5 days delivery
- Real-time validation feedback
- Proper error handling

### 5. Cart Page Enhanced ✅

**File:** `src/app/cart/page.tsx`

Updated checkout flow:
1. User adds items to cart
2. **NEW:** User fills out shipping information form
3. User reviews shipping details (can edit)
4. User clicks "Lock In My Order"

The shipping form:
- Only shows when batch status is "FILLING"
- Must be completed before checkout button appears
- Shows a summary card after completion with edit option

### 6. API & Hooks Updated ✅

**Files:**
- `src/hooks/use-orders.ts` - Added `ShippingInfo` interface and updated checkout hook
- `src/lib/api/orders.ts` - Updated `checkout()` function to accept and pass shipping data

### 7. WhatsApp Integration Updated ✅

**File:** `src/lib/whatsapp.ts`

WhatsApp messages now include shipping details:
```
Hello! I'd like to LOCK IN an order for Batch March 2025

WhatsApp: +639171234567
Order ID: abc-123

Items:
- BPC-157 x 2 vials @ ₱500 = ₱1000
- TB-500 x 1 vial @ ₱800 = ₱800

Total: ₱1800

📦 SHIPPING DETAILS:
Name: Juan Dela Cruz
Address: 123 Street Name, Barangay, City, Province
Phone: 09171234567
Delivery: LBC

⚠️ NO PAYMENT YET - Just confirming my order
I will wait for PAYMENT phase and your payment instructions.
```

### 8. Order Display Pages Updated ✅

**Files:**
- `src/app/orders/[orderId]/page.tsx` - Added shipping information display section
- `src/app/orders/[orderId]/confirm/page.tsx` - Updated WhatsApp data to include shipping

## User Experience Flow

### Before (Old Flow)
1. Add items to cart
2. Click "Lock In My Order" immediately
3. Redirected to WhatsApp

### After (New Flow)
1. Add items to cart
2. **Fill out shipping information form**
   - Name
   - Complete Address
   - Contact Phone
   - Delivery Method
3. Review order summary with shipping details
4. Click "Lock In My Order"
5. Redirected to WhatsApp (message includes shipping info)

## Validation Rules

### Required Fields
All fields are required:
- Shipping Name: Must not be empty
- Shipping Address: Must not be empty
- Shipping Phone: Must not be empty and match phone format
- Delivery Method: Must be one of: Lalamove, LBC, or J&T

### Client-Side Validation
- Real-time validation as user types
- Clear error messages below each field
- Submit button disabled until form is valid

### Server-Side Validation
- Database function validates all fields
- Rejects empty or invalid data
- Returns clear error messages

## Admin Benefits

Admins now receive complete shipping information with each order, making fulfillment easier:

1. **Name** - Who to address the package to
2. **Address** - Where to ship
3. **Phone** - How to contact for delivery issues
4. **Delivery Method** - Which courier to use

This information is:
- Stored in the database
- Sent via WhatsApp message
- Displayed on order detail pages

## Testing Checklist

- [ ] Run database migration (`add-shipping-info.sql`)
- [ ] Update database function (`fn_checkout` from `supabase-schema.sql`)
- [ ] Restart Next.js development server
- [ ] Test adding items to cart
- [ ] Test filling out shipping form
- [ ] Test form validation (try empty fields)
- [ ] Test form validation (try invalid phone)
- [ ] Test editing shipping info before checkout
- [ ] Test completing checkout
- [ ] Verify WhatsApp message includes shipping details
- [ ] Verify order detail page shows shipping info
- [ ] Test as admin viewing order

## Migration Steps

### Step 1: Update Database Schema
```bash
# Using Supabase CLI
supabase db push

# OR using psql
psql YOUR_DATABASE_URL -f add-shipping-info.sql

# OR using Supabase Dashboard
# 1. Go to SQL Editor
# 2. Paste contents of add-shipping-info.sql
# 3. Click "Run"
```

### Step 2: Update Database Function
```bash
# Using Supabase Dashboard
# 1. Go to SQL Editor
# 2. Paste the updated fn_checkout function from supabase-schema.sql (lines 128-238)
# 3. Click "Run"
```

### Step 3: Deploy Code
```bash
# Commit and push changes
git add .
git commit -m "Add shipping information collection to checkout"
git push

# Vercel will auto-deploy
# OR manually deploy
vercel --prod
```

### Step 4: Test
1. Go to your app
2. Add items to cart
3. Complete shipping form
4. Verify checkout works
5. Check WhatsApp message
6. View order details

## Rollback Plan

If you need to rollback:

```sql
-- Remove shipping columns
ALTER TABLE orders 
DROP COLUMN IF EXISTS shipping_name,
DROP COLUMN IF EXISTS shipping_address,
DROP COLUMN IF EXISTS shipping_phone,
DROP COLUMN IF EXISTS delivery_method;

-- Revert to old fn_checkout function
-- (restore from backup or previous version)
```

Then revert code changes:
```bash
git revert HEAD
git push
```

## Notes

- Shipping information is optional in the database but required by the checkout flow
- Existing orders without shipping info will still display correctly
- The form uses proper accessibility attributes (labels, aria-labels)
- Mobile-responsive design maintained
- Error handling follows app patterns

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify database migration ran successfully
3. Ensure database function was updated
4. Check Vercel deployment logs
5. Test in incognito mode (cache issues)

## Future Enhancements

Possible improvements:
- Save shipping info to user profile for reuse
- Address autocomplete/validation
- Shipping cost calculation based on delivery method
- Admin dashboard for shipping management
- Bulk export of orders with shipping info for couriers

