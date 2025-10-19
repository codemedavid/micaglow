import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Order = Database['public']['Tables']['orders']['Row']
type OrderItem = Database['public']['Tables']['order_items']['Row']
type BatchPeptide = Database['public']['Tables']['batch_peptides']['Row']
type Peptide = Database['public']['Tables']['peptides']['Row']

export interface OrderItemWithDetails extends OrderItem {
  batch_peptide: BatchPeptide & {
    peptide: Peptide
  }
}

export interface OrderWithDetails extends Order {
  items: OrderItemWithDetails[]
  batch: {
    name: string
  }
}

/**
 * Get user orders
 */
export async function getOrders(): Promise<OrderWithDetails[]> {
  const supabase = createClient()

  const { data, error } = await (supabase as any)
    .from('orders')
    .select(`
      *,
      batch:batches(name),
      items:order_items(
        *,
        batch_peptide:batch_peptides(
          *,
          peptide:peptides(*)
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []) as OrderWithDetails[]
}

/**
 * Get a single order
 */
export async function getOrder(orderId: string): Promise<OrderWithDetails | null> {
  const supabase = createClient()

  const { data, error } = await (supabase as any)
    .from('orders')
    .select(`
      *,
      batch:batches(name),
      items:order_items(
        *,
        batch_peptide:batch_peptides(
          *,
          peptide:peptides(*)
        )
      )
    `)
    .eq('id', orderId)
    .single()

  if (error) throw error

  return data as OrderWithDetails
}

export interface ShippingInfo {
  shipping_name: string
  shipping_address: string
  shipping_phone: string
  delivery_method: 'Lalamove' | 'LBC' | 'J&T'
}

/**
 * Checkout - create order from cart
 */
export async function checkout(batchId: string, shippingInfo: ShippingInfo): Promise<string> {
  const supabase = createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('Not authenticated')

  // Call the checkout function
  const { data, error } = await (supabase as any).rpc('fn_checkout', {
    p_user: userData.user.id,
    p_batch: batchId,
    p_shipping_name: shippingInfo.shipping_name,
    p_shipping_address: shippingInfo.shipping_address,
    p_shipping_phone: shippingInfo.shipping_phone,
    p_delivery_method: shippingInfo.delivery_method,
  })

  if (error) throw error

  return data as string
}

