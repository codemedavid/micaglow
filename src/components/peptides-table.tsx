'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { PeptideCard } from '@/components/peptide-card'
import type { BatchPeptideWithDetails } from '@/lib/api/batches'
import { Search, Package2 } from 'lucide-react'

interface PeptidesTableProps {
  peptides: BatchPeptideWithDetails[]
  onAddToCart: (batchPeptideId: string, quantity: number) => void
  isAddingToCart: boolean
  batchStatus: string
}

export function PeptidesTable({ peptides, onAddToCart, isAddingToCart, batchStatus }: PeptidesTableProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const canAddToCart = batchStatus === 'OPEN' || batchStatus === 'FILLING'

  // Memoize filtered results to avoid re-filtering on every render
  const filteredPeptides = useMemo(() => {
    if (!searchTerm) return peptides
    
    const searchLower = searchTerm.toLowerCase()
    return peptides.filter((p) =>
      p.peptide.name.toLowerCase().includes(searchLower) ||
      p.peptide.vendor?.toLowerCase().includes(searchLower) ||
      p.peptide.category?.toLowerCase().includes(searchLower)
    )
  }, [peptides, searchTerm])

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by name, vendor, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 border-primary/20 bg-gradient-to-r from-background to-primary/[0.02] focus-visible:ring-primary"
        />
      </div>

      {/* Results Count */}
      {searchTerm && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package2 className="h-4 w-4" />
          <span>
            {filteredPeptides.length} {filteredPeptides.length === 1 ? 'peptide' : 'peptides'} found
          </span>
        </div>
      )}

      {/* Peptide Cards Grid */}
      {filteredPeptides.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Package2 className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg font-medium mb-2">No peptides found</p>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms' : 'Check back later for available peptides'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPeptides.map((peptide) => (
            <PeptideCard
              key={peptide.id}
              peptide={peptide}
              onAddToCart={onAddToCart}
              isAddingToCart={isAddingToCart}
              canAddToCart={canAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  )
}

