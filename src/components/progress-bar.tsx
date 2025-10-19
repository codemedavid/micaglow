'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'

// Configure NProgress
NProgress.configure({ 
  showSpinner: false,
  easing: 'ease',
  speed: 300,
  trickleSpeed: 200,
})

/**
 * Top progress bar for route transitions (Inner component)
 * Shows a smooth loading indicator when navigating between pages
 */
function ProgressBarInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Finish progress when route changes
    NProgress.done()
  }, [pathname, searchParams])

  useEffect(() => {
    // Handle link clicks
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLAnchorElement
      const href = target.href
      
      // Only show progress for internal links
      if (href && href.startsWith(window.location.origin)) {
        NProgress.start()
      }
    }

    // Handle back/forward navigation
    const handlePopState = () => {
      NProgress.start()
    }

    // Attach listeners to all links
    document.querySelectorAll('a[href^="/"]').forEach((anchor) => {
      anchor.addEventListener('click', handleAnchorClick as EventListener)
    })

    window.addEventListener('popstate', handlePopState)

    return () => {
      document.querySelectorAll('a[href^="/"]').forEach((anchor) => {
        anchor.removeEventListener('click', handleAnchorClick as EventListener)
      })
      window.removeEventListener('popstate', handlePopState)
    }
  }, [pathname])

  return <>{children}</>
}

/**
 * Top progress bar provider (wrapped in Suspense)
 */
export function ProgressBarProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <ProgressBarInner>{children}</ProgressBarInner>
    </Suspense>
  )
}
