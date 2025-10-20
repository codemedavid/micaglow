import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

export type Peptide = Database['public']['Tables']['peptides']['Row']

/**
 * Server-side: Fetch all active peptides
 */
export async function getAllPeptides(): Promise<Peptide[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('peptides')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching peptides:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching peptides:', error)
    return []
  }
}

/**
 * Server-side: Fetch a single peptide by ID
 */
export async function getPeptide(id: string): Promise<Peptide | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('peptides')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching peptide:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Unexpected error fetching peptide:', error)
    return null
  }
}

/**
 * Server-side: Get related peptides based on category
 */
export async function getRelatedPeptides(peptide: Peptide): Promise<Peptide[]> {
  try {
    const supabase = await createClient()
    
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

    if (error) {
      console.error('Error fetching related peptides:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching related peptides:', error)
    return []
  }
}

/**
 * Server-side: Get unique categories
 */
export async function getCategories(): Promise<string[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('peptides')
      .select('category')
      .eq('is_active', true)
      .not('category', 'is', null)

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    if (!data) return []

    const categories = [...new Set(
      data
        .map((p: { category: string | null }) => p.category)
        .filter((c): c is string => c !== null)
    )]
    return categories.sort()
  } catch (error) {
    console.error('Unexpected error fetching categories:', error)
    return []
  }
}

