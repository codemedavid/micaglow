import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BatchesHeader } from '@/components/batches-header'
import { DosingGuideClient } from './dosing-guide-client'
import { getAllPeptides, getCategories } from '@/lib/api/peptides.server'
import { 
  Beaker,
  PillIcon,
  BookOpen,
  Info,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Peptide Dosing Guide | Mama Mica',
  description: 'Complete dosing protocols, mechanisms of action, safety information, and stacking recommendations for all available peptides.',
}

export default async function DosingGuidePage() {
  // Fetch data on the server
  const [peptides, categories] = await Promise.all([
    getAllPeptides(),
    getCategories(),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9ff] via-white to-white">
      {/* Header with Navigation */}
      <BatchesHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(110,86,207,0.08),transparent_50%)]" />
        <div className="container mx-auto px-6 py-16 md:py-20 max-w-[1400px] relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-white border border-border rounded-full px-4 py-2 shadow-sm">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Comprehensive Resource</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
                Peptide
                <br />
                <span className="text-primary">Dosing Guide</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Complete dosing protocols, mechanisms of action, safety information, and stacking recommendations for all available peptides.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Beaker className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-black text-primary">{peptides.length}</div>
                  <div className="text-xs text-muted-foreground">Peptides</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <PillIcon className="h-5 w-5 text-secondary" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-black text-secondary">{categories.length}</div>
                  <div className="text-xs text-muted-foreground">Categories</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="border-y border-border/50 bg-gradient-to-r from-amber-500/10 to-amber-500/5">
        <div className="container mx-auto px-6 py-4 max-w-[1400px]">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong className="font-semibold">Research Use Only:</strong> All information is for educational and research purposes. 
              Not intended for human consumption. Always consult with qualified healthcare professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Client Component for Search/Filter and Peptide Grid */}
      <DosingGuideClient 
        initialPeptides={peptides}
        initialCategories={categories}
      />

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary to-primary/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 max-w-[1400px] relative">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Ready to Join a Batch?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Browse our active batches to find the peptides you need at group buy pricing.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link href="/batches">
                <Button size="lg" variant="secondary" className="rounded-full text-base px-8 shadow-xl hover:scale-105 transition-transform">
                  <PillIcon className="mr-2 h-5 w-5" />
                  View Active Batches
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
