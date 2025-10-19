'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrders, getOrder, checkout } from '@/lib/api/orders'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export interface ShippingInfo {
  shipping_name: string
  shipping_address: string
  shipping_phone: string
  delivery_method: 'Lalamove' | 'LBC' | 'J&T'
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  })
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  })
}

export function useCheckout(batchId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const router = useRouter()

  return useMutation({
    mutationFn: (shippingInfo: ShippingInfo) => checkout(batchId, shippingInfo),
    onSuccess: (orderId) => {
      queryClient.invalidateQueries({ queryKey: ['cart', batchId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['batch-peptides', batchId] })
      
      toast({
        title: 'Order placed!',
        description: 'Redirecting to WhatsApp...',
      })

      // Redirect to order confirmation page which will handle WhatsApp
      router.push(`/orders/${orderId}/confirm`)
    },
    onError: (error) => {
      toast({
        title: 'Checkout failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

