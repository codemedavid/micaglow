import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9ff] to-white flex items-center justify-center px-4">
      <Card className="max-w-md w-full shadow-xl border-border/50">
        <CardContent className="pt-12 pb-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight">404</h1>
            <h2 className="text-2xl font-bold">Page Not Found</h2>
            <p className="text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link href="/">
              <Button size="lg" className="rounded-full w-full sm:w-auto">
                Go Home
              </Button>
            </Link>
            <Link href="/batches">
              <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto">
                Browse Batches
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
