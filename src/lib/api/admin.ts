import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Batch = Database['public']['Tables']['batches']['Row']
type BatchInsert = Database['public']['Tables']['batches']['Insert']
type Peptide = Database['public']['Tables']['peptides']['Row']
type PeptideInsert = Database['public']['Tables']['peptides']['Insert']
type BatchPeptide = Database['public']['Tables']['batch_peptides']['Row']
type BatchPeptideInsert = Database['public']['Tables']['batch_peptides']['Insert']

// ============================================================================
// CACHE REVALIDATION
// ============================================================================

/**
 * Trigger on-demand revalidation for better performance
 * Call this after admin updates to immediately refresh cached pages
 */
async function revalidateCache(path: string = '/batches') {
  try {
    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path }),
    })
    
    if (!response.ok) {
      console.warn('Cache revalidation failed:', await response.text())
    }
  } catch (error) {
    console.warn('Cache revalidation error:', error)
    // Don't throw - revalidation failure shouldn't break the admin action
  }
}

// ============================================================================
// BATCHES
// ============================================================================

/**
 * Create a new batch
 */
export async function createBatch(data: Omit<BatchInsert, 'id' | 'created_at'>): Promise<Batch> {
  const supabase = createClient()

  const { data: batch, error } = await (supabase as any)
    .from('batches')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  
  // Trigger cache revalidation
  await revalidateCache('/batches')
  
  return batch
}

/**
 * Update a batch
 */
export async function updateBatch(id: string, data: Partial<BatchInsert>): Promise<Batch> {
  const supabase = createClient()

  const { data: batch, error } = await (supabase as any)
    .from('batches')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  
  // Trigger cache revalidation
  await revalidateCache('/batches')
  await revalidateCache(`/batches/${id}`)
  
  return batch
}

/**
 * Set a batch as featured (unfeatured all others)
 */
export async function setFeaturedBatch(batchId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await (supabase as any)
    .rpc('set_featured_batch', { batch_id_param: batchId })

  if (error) throw error
  
  // Trigger cache revalidation
  await revalidateCache('/batches')
}

/**
 * Delete a batch
 */
export async function deleteBatch(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await (supabase as any)
    .from('batches')
    .delete()
    .eq('id', id)

  if (error) throw error
  
  // Trigger cache revalidation
  await revalidateCache('/batches')
}

/**
 * Get all batches (admin view - includes draft)
 */
export async function getAllBatches(): Promise<Batch[]> {
  const supabase = createClient()

  const { data, error } = await (supabase as any)
    .from('batches')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// ============================================================================
// PEPTIDES (PRODUCTS)
// ============================================================================

/**
 * Get all peptides
 */
export async function getAllPeptides(): Promise<Peptide[]> {
  const supabase = createClient()

  const { data, error } = await (supabase as any)
    .from('peptides')
    .select('*')
    .order('name')

  if (error) throw error
  return data || []
}

/**
 * Create a new peptide
 */
export async function createPeptide(data: Omit<PeptideInsert, 'id' | 'created_at'>): Promise<Peptide> {
  const supabase = createClient()

  const { data: peptide, error } = await (supabase as any)
    .from('peptides')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return peptide
}

/**
 * Update a peptide
 */
export async function updatePeptide(id: string, data: Partial<PeptideInsert>): Promise<Peptide> {
  const supabase = createClient()

  const { data: peptide, error } = await (supabase as any)
    .from('peptides')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return peptide
}

/**
 * Delete a peptide
 */
export async function deletePeptide(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await (supabase as any)
    .from('peptides')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================================================
// BATCH PEPTIDES
// ============================================================================

/**
 * Add peptide to batch
 */
export async function addPeptideToBatch(data: Omit<BatchPeptideInsert, 'id'>): Promise<BatchPeptide> {
  const supabase = createClient()

  const { data: batchPeptide, error } = await (supabase as any)
    .from('batch_peptides')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return batchPeptide
}

/**
 * Update batch peptide
 */
export async function updateBatchPeptide(id: string, data: Partial<BatchPeptideInsert>): Promise<BatchPeptide> {
  const supabase = createClient()

  const { data: batchPeptide, error } = await (supabase as any)
    .from('batch_peptides')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return batchPeptide
}

/**
 * Remove peptide from batch
 */
export async function removePeptideFromBatch(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await (supabase as any)
    .from('batch_peptides')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================================================
// CATEGORIES
// ============================================================================

/**
 * Get unique categories from peptides
 */
export async function getCategories(): Promise<string[]> {
  const supabase = createClient()

  const { data, error } = await (supabase as any)
    .from('peptides')
    .select('category')

  if (error) throw error

  // Extract unique non-null categories
  const categories = Array.from(
    new Set(
      (data || [])
        .map((p: any) => p.category)
        .filter((c: any) => c !== null && c !== '')
    )
  )

  return categories.sort() as string[]
}

/**
 * Get unique vendors from peptides
 */
export async function getVendors(): Promise<string[]> {
  const supabase = createClient()

  const { data, error } = await (supabase as any)
    .from('peptides')
    .select('vendor')

  if (error) throw error

  // Extract unique non-null vendors
  const vendors = Array.from(
    new Set(
      (data || [])
        .map((p: any) => p.vendor)
        .filter((v: any) => v !== null && v !== '')
    )
  )

  return vendors.sort() as string[]
}

// ============================================================================
// ORDERS MANAGEMENT
// ============================================================================

export interface AdminOrderItem {
  id: string
  quantity: number
  price_per_vial: number
  batch_peptide: {
    peptide: {
      name: string
      strength: string | null
    }
  }
}

export interface AdminOrder {
  id: string
  user_id: string
  batch_id: string
  status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED'
  total: number
  created_at: string
  whatsapp_message: string | null
  shipping_name: string | null
  shipping_address: string | null
  shipping_phone: string | null
  delivery_method: 'Lalamove' | 'LBC' | 'J&T' | null
  profile: {
    whatsapp_e164: string | null
  }
  items: AdminOrderItem[]
}

/**
 * Get all orders for a specific batch
 */
export async function getOrdersByBatch(batchId: string): Promise<AdminOrder[]> {
  const supabase = createClient()

  const { data, error } = await (supabase as any)
    .from('orders')
    .select(`
      *,
      profile:profiles!orders_user_id_fkey(whatsapp_e164),
      items:order_items(
        *,
        batch_peptide:batch_peptides(
          peptide:peptides(name, strength)
        )
      )
    `)
    .eq('batch_id', batchId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as AdminOrder[]
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED'
): Promise<void> {
  const supabase = createClient()

  const { error } = await (supabase as any)
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) throw error
}

// ============================================================================
// WHITELIST MANAGEMENT
// ============================================================================

export interface WhitelistEntry {
  id: number
  whatsapp_e164: string
  note: string | null
  created_at: string
}

/**
 * Get all whitelist entries
 */
export async function getAllWhitelistEntries(): Promise<WhitelistEntry[]> {
  const supabase = createClient()

  const { data, error } = await (supabase as any)
    .from('whatsapp_whitelist')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get whitelist count
 */
export async function getWhitelistCount(): Promise<number> {
  const supabase = createClient()

  const { count, error } = await (supabase as any)
    .from('whatsapp_whitelist')
    .select('*', { count: 'exact', head: true })

  if (error) throw error
  return count || 0
}

/**
 * Add a number to whitelist
 */
export async function addWhitelistEntry(
  whatsapp_e164: string,
  note?: string
): Promise<WhitelistEntry> {
  const supabase = createClient()

  const { data, error } = await (supabase as any)
    .from('whatsapp_whitelist')
    .insert({ whatsapp_e164, note: note || null })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update whitelist entry note
 */
export async function updateWhitelistEntry(
  id: number,
  note: string
): Promise<WhitelistEntry> {
  const supabase = createClient()

  const { data, error } = await (supabase as any)
    .from('whatsapp_whitelist')
    .update({ note })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Remove a number from whitelist
 */
export async function removeWhitelistEntry(id: number): Promise<void> {
  const supabase = createClient()

  const { error } = await (supabase as any)
    .from('whatsapp_whitelist')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Bulk add whitelist entries
 */
export async function bulkAddWhitelistEntries(
  entries: { whatsapp_e164: string; note?: string }[]
): Promise<{ success: number; failed: number; errors: string[] }> {
  const supabase = createClient()
  let success = 0
  let failed = 0
  const errors: string[] = []

  for (const entry of entries) {
    try {
      const { error } = await (supabase as any)
        .from('whatsapp_whitelist')
        .insert({ whatsapp_e164: entry.whatsapp_e164, note: entry.note || null })

      if (error) {
        failed++
        errors.push(`${entry.whatsapp_e164}: ${error.message}`)
      } else {
        success++
      }
    } catch (err) {
      failed++
      errors.push(`${entry.whatsapp_e164}: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return { success, failed, errors }
}

