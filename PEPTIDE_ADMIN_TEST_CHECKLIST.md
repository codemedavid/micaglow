# Peptide Admin Management - Testing Checklist

## ✅ Pre-Deployment Testing

### 1. Access & Navigation
- [ ] Navigate to `/admin/peptides` as admin user
- [ ] Page loads without errors
- [ ] All UI components render correctly
- [ ] Header shows "Peptides Management" title
- [ ] "Add Peptide" button is visible
- [ ] Table displays existing peptides (if any)
- [ ] Categories and Vendors cards show at bottom

### 2. Create New Peptide (Basic)
- [ ] Click "Add Peptide" button
- [ ] Dialog opens with "Create New Peptide" title
- [ ] Form shows all sections:
  - Basic Information
  - Description & Mechanism  
  - Details (JSON Format)
  - Pricing
- [ ] Fill in minimal required fields:
  - Name: "Test Peptide"
  - Price per Vial: "950"
- [ ] Click "Create" button
- [ ] Success: Dialog closes
- [ ] Success: New peptide appears in table
- [ ] Success: Toast notification shows (if implemented)

### 3. Create New Peptide (Complete)
- [ ] Click "Add Peptide" button
- [ ] Fill in ALL fields:

**Basic Information:**
- [ ] Name: "Complete Test"
- [ ] Strength: "5mg"
- [ ] Vendor: "Test Vendor"
- [ ] Category: "Test Category"
- [ ] Icon: "🧪"
- [ ] Vials Per Box: "10"
- [ ] Is Active: Toggle ON

**Description & Mechanism:**
- [ ] Description: "This is a test peptide for comprehensive testing."
- [ ] Mechanism: "Test mechanism of action."
- [ ] Half Life: "4 hours"
- [ ] Storage: "Store in refrigerator (2-8°C)"

**JSON Fields:**
- [ ] Benefits: `["Benefit 1", "Benefit 2", "Benefit 3"]`
- [ ] Side Effects: `["Side effect 1", "Side effect 2"]`
- [ ] Contraindications: `["Do not use if allergic"]`
- [ ] Dosing: `[{"vialSize": "5MG", "reconstitution": "Mix with 2mL BAC water", "frequency": "Daily", "subcutaneous": "250mcg daily"}]`
- [ ] Stacking: `["Stacks well with Test-2"]`
- [ ] Specifications: `{"purity": "99%", "form": "powder"}`

**Pricing:**
- [ ] Price Per Vial: "1000"
- [ ] Price Per Box: "10000"

- [ ] Click "Create"
- [ ] Success: Peptide created with all data
- [ ] Verify all fields saved correctly

### 4. Edit Existing Peptide
- [ ] Click edit (pencil) icon on a peptide
- [ ] Dialog opens with "Edit Peptide" title
- [ ] All existing data pre-filled correctly
- [ ] JSON fields are formatted (pretty-printed)
- [ ] Modify several fields
- [ ] Click "Update"
- [ ] Success: Dialog closes
- [ ] Success: Changes reflected in table
- [ ] Verify changes saved to database

### 5. JSON Validation Testing
- [ ] Edit a peptide
- [ ] Enter invalid JSON in Benefits field: `{this is not json}`
- [ ] Click "Update"
- [ ] Error: Alert shows "Invalid JSON format"
- [ ] Fix the JSON: `["Valid benefit"]`
- [ ] Click "Update"
- [ ] Success: Saves correctly

### 6. Is Active Toggle
- [ ] Edit a peptide
- [ ] Toggle "Is Active" to OFF
- [ ] Click "Update"
- [ ] Verify peptide no longer shows in customer catalog
- [ ] Verify peptide still shows in admin table
- [ ] Toggle back to ON
- [ ] Verify peptide shows in customer catalog again

### 7. Delete Peptide
- [ ] Click delete (trash) icon on a peptide
- [ ] Confirmation dialog appears
- [ ] Click "Cancel" - nothing happens
- [ ] Click delete icon again
- [ ] Click "OK" to confirm
- [ ] Success: Peptide removed from table
- [ ] Verify peptide deleted from database

### 8. Empty States
- [ ] If no peptides exist:
  - [ ] Table shows "No peptides yet" message
  - [ ] Message shows "Click Add Peptide to create your first one"
- [ ] If no categories exist:
  - [ ] Categories card shows "No categories yet"
- [ ] If no vendors exist:
  - [ ] Vendors card shows "No vendors yet"

### 9. Categories & Vendors Display
- [ ] Create peptides with different categories
- [ ] Verify Categories card updates with unique categories
- [ ] Verify category count is correct
- [ ] Create peptides with different vendors
- [ ] Verify Vendors card updates with unique vendors
- [ ] Verify vendor count is correct

### 10. Form Validation
- [ ] Try to create peptide without Name
  - [ ] Error: "Name must be at least 2 characters"
- [ ] Try to create peptide without Price per Vial
  - [ ] Error: "Price per vial is required"
- [ ] Enter very short name (1 character)
  - [ ] Error: Validation fails
- [ ] Enter negative price
  - [ ] Verify system handles appropriately

### 11. UI/UX Testing
- [ ] Form is scrollable when long
- [ ] All fields are properly labeled
- [ ] Placeholders provide helpful examples
- [ ] Form sections are clearly separated
- [ ] JSON fields use monospace font
- [ ] Buttons are clearly labeled
- [ ] Loading states show when saving
- [ ] Dialog closes on successful save
- [ ] Can cancel edit without saving

### 12. Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on laptop (1366x768)
- [ ] Test on tablet (768x1024)
- [ ] Dialog adjusts to screen size
- [ ] Form remains usable on all sizes
- [ ] Table is readable on all sizes

### 13. Performance
- [ ] Page loads quickly with 0 peptides
- [ ] Page loads quickly with 50 peptides
- [ ] Page loads quickly with 100+ peptides
- [ ] Form opens quickly
- [ ] Save operations complete in < 2 seconds
- [ ] No console errors
- [ ] No memory leaks

### 14. Data Integrity
- [ ] Create peptide with special characters in name
- [ ] Create peptide with emoji in description
- [ ] Create peptide with very long description (1000+ chars)
- [ ] Verify all data types stored correctly:
  - [ ] Strings remain strings
  - [ ] Numbers remain numbers
  - [ ] Booleans remain booleans
  - [ ] JSON remains valid JSON
  - [ ] Nulls remain nulls

### 15. Edge Cases
- [ ] Submit form multiple times rapidly
- [ ] Open multiple edit dialogs (close previous first)
- [ ] Edit peptide that was just deleted
- [ ] Create peptide with identical name to existing
- [ ] Very long peptide names (100+ characters)
- [ ] Very long vendor/category names
- [ ] Empty JSON arrays: `[]`
- [ ] Empty JSON objects: `{}`

### 16. Integration Testing
- [ ] Created peptide shows in customer catalog
- [ ] Updated prices reflect in batch creation
- [ ] Deactivated peptide doesn't show in batch selection
- [ ] Deleted peptide doesn't show anywhere
- [ ] Categories filter works with new categories
- [ ] Dosing guide shows updated dosing info

### 17. Security Testing
- [ ] Non-admin users cannot access `/admin/peptides`
- [ ] API calls require authentication
- [ ] SQL injection attempts fail gracefully
- [ ] XSS attempts in text fields are sanitized
- [ ] CSRF protection is enabled

## 📊 Test Results

### Summary
- Total Tests: 100+
- Passed: ___
- Failed: ___
- Blocked: ___
- Not Tested: ___

### Critical Issues Found
1. _____________
2. _____________
3. _____________

### Non-Critical Issues Found
1. _____________
2. _____________
3. _____________

### Recommendations
1. _____________
2. _____________
3. _____________

## ✅ Sign-Off

- [ ] All critical functionality tested
- [ ] All critical bugs fixed
- [ ] Performance is acceptable
- [ ] Security concerns addressed
- [ ] Ready for production deployment

**Tested By:** _______________
**Date:** _______________
**Version:** _______________
**Environment:** _______________

## 🚀 Deployment Checklist

After testing passes:

- [ ] Merge feature branch to main
- [ ] Run database migrations if needed
- [ ] Deploy to staging environment
- [ ] Run smoke tests on staging
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Verify in production
- [ ] Update documentation
- [ ] Notify team of new features

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Check network tab for API failures
3. Check Supabase logs
4. Review error messages carefully
5. Test with different browsers
6. Clear cache and retry
7. Check database permissions
8. Verify admin role assignment

## 🎯 Success Criteria

✅ Admin can create peptides with basic info
✅ Admin can create peptides with complete info
✅ Admin can edit all fields of existing peptides
✅ Admin can delete peptides
✅ Admin can toggle peptide visibility
✅ JSON fields validate correctly
✅ Form is user-friendly and intuitive
✅ All data saves and loads correctly
✅ No console errors or warnings
✅ Performance is fast and responsive

---

**Status:** Ready for Testing
**Priority:** High
**Impact:** High - Core Admin Functionality

