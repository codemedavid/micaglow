import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * On-demand revalidation API route
 * Call this when admin updates batches to immediately refresh the cache
 * 
 * Usage:
 * POST /api/revalidate
 * Body: { path: '/batches', secret: 'your-secret-token' }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from an authenticated admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden - Admin only' },
        { status: 403 }
      )
    }

    // Parse the request body
    const body = await request.json()
    const { path = '/batches' } = body

    // Revalidate the specified path
    revalidatePath(path)
    
    // Also revalidate batch detail pages if needed
    if (path === '/batches' || path.startsWith('/batches/')) {
      revalidatePath('/batches')
    }

    return NextResponse.json(
      { 
        revalidated: true, 
        path,
        message: 'Cache revalidated successfully',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Revalidation error:', err)
    return NextResponse.json(
      { 
        message: 'Error revalidating',
        error: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Revalidation API is active',
    usage: 'POST to this endpoint with { path: "/batches" }',
    note: 'Admin authentication required'
  })
}

