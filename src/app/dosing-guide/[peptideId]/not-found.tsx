import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, ArrowLeft, Search } from 'lucide-react'

export default function PeptideNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9ff] via-white to-white flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full">
        <CardContent className="text-center py-16 px-6 space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="h-10 w-10 text-amber-600" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-foreground">
              Peptide Not Found
            </h1>
            <p className="text-muted-foreground text-lg">
              The peptide you&apos;re looking for doesn&apos;t exist or has been removed from our database.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link href="/dosing-guide">
              <Button variant="default" className="gap-2">
                <Search className="h-4 w-4" />
                Browse All Peptides
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

