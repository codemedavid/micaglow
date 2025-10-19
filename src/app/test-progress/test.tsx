'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function ProgressBarDebug() {
  useEffect(() => {
    // Check if NProgress is available
    if (typeof window !== 'undefined') {
      console.log('=== PROGRESS BAR DEBUG ===')
      console.log('Window loaded:', !!window)
      console.log('NProgress loaded:', !!(window as any).NProgress)
      
      // Try to access NProgress
      const nprogress = (window as any).NProgress
      if (nprogress) {
        console.log('NProgress methods:', Object.keys(nprogress))
      } else {
        console.warn('NProgress is not available on window!')
      }
    }
  }, [])

  const testProgress = async () => {
    const nprogress = (window as any).NProgress
    if (nprogress) {
      console.log('Starting NProgress manually...')
      nprogress.start()
      
      setTimeout(() => {
        nprogress.set(0.4)
      }, 200)
      
      setTimeout(() => {
        nprogress.set(0.7)
      }, 500)
      
      setTimeout(() => {
        nprogress.done()
      }, 1000)
    } else {
      alert('NProgress not found! Check console.')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-card border rounded-lg shadow-lg space-y-2">
      <p className="font-semibold text-sm">Debug Controls</p>
      <Button onClick={testProgress} size="sm" className="w-full">
        Test Progress Bar Manually
      </Button>
      <p className="text-xs text-muted-foreground">
        Opens console (F12) to see debug info
      </p>
    </div>
  )
}

