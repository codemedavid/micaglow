'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-gradient-to-br from-background to-muted">
      <h1 className="text-4xl font-bold">Progress Bar Test</h1>
      
      <div className="p-8 bg-card border rounded-lg shadow-lg space-y-4 max-w-md">
        <p className="text-center text-muted-foreground mb-4">
          Click any link below and watch the TOP of your screen
        </p>
        
        <Link href="/" className="block">
          <Button className="w-full" size="lg">
            Go to Homepage
          </Button>
        </Link>
        
        <Link href="/batches" className="block">
          <Button className="w-full" size="lg" variant="secondary">
            Go to Batches
          </Button>
        </Link>
        
        <Link href="/orders" className="block">
          <Button className="w-full" size="lg" variant="outline">
            Go to Orders
          </Button>
        </Link>
      </div>

      <div className="text-center space-y-2 max-w-md">
        <p className="text-sm font-semibold">What to look for:</p>
        <p className="text-xs text-muted-foreground">
          A thin PURPLE BAR (4px) should appear at the VERY TOP of the screen when you click any link above.
        </p>
        <p className="text-xs text-muted-foreground">
          It animates from left to right and disappears when the page loads.
        </p>
      </div>
    </div>
  )
}

