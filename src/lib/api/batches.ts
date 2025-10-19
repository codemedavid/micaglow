import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Batch = Database['public']['Tables']['batches']['Row']
type BatchPeptide = Database['public']['Tables']['batch_peptides']['Row']
type Peptide = Database['public']['Tables']['peptides']['Row']

export interface BatchWithStats extends Batch {
  fill_percentage: number
  total_vials: number
  vials_filled: number
}

export interface BatchPeptideWithDetails extends BatchPeptide {
  peptide: Peptide
  total_vials: number
  remaining_vials: number
}

/**
 * Fetch all batches with fill statistics - OPTIMIZED
 * Only returns featured batches for customer view
 */
export async function getBatches(): Promise<BatchWithStats[]> {
  const supabase = createClient()

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

/**
 * Fetch a single batch with details
 */
export async function getBatch(batchId: string): Promise<Batch | null> {
  const supabase = createClient()

  const { data, error } = await (supabase as any)
    .from('batches')
    .select('*')
    .eq('id', batchId)
    .single()

  if (error) throw error

  return data
}

/**
 * Fetch batch peptides with details
 */
export async function getBatchPeptides(batchId: string): Promise<BatchPeptideWithDetails[]> {
  const supabase = createClient()

  const { data, error } = await (supabase as any)
    .from('batch_peptides')
    .select(`
      *,
      peptide:peptides(*)
    `)
    .eq('batch_id', batchId)

  if (error) throw error

  return (data || []).map((bp: any) => {
    const totalVials = bp.boxes_available * bp.box_vial_min
    const remainingVials = totalVials - bp.vials_filled

    return {
      ...bp,
      peptide: bp.peptide as Peptide,
      total_vials: totalVials,
      remaining_vials: remainingVials,
    }
  })
}

