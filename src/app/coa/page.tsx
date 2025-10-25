import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BatchesHeader } from '@/components/batches-header'
import { 
  ArrowLeft,
  FileText,
  Shield,
  CheckCircle,
  ExternalLink
} from 'lucide-react'

// Force static generation for maximum performance
export const dynamic = 'force-static'

// SEO metadata
export const metadata = {
  title: 'Certificate of Analysis (COA) - Mama Mica',
  description: 'Official laboratory test results and quality certificates for our peptide products. Verified purity, potency, and authenticity.',
  keywords: ['COA', 'Certificate of Analysis', 'peptide quality', 'laboratory testing', 'quality certificates'],
  openGraph: {
    title: 'Certificate of Analysis (COA) - Mama Mica',
    description: 'Official laboratory test results and quality certificates for our peptide products.',
  },
}

export default function COAPage() {

  // COA Images data
  const coaImages = [
    { id: 'IMG_5792', filename: 'IMG_5792.jpg', title: 'COA Document 1' },
    { id: 'IMG_5793', filename: 'IMG_5793.jpg', title: 'COA Document 2' },
    { id: 'IMG_5794', filename: 'IMG_5794.jpg', title: 'COA Document 3' },
    { id: 'IMG_5795', filename: 'IMG_5795.jpg', title: 'COA Document 4' },
    { id: 'IMG_5796', filename: 'IMG_5796.jpg', title: 'COA Document 5' },
    { id: 'IMG_5797', filename: 'IMG_5797.jpg', title: 'COA Document 6' },
    { id: 'IMG_5798', filename: 'IMG_5798.jpg', title: 'COA Document 7' },
    { id: 'IMG_5799', filename: 'IMG_5799.jpg', title: 'COA Document 8' },
    { id: 'IMG_5800', filename: 'IMG_5800.jpg', title: 'COA Document 9' },
    { id: 'IMG_5801', filename: 'IMG_5801.jpg', title: 'COA Document 10' },
    { id: 'IMG_5802', filename: 'IMG_5802.jpg', title: 'COA Document 11' },
    { id: 'IMG_5803', filename: 'IMG_5803.jpg', title: 'COA Document 12' },
    { id: 'IMG_5804', filename: 'IMG_5804.jpg', title: 'COA Document 13' },
    { id: 'IMG_5805', filename: 'IMG_5805.jpg', title: 'COA Document 14' },
    { id: 'IMG_5806', filename: 'IMG_5806.jpg', title: 'COA Document 15' },
    { id: 'IMG_5807', filename: 'IMG_5807.jpg', title: 'COA Document 16' },
    { id: 'IMG_5808', filename: 'IMG_5808.jpg', title: 'COA Document 17' },
    { id: 'IMG_5809', filename: 'IMG_5809.jpg', title: 'COA Document 18' },
    { id: 'IMG_5810', filename: 'IMG_5810.jpg', title: 'COA Document 19' },
    { id: 'IMG_5811', filename: 'IMG_5811.jpg', title: 'COA Document 20' },
    { id: 'IMG_5812', filename: 'IMG_5812.jpg', title: 'COA Document 21' },
    { id: 'IMG_5813', filename: 'IMG_5813.jpg', title: 'COA Document 22' },
  ]

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
            <Badge className="rounded-full px-4 py-1.5 bg-[#3CCB7F] text-white hover:bg-[#3CCB7F]">
              <Shield className="w-4 h-4 mr-2" />
              Vanguard Only
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Certificate of Analysis (COA)
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Official laboratory test results and quality certificates for our peptide products. 
              These documents verify purity, potency, and authenticity.
            </p>
          </div>

          {/* COA Information */}
          <div className="mb-12">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#3CCB7F]/10 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6 text-[#3CCB7F]" />
                    </div>
                    <h3 className="font-bold text-lg">Verified Quality</h3>
                    <p className="text-sm text-muted-foreground">
                      All COAs are from accredited laboratories with ISO certification
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">Comprehensive Testing</h3>
                    <p className="text-sm text-muted-foreground">
                      Each batch tested for purity, potency, sterility, and endotoxins
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                      <Shield className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="font-bold text-lg">Batch Traceability</h3>
                    <p className="text-sm text-muted-foreground">
                      Full traceability from manufacturing to delivery
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* COA Images Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center">Available COA Documents</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {coaImages.map((image, index) => (
                <Card 
                  key={image.id}
                  className="border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
                  <CardContent className="p-4">
                    <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-muted/30">
                      <Image
                        src={`/coa-images/${image.filename}`}
                        alt={image.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        priority={index < 8}
                        loading={index < 8 ? 'eager' : 'lazy'}
                        quality={85}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                            <ExternalLink className="w-4 h-4 text-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-sm font-medium">{image.title}</p>
                      <p className="text-xs text-muted-foreground">Click to view</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>


        </div>
      </main>


      {/* Footer */}
      <footer className="border-t border-border/50 bg-white py-12">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-xl font-black tracking-tight">Mama Mica</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Premium peptides group buy platform. Trusted by the community since 2025.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/batches" className="hover:text-foreground transition-colors">Batches</Link></li>
                <li><Link href="/dosing-guide" className="hover:text-foreground transition-colors">Dosing Guide</Link></li>
                <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
                <li><Link href="/auth/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
                <li><Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
                <li><Link href="/dosing-guide" className="hover:text-foreground transition-colors">Dosing Guide</Link></li>
                <li><a href="https://wa.me/639154901224" className="hover:text-foreground transition-colors">Contact Admin</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="cursor-not-allowed opacity-50">Terms of Service</span></li>
                <li><span className="cursor-not-allowed opacity-50">Privacy Policy</span></li>
                <li><span className="cursor-not-allowed opacity-50">Disclaimer</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2025 Mama Mica. All rights reserved.</p>
            <p className="text-xs">
              Research peptides for educational purposes only. Not for human consumption.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
