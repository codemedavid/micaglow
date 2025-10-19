import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Cart = Database['public']['Tables']['carts']['Row']
type CartItem = Database['public']['Tables']['cart_items']['Row']
type BatchPeptide = Database['public']['Tables']['batch_peptides']['Row']
type Peptide = Database['public']['Tables']['peptides']['Row']

export interface CartItemWithDetails extends CartItem {
  batch_peptide: BatchPeptide & {
    peptide: Peptide
  }
}

export interface CartWithItems extends Cart {
  items: CartItemWithDetails[]
  total: number
}

/**
 * Get or create cart for user and batch
 */
export async function getOrCreateCart(userId: string, batchId: string): Promise<Cart> {
  const supabase = createClient()

  // Try to get existing cart
  const { data: existingCart } = await (supabase as any)
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .eq('batch_id', batchId)
    .single()

  if (existingCart) {
    return existingCart
  }

  // Create new cart
  const { data: newCart, error } = await (supabase as any)
    .from('carts')
    .insert({ user_id: userId, batch_id: batchId })
    .select()
    .single()

  if (error) throw error

  return newCart
}

/**
 * Get cart with items
 */
export async function getCart(batchId: string): Promise<CartWithItems | null> {
  const supabase = createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return null

  const { data: cart } = await (supabase as any)
    .from('carts')
    .select('*')
    .eq('user_id', userData.user.id)
    .eq('batch_id', batchId)
    .single()

  if (!cart) return null

  const { data: items, error } = await (supabase as any)
    .from('cart_items')
    .select(`
      *,
      batch_peptide:batch_peptides(
        *,
        peptide:peptides(*)
      )
    `)
    .eq('cart_id', cart.id)

  if (error) throw error

  const cartItems = (items || []) as CartItemWithDetails[]
  
  const total = cartItems.reduce((sum, item) => {
    return sum + item.quantity * item.batch_peptide.price_per_vial
  }, 0)

  return {
    ...cart,
    items: cartItems,
    total,
  }
}

/**
 * Add item to cart
 */
export async function addToCart(
  batchId: string,
  batchPeptideId: string,
  quantity: number
): Promise<void> {
  const supabase = createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('Not authenticated')

  // Get or create cart
  const cart = await getOrCreateCart(userData.user.id, batchId)

  // Check if item already exists
  const { data: existingItem } = await (supabase as any)
    .from('cart_items')
    .select('*')
    .eq('cart_id', cart.id)
    .eq('batch_peptide_id', batchPeptideId)
    .single()

  if (existingItem) {
    // Update quantity
    const { error } = await (supabase as any)
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)

    if (error) throw error
  } else {
    // Insert new item
    const { error } = await (supabase as any)
      .from('cart_items')
      .insert({
        cart_id: cart.id,
        batch_peptide_id: batchPeptideId,
        quantity,
      })

    if (error) throw error
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(itemId: string, quantity: number): Promise<void> {
  const supabase = createClient()

  if (quantity <= 0) {
    // Remove item
    const { error } = await (supabase as any).from('cart_items').delete().eq('id', itemId)

    if (error) throw error
  } else {
    // Update quantity
    const { error } = await (supabase as any)
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)

    if (error) throw error
  }
}

/**
 * Remove item from cart
 */
export async function removeCartItem(itemId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await (supabase as any).from('cart_items').delete().eq('id', itemId)

  if (error) throw error
}

/**
 * Clear cart
 */
export async function clearCart(batchId: string): Promise<void> {
  const supabase = createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('Not authenticated')

  const { data: cart } = await (supabase as any)
    .from('carts')
    .select('*')
    .eq('user_id', userData.user.id)
    .eq('batch_id', batchId)
    .single()

  if (!cart) return

  const { error } = await (supabase as any).from('cart_items').delete().eq('cart_id', cart.id)

  if (error) throw error
}

