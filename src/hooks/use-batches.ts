'use client'

import { useQuery } from '@tanstack/react-query'
import { getBatches, getBatch, getBatchPeptides } from '@/lib/api/batches'

export function useBatches() {
  return useQuery({
    queryKey: ['batches'],
    queryFn: getBatches,
  })
}

export function useBatch(batchId: string) {
  return useQuery({
    queryKey: ['batch', batchId],
    queryFn: () => getBatch(batchId),
    enabled: !!batchId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useBatchPeptides(batchId: string) {
  return useQuery({
    queryKey: ['batch-peptides', batchId],
    queryFn: () => getBatchPeptides(batchId),
    enabled: !!batchId,
    staleTime: 30 * 1000, // 30 seconds - this data changes more frequently
  })
}

// Combined hook for parallel fetching
export function useBatchWithPeptides(batchId: string) {
  const batchQuery = useBatch(batchId)
  const peptidesQuery = useBatchPeptides(batchId)

  return {
    batch: batchQuery.data,
    peptides: peptidesQuery.data,
    isLoading: batchQuery.isLoading || peptidesQuery.isLoading,
    error: batchQuery.error || peptidesQuery.error,
  }
}

