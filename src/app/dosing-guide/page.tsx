'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { DosingGuideCard } from '@/components/dosing-guide-card'
import { EnhancedPeptideDialog } from '@/components/enhanced-peptide-dialog'
import { BatchesHeader } from '@/components/batches-header'
import { getAllPeptides, getCategories } from '@/lib/api/peptides'
import { 
  Search, 
  Filter, 
  ArrowLeft,
  Beaker,
  PillIcon,
  BookOpen,
  Sparkles,
  Info,
  X
} from 'lucide-react'
import type { Database } from '@/types/database'

type Peptide = Database['public']['Tables']['peptides']['Row']

export default function DosingGuidePage() {
  const [selectedPeptide, setSelectedPeptide] = useState<Peptide | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Fetch all peptides
  const { data: peptides = [], isLoading } = useQuery({
    queryKey: ['peptides'],
    queryFn: getAllPeptides,
  })

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  // Filter peptides based on search and category
  const filteredPeptides = useMemo(() => {
    let filtered = peptides

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.vendor?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [peptides, selectedCategory, searchQuery])

  // Group peptides by category for display
  const peptidesByCategory = useMemo(() => {
    const grouped = new Map<string, Peptide[]>()
    
    filteredPeptides.forEach(peptide => {
      const category = peptide.category || 'Uncategorized'
      if (!grouped.has(category)) {
        grouped.set(category, [])
      }
      grouped.get(category)!.push(peptide)
    })

    return Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [filteredPeptides])

  function handleViewDetails(peptide: Peptide) {
    setSelectedPeptide(peptide)
    setDialogOpen(true)
  }

  function handlePeptideSelect(peptide: Peptide) {
    setSelectedPeptide(peptide)
    // Dialog stays open, just updates content
  }

  const activeFilters = [
    selectedCategory !== 'all' && selectedCategory,
    searchQuery.trim() && `Search: "${searchQuery}"`,
  ].filter(Boolean)

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

      {/* Filters Section */}
      <section className="sticky top-[73px] z-30 border-b border-border/50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6 py-4 max-w-[1400px]">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search peptides by name, description, vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="whitespace-nowrap"
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 mt-3 text-sm">
              <span className="text-muted-foreground">Active filters:</span>
              {activeFilters.map((filter, idx) => (
                <Badge key={idx} variant="secondary" className="gap-1">
                  {filter}
                  {filter !== 'all' && (
                    <button
                      onClick={() => {
                        if (typeof filter === 'string' && filter.startsWith('Search:')) {
                          setSearchQuery('')
                        } else {
                          setSelectedCategory('all')
                        }
                      }}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="h-6 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-[1400px]">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Loading peptides...</span>
              </div>
            </div>
          ) : filteredPeptides.length === 0 ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="text-center py-20">
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-bold mb-2">No peptides found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-12">
              {peptidesByCategory.map(([category, categoryPeptides]) => (
                <div key={category} className="space-y-6">
                  {/* Category Header */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20">
                      <Beaker className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-bold text-foreground">{category}</h2>
                      <Badge variant="secondary">{categoryPeptides.length}</Badge>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-l from-border to-transparent" />
                  </div>

                  {/* Peptide Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryPeptides.map((peptide) => (
                      <DosingGuideCard
                        key={peptide.id}
                        peptide={peptide}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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

      {/* Peptide Detail Dialog */}
      <EnhancedPeptideDialog
        peptide={selectedPeptide}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onPeptideSelect={handlePeptideSelect}
      />
    </div>
  )
}

