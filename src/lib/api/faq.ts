import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

type FAQCategory = Database['public']['Tables']['faq_categories']['Row']
type FAQQuestion = Database['public']['Tables']['faq_questions']['Row']

export interface FAQCategoryWithQuestions extends FAQCategory {
  questions: FAQQuestion[]
}

/**
 * Fetches all active FAQ categories with their questions
 * Server-side only - for use in Server Components
 */
export async function getAllFAQs(): Promise<FAQCategoryWithQuestions[]> {
  const supabase = await createClient()
  
  const { data: categories, error: categoriesError } = await supabase
    .from('faq_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (categoriesError) {
    console.error('Error fetching FAQ categories:', categoriesError)
    return []
  }

  if (!categories || categories.length === 0) {
    return []
  }

  // Fetch all questions for all categories in one query
  const { data: questions, error: questionsError } = await supabase
    .from('faq_questions')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (questionsError) {
    console.error('Error fetching FAQ questions:', questionsError)
    return (categories || []).map((cat: FAQCategory) => ({ ...cat, questions: [] }))
  }

  // Group questions by category
  const questionsArray: FAQQuestion[] = questions || []
  const categoriesWithQuestions = categories.map((category: FAQCategory) => ({
    ...category,
    questions: questionsArray.filter((q: FAQQuestion) => q.category_id === category.id)
  }))

  return categoriesWithQuestions
}

/**
 * Fetches a limited number of FAQ categories with their questions
 * Server-side only - for use in Server Components (e.g., homepage preview)
 */
export async function getLimitedFAQs(limit: number = 6): Promise<FAQCategoryWithQuestions[]> {
  const allFAQs = await getAllFAQs()
  return allFAQs.slice(0, limit)
}

/**
 * Fetches a single FAQ question by slug
 * Server-side only - for use in Server Components
 */
export async function getFAQBySlug(slug: string): Promise<FAQQuestion | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('faq_questions')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching FAQ by slug:', error)
    return null
  }

  return data
}

/**
 * Searches FAQs by query string
 * Server-side only - for use in Server Components
 */
export async function searchFAQs(query: string): Promise<FAQCategoryWithQuestions[]> {
  if (!query || query.trim().length === 0) {
    return []
  }

  const supabase = await createClient()
  const searchTerm = `%${query.toLowerCase()}%`

  // Search in questions and answers
  const { data: questions, error } = await supabase
    .from('faq_questions')
    .select('*, faq_categories(*)')
    .eq('is_active', true)
    .or(`question.ilike.${searchTerm},answer.ilike.${searchTerm}`)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error searching FAQs:', error)
    return []
  }

  if (!questions || questions.length === 0) {
    return []
  }

  // Group by categories
  const categoryMap = new Map<string, FAQCategoryWithQuestions>()

  questions.forEach((question: any) => {
    const category = question.faq_categories
    if (!category) return

    if (!categoryMap.has(category.id)) {
      categoryMap.set(category.id, {
        ...category,
        questions: []
      })
    }

    const categoryData = categoryMap.get(category.id)!
    categoryData.questions.push(question)
  })

  return Array.from(categoryMap.values()).sort((a, b) => a.display_order - b.display_order)
}

/**
 * Increments the view count for a FAQ question
 * Can be called from client or server
 */
export async function incrementFAQView(questionId: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase.rpc('increment_faq_view', {
    question_id: questionId
  } as any)

  if (error) {
    console.error('Error incrementing FAQ view:', error)
  }
}

/**
 * Records a helpful vote for a FAQ question
 * Can be called from client or server
 */
export async function voteFAQHelpful(questionId: string, isHelpful: boolean): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase.rpc('vote_faq_helpful', {
    question_id: questionId,
    is_helpful: isHelpful
  } as any)

  if (error) {
    console.error('Error voting on FAQ:', error)
  }
}

/**
 * Gets the most viewed FAQ questions
 * Server-side only - for analytics/admin
 */
export async function getMostViewedFAQs(limit: number = 10): Promise<FAQQuestion[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('faq_questions')
    .select('*')
    .eq('is_active', true)
    .order('view_count', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching most viewed FAQs:', error)
    return []
  }

  return data || []
}

/**
 * Gets the most helpful FAQ questions
 * Server-side only - for analytics/admin
 */
export async function getMostHelpfulFAQs(limit: number = 10): Promise<FAQQuestion[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('faq_questions')
    .select('*')
    .eq('is_active', true)
    .order('helpful_count', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching most helpful FAQs:', error)
    return []
  }

  return data || []
}

