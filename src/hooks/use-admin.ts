'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllBatches,
  createBatch,
  updateBatch,
  deleteBatch,
  setFeaturedBatch,
  getAllPeptides,
  createPeptide,
  updatePeptide,
  deletePeptide,
  addPeptideToBatch,
  updateBatchPeptide,
  removePeptideFromBatch,
  getCategories,
  getVendors,
} from '@/lib/api/admin'
import { useToast } from '@/hooks/use-toast'

// ============================================================================
// BATCHES
// ============================================================================

export function useAdminBatches() {
  return useQuery({
    queryKey: ['admin-batches'],
    queryFn: getAllBatches,
  })
}

export function useCreateBatch() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: createBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-batches'] })
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      toast({
        title: 'Success!',
        description: 'Batch created successfully',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateBatch() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateBatch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-batches'] })
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      toast({
        title: 'Success!',
        description: 'Batch updated successfully',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useDeleteBatch() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deleteBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-batches'] })
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      toast({
        title: 'Success!',
        description: 'Batch deleted successfully',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useSetFeaturedBatch() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: setFeaturedBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-batches'] })
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      toast({
        title: 'Featured batch updated!',
        description: 'This batch is now the featured batch for customers',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// ============================================================================
// PEPTIDES
// ============================================================================

export function useAdminPeptides() {
  return useQuery({
    queryKey: ['admin-peptides'],
    queryFn: getAllPeptides,
  })
}

export function useCreatePeptide() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: createPeptide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-peptides'] })
      toast({
        title: 'Success!',
        description: 'Peptide created successfully',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useUpdatePeptide() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updatePeptide(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-peptides'] })
      toast({
        title: 'Success!',
        description: 'Peptide updated successfully',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useDeletePeptide() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deletePeptide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-peptides'] })
      toast({
        title: 'Success!',
        description: 'Peptide deleted successfully',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// ============================================================================
// BATCH PEPTIDES
// ============================================================================

export function useAddPeptideToBatch() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: addPeptideToBatch,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['batch-peptides', variables.batch_id] })
      toast({
        title: 'Success!',
        description: 'Peptide added to batch',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateBatchPeptide() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateBatchPeptide(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batch-peptides'] })
      toast({
        title: 'Success!',
        description: 'Batch peptide updated',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useRemovePeptideFromBatch() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: removePeptideFromBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batch-peptides'] })
      toast({
        title: 'Success!',
        description: 'Peptide removed from batch',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// ============================================================================
// CATEGORIES & VENDORS
// ============================================================================

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
}

export function useVendors() {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: getVendors,
  })
}

