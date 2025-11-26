# FAQ Database - Quick Start Guide

## 🚀 **Get Started in 5 Minutes**

### Step 1: Run Database Migrations (2 minutes)

1. **Open Supabase Dashboard**
   - Go to your project: https://supabase.com/dashboard
   - Click "SQL Editor" in left sidebar

2. **Create Tables**
   - Open `create-faq-tables.sql` in your code editor
   - Copy ALL contents
   - Paste into SQL Editor
   - Click "RUN" button
   - Wait for "Success" message

3. **Seed Data**
   - Open `seed-faq-data.sql` in your code editor
   - Copy ALL contents
   - Paste into SQL Editor
   - Click "RUN" button
   - Wait for "Success" message

4. **Verify** (Optional but recommended)
   ```sql
   SELECT COUNT(*) FROM faq_categories;  -- Should be 12
   SELECT COUNT(*) FROM faq_questions;   -- Should be 78
   ```

---

### Step 2: Test Locally (2 minutes)

```bash
# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

**Check These:**
- ✅ Homepage FAQ section displays
- ✅ Click "View All FAQ" button
- ✅ FAQ page shows all categories
- ✅ Click questions to expand
- ✅ No errors in console (F12)

---

### Step 3: Deploy to Vercel (1 minute)

```bash
# Commit and push
git add .
git commit -m "feat: migrate FAQ to database with analytics"
git push origin main
```

**Vercel will automatically:**
- Build your app
- Deploy to production
- Update your live site

---

## ✅ **That's It!**

Your FAQ system is now:
- ✅ Running from database
- ✅ Server-side rendered (faster)
- ✅ Tracking analytics
- ✅ Easy to update (no code changes)

---

## 📊 **What Changed?**

### Before
- 78 FAQs hardcoded in component
- Client-side rendering
- Required code changes to update

### After
- 78 FAQs in Supabase database
- Server-side rendering
- Update via Supabase dashboard

---

## 🎯 **Quick Test Checklist**

After deployment, verify:

- [ ] Homepage loads
- [ ] FAQ section shows 6 categories
- [ ] "View All FAQ" link works
- [ ] FAQ page shows 12 categories
- [ ] Questions expand/collapse
- [ ] Deep links work (share a question URL)
- [ ] Copy link button works
- [ ] No console errors

---

## 🔧 **How to Update FAQs Now**

### Add New FAQ
1. Go to Supabase → Table Editor → `faq_questions`
2. Click "Insert row"
3. Fill in:
   - **category_id**: Select category
   - **question**: Your question
   - **answer**: Your answer
   - **slug**: `your-question-in-lowercase-with-dashes`
   - **display_order**: Number (higher = lower on page)
4. Click "Save"
5. **Done!** No code deploy needed.

### Edit Existing FAQ
1. Go to Supabase → Table Editor → `faq_questions`
2. Find the question
3. Click edit icon
4. Update fields
5. Click "Save"
6. **Done!** Changes live immediately.

### Hide FAQ (Don't Delete)
1. Find the question in table
2. Set `is_active` to `false`
3. FAQ hidden but preserved in database

---

## 📚 **Full Documentation**

- **Complete Guide**: `FAQ_DATABASE_IMPLEMENTATION.md`
- **Analysis**: `FAQ_ANALYSIS.md`
- **Summary**: `FAQ_DATABASE_MIGRATION_COMPLETE.md`

---

## 🆘 **Troubleshooting**

### "No FAQs showing"
- Check if migrations ran: `SELECT * FROM faq_categories`
- Check Supabase logs for errors
- Check browser console (F12)

### "Database error"
- Verify migrations completed successfully
- Check RLS policies are enabled
- Restart dev server: `npm run dev`

### "Build errors"
- Run: `npm install`
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`

---

## 🎉 **You're Done!**

Your FAQ system is now database-powered and ready to scale!

**Questions?** Check the full documentation files or reach out to the team.

