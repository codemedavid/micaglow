import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FAQAccordion } from '@/components/faq-accordion'
import { BatchesHeader } from '@/components/batches-header'
import { getAllFAQs } from '@/lib/api/faq'
import { 
  ArrowLeft,
  HelpCircle,
  Search
} from 'lucide-react'

export const metadata = {
  title: 'Frequently Asked Questions - Mama Mica',
  description: 'Find answers to all your questions about peptides, group buying, ordering, shipping, dosing, and more. Comprehensive FAQ covering 12 categories.',
}

export default async function FAQPage() {
  const faqData = await getAllFAQs()
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

          {/* FAQ Categories */}
          <FAQAccordion faqData={faqData} showAll={true} />

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
