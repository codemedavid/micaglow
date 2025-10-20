'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { DosingGuideCard } from '@/components/dosing-guide-card'
import { 
  Search, 
  Filter, 
  Beaker,
  X,
  Sparkles,
} from 'lucide-react'
import type { Database } from '@/types/database'

type Peptide = Database['public']['Tables']['peptides']['Row']

interface DosingGuideClientProps {
  initialPeptides: Peptide[]
  initialCategories: string[]
}

export function DosingGuideClient({ 
  initialPeptides, 
  initialCategories 
}: DosingGuideClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filter peptides based on search and category
  const filteredPeptides = useMemo(() => {
    let filtered = initialPeptides

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
  }, [initialPeptides, selectedCategory, searchQuery])

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

  const activeFilters = [
    selectedCategory !== 'all' && selectedCategory,
    searchQuery.trim() && `Search: "${searchQuery}"`,
  ].filter(Boolean)

  return (
    <>
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
                aria-label="Search peptides"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
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
              {initialCategories.map((category) => (
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
            <div className="flex items-center gap-2 mt-3 text-sm flex-wrap">
              <span className="text-muted-foreground">Active filters:</span>
              {activeFilters.map((filter, idx) => (
                <Badge key={idx} variant="secondary" className="gap-1">
                  {filter}
                  <button
                    onClick={() => {
                      if (typeof filter === 'string' && filter.startsWith('Search:')) {
                        setSearchQuery('')
                      } else {
                        setSelectedCategory('all')
                      }
                    }}
                    className="ml-1 hover:text-destructive"
                    aria-label={`Remove ${filter} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
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
          {filteredPeptides.length === 0 ? (
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
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

