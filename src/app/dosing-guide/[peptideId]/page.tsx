import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Beaker, 
  PillIcon, 
  Package,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react'
import { getPeptide, getRelatedPeptides } from '@/lib/api/peptides.server'
import type { Database } from '@/types/database'
import type { Metadata } from 'next'
import { PeptideDetailTabs } from './peptide-detail-tabs'

type Peptide = Database['public']['Tables']['peptides']['Row']

interface DosingProtocol {
  vialSize: string
  reconstitution: string
  frequency: string
  subcutaneous: string
  notes?: string
}

interface PageProps {
  params: Promise<{ peptideId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { peptideId } = await params
    const peptide = await getPeptide(peptideId)

    if (!peptide) {
      return {
        title: 'Peptide Not Found',
      }
    }

    return {
      title: `${peptide.name} - Dosing Guide | Mama Mica`,
      description: peptide.description || `Complete dosing protocol and information for ${peptide.name}`,
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Peptide Dosing Guide | Mama Mica',
      description: 'Complete dosing protocols and information for peptides',
    }
  }
}

export default async function PeptideDetailPage({ params }: PageProps) {
  try {
    const { peptideId } = await params
    const peptide = await getPeptide(peptideId)

    if (!peptide) {
      notFound()
    }

    const relatedPeptides = peptide.category ? await getRelatedPeptides(peptide) : []

  const benefits = (peptide.benefits as string[]) || []
  const sideEffects = (peptide.side_effects as string[]) || []
  const contraindications = (peptide.contraindications as string[]) || []
  const dosing = (peptide.dosing as unknown as DosingProtocol[]) || []
  const stacking = (peptide.stacking as string[]) || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9ff] via-white to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6 py-4 max-w-[1400px]">
          <Link href="/dosing-guide">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dosing Guide
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-[1400px]">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Peptide Header */}
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-4xl flex-shrink-0">
                {peptide.icon || '🔬'}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                    {peptide.name}
                  </h1>
                  {peptide.category && (
                    <Badge variant="secondary" className="text-sm px-4 py-1.5">
                      {peptide.category}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
                  {peptide.strength && (
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span className="font-medium">{peptide.strength}</span>
                    </div>
                  )}
                  {peptide.vendor && (
                    <div className="flex items-center gap-2">
                      <Beaker className="h-4 w-4" />
                      <span>{peptide.vendor}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <PeptideDetailTabs
            peptide={peptide}
            dosing={dosing}
            benefits={benefits}
            sideEffects={sideEffects}
            contraindications={contraindications}
            stacking={stacking}
          />

          {/* Related Peptides Section */}
          {relatedPeptides.length > 0 && (
            <div className="pt-8 border-t space-y-6">
              <div className="flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Related Peptides</h2>
                <Badge variant="secondary" className="ml-2">{relatedPeptides.length}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedPeptides.map((related) => (
                  <Link 
                    key={related.id}
                    href={`/dosing-guide/${related.id}`}
                  >
                    <Card className="group cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all h-full">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                            {related.icon || '🔬'}
                          </div>
                          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {related.name}
                          </h3>
                        </div>
                        {related.strength && (
                          <p className="text-xs text-muted-foreground">{related.strength}</p>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="w-full justify-between group-hover:bg-primary group-hover:text-white transition-colors"
                        >
                          View Details
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-12 p-8 bg-gradient-to-br from-primary via-primary to-primary/90 text-white rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative space-y-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold">Ready to Join a Batch?</h2>
              <p className="text-white/90">
                Browse our active batches to find {peptide.name} and other peptides at group buy pricing.
              </p>
              <Link href="/batches">
                <Button size="lg" variant="secondary" className="rounded-full shadow-xl hover:scale-105 transition-transform">
                  <PillIcon className="mr-2 h-5 w-5" />
                  View Active Batches
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  } catch (error) {
    console.error('Error loading peptide:', error)
    notFound()
  }
}

