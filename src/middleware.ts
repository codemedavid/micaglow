import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/join', '/auth/login', '/dosing-guide']
  const isPublicRoute = publicRoutes.some(route => 
    route === '/' ? request.nextUrl.pathname === '/' : request.nextUrl.pathname.startsWith(route)
  )

  // Redirect unauthenticated users to login page
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Check if user has whitelisted WhatsApp number
  // OPTIMIZATION: Only check profile for protected routes (not on every request)
  if (user && !isPublicRoute) {
    // Only fetch profile if navigating to admin or join page
    const needsProfileCheck = request.nextUrl.pathname.startsWith('/admin') || 
                             request.nextUrl.pathname === '/auth/join'
    
    if (needsProfileCheck) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('whatsapp_e164, role')
        .eq('id', user.id)
        .single()

      // Restrict admin routes to admin users only
      if (request.nextUrl.pathname.startsWith('/admin') && profile?.role !== 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/batches'
        return NextResponse.redirect(url)
      }
    }
    
    // For all other authenticated routes, trust the JWT token
    // Profile data will be fetched client-side where needed
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

