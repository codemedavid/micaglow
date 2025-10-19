import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

export type Peptide = Database['public']['Tables']['peptides']['Row']

/**
 * Fetch all active peptides
 */
export async function getAllPeptides(): Promise<Peptide[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('peptides')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw error

  return data || []
}

/**
 * Fetch a single peptide by ID
 */
export async function getPeptide(id: string): Promise<Peptide | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('peptides')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error

  return data
}

/**
 * Get related peptides based on category and stacking recommendations
 */
export async function getRelatedPeptides(peptide: Peptide): Promise<Peptide[]> {
  const supabase = createClient()
  
  if (!peptide.category) {
    return []
  }
  
  // Get peptides from the same category, excluding current peptide
  const { data, error } = await supabase
    .from('peptides')
    .select('*')
    .eq('is_active', true)
    .eq('category', peptide.category)
    .neq('id', peptide.id)
    .limit(6)

  if (error) throw error

  return data || []
}

/**
 * Search peptides by name or description
 */
export async function searchPeptides(query: string): Promise<Peptide[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('peptides')
    .select('*')
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('name', { ascending: true })
    .limit(20)

  if (error) throw error

  return data || []
}

/**
 * Get unique categories
 */
export async function getCategories(): Promise<string[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('peptides')
    .select('category')
    .eq('is_active', true)
    .not('category', 'is', null)

  if (error) throw error

  if (!data) return []

  const categories = [...new Set(
    data
      .map((p: { category: string | null }) => p.category)
      .filter((c): c is string => c !== null)
  )]
  return categories.sort()
}

