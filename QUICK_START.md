# Mama Mica - Quick Start

## ✅ What's Been Built

A complete Next.js application for managing peptides group buy batches with the following features:

### Customer Features
- ✅ WhatsApp-based authentication (whitelist verification)
- ✅ Browse available batches with fill progress
- ✅ View batch details with peptides table
- ✅ Search and filter peptides
- ✅ Add peptides to cart with quantity controls
- ✅ Real-time availability tracking (remaining vials)
- ✅ Shopping cart management
- ✅ Checkout with WhatsApp redirect to admin
- ✅ Order history and status tracking
- ✅ Order confirmation with WhatsApp integration

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ Batch overview
- 🚧 Batch creation/editing (placeholder UI)
- 🚧 Whitelist management (placeholder UI)
- 🚧 Order review interface (placeholder UI)

### Technical Features
- ✅ Next.js 15 with App Router
- ✅ TypeScript for type safety
- ✅ Supabase for database and authentication
- ✅ Row Level Security (RLS) policies
- ✅ TanStack Query for data fetching
- ✅ React Hook Form + Zod for forms
- ✅ Tailwind CSS + shadcn/ui components
- ✅ Responsive design (mobile-first)
- ✅ WhatsApp deep link integration
- ✅ Middleware for auth protection
- ✅ Atomic transaction for checkout (prevents overfilling)

## 🚀 Getting Started (2 Minutes)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create a new project
   - Wait 2-3 minutes for provisioning

2. **Set Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Supabase credentials

3. **Run Database Setup**
   - Copy content of `supabase-schema.sql`
   - Paste in Supabase SQL Editor
   - Run it

4. **Enable Anonymous Auth**
   - Supabase Dashboard → Authentication → Providers
   - Enable "Anonymous sign-ins"

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Test the App**
   - Open http://localhost:3000
   - Enter test WhatsApp: `+639154901224`
   - Browse batches!

## 📁 Project Structure

```
mama-mica/
├── src/
│   ├── app/                    # Pages
│   │   ├── auth/join/          # WhatsApp authentication
│   │   ├── batches/            # Batch listing & details
│   │   ├── cart/               # Shopping cart
│   │   ├── orders/             # Order history
│   │   └── admin/              # Admin dashboard
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── batch-card.tsx
│   │   └── peptides-table.tsx
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utilities and API
│   └── types/                  # TypeScript types
├── supabase-schema.sql         # Database schema
├── SETUP.md                    # Detailed setup guide
└── README.md                   # Full documentation
```

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `src/middleware.ts` | Auth protection for all routes |
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/lib/supabase/server.ts` | Server Supabase client |
| `src/lib/api/` | API service functions |
| `src/hooks/` | React Query hooks |
| `supabase-schema.sql` | Complete database setup |

## 🔧 Common Commands

```bash
# Development
npm run dev        # Start dev server

# Production
npm run build      # Build for production
npm run start      # Start production server

# Linting
npm run lint       # Run ESLint
```

## 📝 Test Data

The database schema includes seed data:

**Whitelist Numbers:**
- `+639154901224` - Admin (David)
- `+639171234567` - Pilot user 1
- `+639181234567` - Pilot user 2

**Sample Peptides:**
- BPC-157, TB-500, CJC-1295
- Ipamorelin, GHRP-6, Melanotan II
- Thymosin Alpha-1, Selank, Semax, Epithalon

## 🚧 What's Next

To complete the application, implement:

1. **Batch Creation UI** (Admin)
   - Form to create new batches
   - Add/remove peptides to batch
   - Set pricing and quantities

2. **Whitelist Manager** (Admin)
   - CSV upload for bulk adding
   - Add/remove single numbers
   - View audit log

3. **Order Management** (Admin)
   - Review all orders
   - Update order status
   - Export to CSV

4. **Batch Transitions** (Admin)
   - UI to change batch status
   - Validation guards
   - Status history

## ⚠️ Important Notes

1. **Type Casting**: The codebase uses `(supabase as any)` to work around Supabase type inference issues. In production, generate proper types using:
   ```bash
   supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
   ```

2. **Build Warnings**: You may see warnings about Node.js APIs in Edge Runtime - these are from Supabase dependencies and can be ignored.

3. **Environment Variables**: Never commit `.env.local` to git. It's already in `.gitignore`.

4. **Admin Access**: To test admin features:
   - Sign in with `+639154901224`
   - Go to Supabase Dashboard → profiles table
   - Change your `role` to `admin`
   - Refresh the app

## 📚 Documentation

- **SETUP.md** - Detailed setup instructions
- **README.md** - Complete documentation
- **supabase-schema.sql** - Database schema with comments

## 🎉 You're Ready!

The application is fully functional for the core customer flow:
1. WhatsApp authentication ✅
2. Browse batches ✅
3. Add to cart ✅
4. Checkout ✅
5. WhatsApp redirect ✅
6. View orders ✅

Happy coding! 🚀

