'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FAQAccordion } from '@/components/faq-accordion'
import { BatchesHeader } from '@/components/batches-header'
import { 
  ArrowLeft,
  HelpCircle,
  Search
} from 'lucide-react'


export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9ff] via-white to-white">
      {/* Header with Navigation */}
      <BatchesHeader />

      {/* Main Content */}
      <main className="py-12 md:py-20">
        <div className="container mx-auto px-6 max-w-[1200px]">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <Badge variant="secondary" className="rounded-full px-4 py-1.5">
              <HelpCircle className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              FAQ
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to all your questions about our platform, peptides, and group buying process
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search FAQ..."
                className="w-full pl-10 pr-4 py-3 border border-border rounded-full bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <FAQAccordion showAll={true} />

          {/* Contact CTA */}
          <div className="mt-16 text-center">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Still have questions?</h3>
                <p className="text-muted-foreground mb-6">
                  Can&apos;t find what you&apos;re looking for? Contact our admin team for personalized assistance.
                </p>
                <div className="flex justify-center">
                  <a 
                    href="https://wa.me/639154901224" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="rounded-full">
                      Contact via WhatsApp
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
