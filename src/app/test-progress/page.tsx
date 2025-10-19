'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProgressBarDebug } from './test'

export default function TestProgressPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Progress Bar Test Page</h1>
      
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Link href="/">
          <Button className="w-full" size="lg">
            Navigate to Home (Link)
          </Button>
        </Link>
        
        <Button 
          className="w-full" 
          size="lg"
          onClick={() => router.push('/batches')}
        >
          Navigate to Batches (router.push)
        </Button>

        <Link href="/orders">
          <Button className="w-full" size="lg" variant="outline">
            Navigate to Orders (Link)
          </Button>
        </Link>

        <Button 
          className="w-full" 
          size="lg"
          variant="secondary"
          onClick={() => router.push('/cart')}
        >
          Navigate to Cart (router.push)
        </Button>
      </div>

      <div className="text-center mt-8">
        <p className="text-muted-foreground">
          Click any button above to test the progress bar.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          You should see a colored bar at the top of the page when navigating.
        </p>
      </div>

      <div className="fixed top-4 right-4 p-4 bg-card border rounded-lg shadow-lg">
        <p className="font-semibold mb-2">Debug Info:</p>
        <p className="text-xs">Check browser console (F12)</p>
        <p className="text-xs">Look for progress bar at the very top</p>
        <p className="text-xs">Bar should be 4px high, purple color</p>
      </div>

      <ProgressBarDebug />
    </div>
  )
}

