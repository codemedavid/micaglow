# Mama Mica - Group Buy Peptides Platform

A comprehensive Next.js application for managing peptides group buy batches with WhatsApp-based authentication and checkout.

## Features

### Customer Features
- ✅ WhatsApp number authentication with whitelist verification
- ✅ Browse available group buy batches
- ✅ View batch progress and fill percentages
- ✅ Search and filter peptides by name, vendor, category
- ✅ Add peptides to cart with quantity controls
- ✅ Real-time availability tracking
- ✅ Checkout with automatic WhatsApp redirect to admin
- ✅ Order history and status tracking

### Admin Features
- ✅ Dashboard with batch statistics
- 🚧 Create and manage batches
- 🚧 Add/edit peptides per batch
- 🚧 Batch status transitions (DRAFT → OPEN → FILLING → LOCKED → PAYMENT → CLOSED)
- 🚧 WhatsApp whitelist management (CSV upload)
- 🚧 Order review and verification
- 🚧 Export functionality

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + Custom WhatsApp Whitelist
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Phone Formatting**: libphonenumber-js

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mama-mica
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_WHATSAPP=639154901224
```

4. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the SQL to create all tables, views, functions, and RLS policies

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

The application uses the following tables:

- `profiles` - User profiles linked to auth.users
- `whatsapp_whitelist` - Authorized WhatsApp numbers
- `batches` - Group buy batches
- `peptides` - Master peptides catalog
- `batch_peptides` - Peptides available in each batch
- `carts` - User shopping carts
- `cart_items` - Items in carts
- `orders` - Placed orders
- `order_items` - Items in orders
- `whatsapp_logs` - WhatsApp message audit log

Run the `supabase-schema.sql` file in your Supabase SQL Editor to set up everything including:
- Tables with proper constraints
- Views for batch statistics
- RLS policies for security
- Checkout function with transactional guards
- Seed data for testing

## Project Structure

```
mama-mica/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── auth/join/          # WhatsApp authentication
│   │   ├── batches/            # Batch listing and details
│   │   ├── cart/               # Shopping cart
│   │   ├── orders/             # Order history and details
│   │   └── admin/              # Admin dashboard and management
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── batch-card.tsx      # Batch display card
│   │   └── peptides-table.tsx  # Peptides data table
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-auth.ts         # Authentication hook
│   │   ├── use-batches.ts      # Batch data hooks
│   │   ├── use-cart.ts         # Cart management hook
│   │   └── use-orders.ts       # Orders hooks
│   ├── lib/                    # Utility libraries
│   │   ├── api/                # API service functions
│   │   ├── supabase/           # Supabase client utilities
│   │   ├── constants.ts        # App constants
│   │   ├── format.ts           # Formatting utilities
│   │   ├── whatsapp.ts         # WhatsApp integration
│   │   └── providers.tsx       # React Query provider
│   ├── types/                  # TypeScript type definitions
│   │   └── database.ts         # Supabase database types
│   └── middleware.ts           # Auth middleware
├── supabase-schema.sql         # Database schema and seed data
└── package.json
```

## Key Features Explained

### WhatsApp Authentication
- Users enter their WhatsApp number on the join page
- System checks if number exists in `whatsapp_whitelist` table
- Creates/updates user profile with verified WhatsApp number
- Middleware enforces authentication on all protected routes

### Batch Status Flow
```
DRAFT → OPEN → FILLING → LOCKED → PAYMENT → CLOSED
```

- **DRAFT**: Batch is being set up by admin
- **OPEN**: Customers can browse and add to cart
- **FILLING**: Customers can checkout
- **LOCKED**: Admin reviewing, no new orders
- **PAYMENT**: All peptides filled, ready for payment
- **CLOSED**: Batch completed

### Checkout Flow
1. Customer adds items to cart
2. Clicks checkout (only available when batch status is FILLING)
3. System validates capacity and creates order atomically
4. Redirects to order confirmation page
5. Automatically opens WhatsApp with prefilled message to admin
6. Admin receives order details via WhatsApp
7. Admin verifies payment and updates order status

### Business Rules
- Cart items limited to one batch at a time
- Cannot add more vials than available (total - filled)
- Checkout only allowed when batch status is FILLING
- Atomic transaction ensures vials_filled never exceeds capacity
- RLS policies ensure users can only see/modify their own data

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL | Yes |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anonymous key | Yes |
| NEXT_PUBLIC_ADMIN_WHATSAPP | Admin WhatsApp number (E.164 format) | Yes |

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import project in Vercel:
   - Connect your GitHub repository
   - Framework Preset: Next.js
   - Root Directory: ./

3. Add environment variables in Vercel dashboard

4. Deploy!

The app will automatically:
- Build the Next.js application
- Optimize for production
- Enable server-side rendering
- Set up automatic deployments on git push

### Database Migrations

For production:
1. Run the `supabase-schema.sql` in your production Supabase project
2. Update RLS policies as needed
3. Add production whitelist numbers

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own carts and orders
- Admin role required for admin pages (enforced by middleware)
- WhatsApp whitelist prevents unauthorized access
- Atomic transactions prevent race conditions

## Testing

To test the application:

1. Add test WhatsApp numbers to whitelist:
```sql
INSERT INTO whatsapp_whitelist (whatsapp_e164, note) 
VALUES ('+639171234567', 'Test User');
```

2. Create a test batch and add peptides

3. Test customer flow:
   - Join with whitelisted number
   - Browse batches
   - Add items to cart
   - Checkout

4. Test admin flow:
   - Set user role to 'admin' in profiles table
   - Access admin dashboard
   - Review orders

## Contributing

This is a private project for Mama Mica. For any issues or feature requests, contact the development team.

## License

Proprietary - All rights reserved

## Support

For support, contact the admin via WhatsApp at +63 915 490 1224
# micaglow
