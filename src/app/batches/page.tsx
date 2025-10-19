import { Suspense } from 'react'
import { getBatchesServer } from '@/lib/api/batches.server'
import { BatchesHeader } from '@/components/batches-header'
import { BatchCard } from '@/components/batch-card'
import { BatchLoadingSkeleton } from '@/components/batch-loading-skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Package2, ArrowRight, ShieldCheck, Users, Lock, Star, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

// Use Incremental Static Regeneration for better performance
// Revalidate every 60 seconds - batch data doesn't change that often
export const revalidate = 60

async function BatchesContent() {
  // Fetch batches on server
  const batches = await getBatchesServer()
  
  // Check if user is admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let isAdmin = false
  if (user) {
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    isAdmin = profile?.is_admin || false
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-6 max-w-[1200px]">
        {!batches || batches.length === 0 ? (
          <div className="text-center py-16 md:py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Package2 className="h-10 w-10 text-primary" />
            </div>
            <p className="text-muted-foreground text-xl font-medium mb-2">No current batch available</p>
            <p className="text-sm text-muted-foreground mb-8">
              Check back later for the next group buy batch
            </p>
            {isAdmin && (
              <Link href="/admin/batches/new">
                <Button size="lg" className="rounded-full">
                  Create New Batch
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Featured Badge */}
            <div className="text-center space-y-4">
              <Badge className="bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 to-primary shadow-lg rounded-full text-base px-6 py-2">
                ⭐ Current Featured Batch
              </Badge>
              <p className="text-sm text-muted-foreground">
                Lock in your order now — payment comes when the batch is fully filled
              </p>
            </div>
            
            {/* Featured Batch Card */}
            {batches.map((batch) => (
              <div key={batch.id} className="relative">
                {/* Decorative background glow */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-3xl blur-2xl -z-10" />
                
                <BatchCard batch={batch} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default function BatchesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9ff] via-white to-white">
      {/* Header - Client Component for profile data */}
      <BatchesHeader />

      {/* Hero Section - Static, renders immediately */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(110,86,207,0.08),transparent_50%)]" />
        <div className="container mx-auto px-6 py-16 md:py-20 max-w-[1200px] relative">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            {/* Social Proof Badge */}
            <div className="inline-flex items-center gap-3 bg-white border border-border rounded-full px-4 py-2 shadow-sm">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-white" />
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/40 border-2 border-white" />
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent/20 to-accent/40 border-2 border-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FDBA37] text-[#FDBA37]" />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground"> 1000+ members</span>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
                Current Group Buy
                <br />
                <span className="text-primary">Batch</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Browse our featured batch, reserve your peptides, and lock in wholesale pricing through coordinated group purchasing.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-5 w-5 text-[#3CCB7F]" />
                <span className="font-medium text-foreground">Quality Verified</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Lock className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">Secure Platform</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-5 w-5 text-secondary" />
                <span className="font-medium text-foreground">Whitelist Only</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Batch Section - With Suspense for progressive loading */}
      <Suspense fallback={
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-6 max-w-[1200px]">
            <BatchLoadingSkeleton />
          </div>
        </section>
      }>
        <BatchesContent />
      </Suspense>

      {/* Info Section - Static, renders immediately */}
      <section className="py-16 bg-gradient-to-b from-white to-[#f7f9ff] border-y border-border/50">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: '1. Lock Your Order',
                description: 'Add peptides to cart and checkout during FILLING phase. Your vials are reserved — no payment yet.',
                icon: Lock,
                color: 'text-primary'
              },
              {
                title: '2. Wait for Fill',
                description: 'Watch the batch fill progress. Once 100% filled, the batch enters PAYMENT phase.',
                icon: TrendingUp,
                color: 'text-[#3CCB7F]'
              },
              {
                title: '3. Complete Payment',
                description: 'Admin sends payment instructions via WhatsApp when PAYMENT phase starts. Pay and receive!',
                icon: ShieldCheck,
                color: 'text-secondary'
              }
            ].map((step, idx) => (
              <div key={idx} className="space-y-4 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-border/50 shadow-sm">
                  <step.icon className={`h-7 w-7 ${step.color}`} />
                </div>
                <h3 className="font-bold text-xl">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Static, renders immediately */}
      <footer className="border-t border-border/50 bg-white py-8">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2025 Mama Mica. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <a 
                href="https://wa.me/639154901224" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Contact Admin
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
