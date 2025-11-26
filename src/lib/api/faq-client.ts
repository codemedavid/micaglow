import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'

type FAQCategory = Database['public']['Tables']['faq_categories']['Row']
type FAQQuestion = Database['public']['Tables']['faq_questions']['Row']

export interface FAQCategoryWithQuestions extends FAQCategory {
  questions: FAQQuestion[]
}

/**
 * Fetches all active FAQ categories with their questions
 * Client-side only - for use in Client Components
 */
export async function getAllFAQsClient(): Promise<FAQCategoryWithQuestions[]> {
  const supabase = createClient()
  
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
    return categories.map(cat => ({ ...cat, questions: [] }))
  }

  // Group questions by category
  const categoriesWithQuestions = categories.map(category => ({
    ...category,
    questions: questions?.filter(q => q.category_id === category.id) || []
  }))

  return categoriesWithQuestions
}

/**
 * Searches FAQs by query string
 * Client-side only - for use in Client Components
 */
export async function searchFAQsClient(query: string): Promise<FAQCategoryWithQuestions[]> {
  if (!query || query.trim().length === 0) {
    return []
  }

  const supabase = createClient()
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
 * Client-side only
 */
export async function incrementFAQViewClient(questionId: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase.rpc('increment_faq_view', {
    question_id: questionId
  })

  if (error) {
    console.error('Error incrementing FAQ view:', error)
  }
}

/**
 * Records a helpful vote for a FAQ question
 * Client-side only
 */
export async function voteFAQHelpfulClient(questionId: string, isHelpful: boolean): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase.rpc('vote_faq_helpful', {
    question_id: questionId,
    is_helpful: isHelpful
  })

  if (error) {
    console.error('Error voting on FAQ:', error)
  }
}

