import { createClient as createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type Batch = Database['public']['Tables']['batches']['Row']

export interface BatchWithStats extends Batch {
  fill_percentage: number
  total_vials: number
  vials_filled: number
}

/**
 * SERVER-SIDE ONLY: Fetch all batches with fill statistics - OPTIMIZED
 * Only returns featured batches for customer view
 * Use this in Server Components for better performance
 */
export async function getBatchesServer(): Promise<BatchWithStats[]> {
  const supabase = await createServerClient()

  // Fetch only featured batches with their peptides in ONE query
  const { data: batches, error: batchesError } = await (supabase as any)
    .from('batches')
    .select(`
      *,
      batch_peptides (
        boxes_available,
        box_vial_min,
        vials_filled
      )
    `)
    .in('status', ['OPEN', 'FILLING', 'LOCKED', 'PAYMENT'])
    .eq('is_featured', true)
    .order('created_at', { ascending: false })

  if (batchesError) throw batchesError

  // Calculate stats from the loaded data (no additional queries)
  const batchesWithStats = (batches || []).map((batch: any) => {
    const peptides = batch.batch_peptides || []
    
    const totalVials = peptides.reduce(
      (sum: number, p: any) => sum + (p.boxes_available * p.box_vial_min),
      0
    )
    const vialsFilled = peptides.reduce(
      (sum: number, p: any) => sum + p.vials_filled,
      0
    )
    const fillPercentage = totalVials > 0 ? (vialsFilled / totalVials) * 100 : 0

    // Remove the nested data to match expected interface
    const { batch_peptides, ...batchData } = batch

    return {
      ...batchData,
      total_vials: totalVials,
      vials_filled: vialsFilled,
      fill_percentage: Math.round(fillPercentage * 100) / 100,
    }
  })

  return batchesWithStats
}

