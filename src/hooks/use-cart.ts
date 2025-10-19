'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCart, addToCart, updateCartItem, removeCartItem } from '@/lib/api/cart'
import { useToast } from '@/hooks/use-toast'

export function useCart(batchId: string, enabled = true) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const query = useQuery({
    queryKey: ['cart', batchId],
    queryFn: () => getCart(batchId),
    enabled: !!batchId && enabled,
    staleTime: 30 * 1000, // Cache for 30 seconds
  })

  const addMutation = useMutation({
    mutationFn: ({ batchPeptideId, quantity }: { batchPeptideId: string; quantity: number }) =>
      addToCart(batchId, batchPeptideId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', batchId] })
      queryClient.invalidateQueries({ queryKey: ['batch-peptides', batchId] })
      toast({
        title: 'Added to cart',
        description: 'Item has been added to your cart',
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

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', batchId] })
      queryClient.invalidateQueries({ queryKey: ['batch-peptides', batchId] })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', batchId] })
      queryClient.invalidateQueries({ queryKey: ['batch-peptides', batchId] })
      toast({
        title: 'Removed from cart',
        description: 'Item has been removed from your cart',
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

  return {
    ...query,
    addToCart: addMutation.mutate,
    updateCartItem: updateMutation.mutate,
    removeCartItem: removeMutation.mutate,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
  }
}

