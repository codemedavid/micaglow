import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FAQAccordion } from '@/components/faq-accordion'
import { 
  ShieldCheck, 
  Truck, 
  RefreshCcw, 
  Users, 
  TrendingUp, 
  Lock,
  ArrowRight,
  ExternalLink,
  Star,
  HelpCircle
} from 'lucide-react'

// Force static generation for maximum performance
// Homepage is pure static content - no need for server-side rendering
export const dynamic = 'force-static'

// Enhanced metadata for homepage SEO
export const metadata = {
  title: 'Mama Mica - Premium Peptides Group Buy Platform',
  description: 'Join our trusted community for exclusive access to pharmaceutical-grade peptides at wholesale prices through coordinated group purchases. Whitelist-only access, transparent process, quality assured.',
  keywords: ['peptides', 'group buy', 'pharmaceutical grade', 'wholesale peptides', 'peptide community', 'group purchasing'],
  openGraph: {
    title: 'Mama Mica - Premium Peptides at Group Buy Prices',
    description: 'Exclusive access to pharmaceutical-grade peptides at wholesale prices. Trusted by 1000+ members.',
  },
}


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9ff] via-white to-white">
      {/* Header */}
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 max-w-[1200px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-black tracking-tight text-foreground">
                Mama Mica
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  href="#how-it-works" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  How It Works
                </Link>
                <Link 
                  href="/dosing-guide" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dosing Guide
                </Link>
                <Link 
                  href="/faq" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button size="sm" className="rounded-full">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Subnav */}
      <div className="md:hidden border-b border-border/50 bg-white/80 backdrop-blur-sm sticky top-[73px] z-40">
        <div className="overflow-x-auto scrollbar-hide">
          <nav className="flex gap-6 px-6 py-3 min-w-max">
            <Link 
              href="#how-it-works" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              How It Works
            </Link>
            <Link 
              href="/dosing-guide" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              Dosing Guide
            </Link>
            <Link 
              href="/faq" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              FAQ
            </Link>
            <Link 
              href="/auth/login" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(110,86,207,0.08),transparent_50%)]" />
        <div className="container mx-auto px-6 py-20 md:py-28 max-w-[1200px] relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Social Proof Badge */}
              <div className="inline-flex items-center gap-3 bg-white border border-border rounded-full px-4 py-2 shadow-sm">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-white" />
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/40 border-2 border-white" />
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent/20 to-accent/40 border-2 border-white" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FDBA37] text-[#FDBA37]" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-foreground">Trusted by 1000+ members</span>
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
                  Premium Peptides,
                  <br />
                  <span className="text-primary">Group Buy Prices</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                  Join our trusted community for exclusive access to pharmaceutical-grade peptides at wholesale prices through coordinated group purchases.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/batches">
                  <Button size="lg" className="rounded-full text-base px-8 shadow-lg hover:shadow-xl transition-all">
                    Browse Active Batches
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="rounded-full text-base px-8">
                    Learn More
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="h-5 w-5 text-[#3CCB7F]" />
                  <span className="font-medium text-foreground">Quality Verified</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Secure Platform</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-5 w-5 text-secondary" />
                  <span className="font-medium text-foreground">Whitelist Only</span>
                </div>
              </div>
            </div>

            {/* Right Column - Visual - Desktop Only */}
            <div className="hidden lg:flex relative lg:h-[600px] items-center justify-center">
              <div className="relative w-full max-w-md mx-auto">
                {/* Floating Card 1 */}
                <Card className="absolute top-0 right-0 w-64 shadow-xl border-border/50 rotate-3 hover:rotate-6 transition-transform duration-300">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Badge className="bg-[#3CCB7F] text-white hover:bg-[#3CCB7F] rounded-full">
                        FILLING
                      </Badge>
                      <h3 className="font-bold text-lg">October Batch</h3>
                      <p className="text-sm text-muted-foreground">25+ peptides available</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">67%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-2/3" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Floating Card 2 */}
                <Card className="absolute bottom-12 left-0 w-64 shadow-xl border-border/50 -rotate-3 hover:-rotate-6 transition-transform duration-300">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Badge variant="secondary" className="rounded-full">
                        OPEN
                      </Badge>
                      <h3 className="font-bold text-lg">November Batch</h3>
                      <p className="text-sm text-muted-foreground">Opening soon</p>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-[#3CCB7F]" />
                        <span className="font-medium">Save up to 40%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Center Accent Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Row */}
      <section id="features" className="py-16 bg-white border-y border-border/50">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: 'Quality Assured',
                description: 'Pharmaceutical-grade peptides from verified vendors with third-party testing',
                color: 'text-[#3CCB7F]'
              },
              {
                icon: Truck,
                title: 'Coordinated Delivery',
                description: 'Efficient group shipping coordination for optimal pricing and timing',
                color: 'text-primary'
              },
              {
                icon: RefreshCcw,
                title: 'Transparent Process',
                description: 'Real-time batch tracking and WhatsApp communication at every step',
                color: 'text-secondary'
              }
            ].map((feature, idx) => (
              <Card 
                key={idx} 
                className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-bold text-xl">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="secondary" className="rounded-full px-4 py-1.5">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              How Group Buying Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our streamlined process to access premium peptides at wholesale prices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Get Whitelisted',
                description: 'Request access with your WhatsApp number to join our trusted community',
              },
              {
                step: '02',
                title: 'Browse Batches',
                description: 'View active batches with available peptides, pricing, and fill status',
              },
              {
                step: '03',
                title: 'Place Order',
                description: 'Add items to cart and checkout when batch is in FILLING status',
              },
              {
                step: '04',
                title: 'Receive Products',
                description: 'Get payment instructions via WhatsApp and receive coordinated delivery',
              }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-white font-black text-xl shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-xl">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -ml-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Reviews */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="secondary" className="rounded-full px-4 py-1.5">
              Trusted Community
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              What Our Members Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real feedback from our trusted community members
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah M.',
                role: 'Verified Member',
                initials: 'SM',
                rating: 5,
                text: 'The group buy process is seamless. I love the transparency and the WhatsApp communication keeps everything clear. Saved over 35% on my regular peptide stack!',
                color: 'from-primary/20 to-primary/40'
              },
              {
                name: 'Michael T.',
                role: 'Active Buyer',
                initials: 'MT',
                rating: 5,
                text: 'Quality products at unbeatable prices. The batch tracking system is brilliant - I always know exactly when my order will arrive. Highly recommend!',
                color: 'from-secondary/20 to-secondary/40'
              },
              {
                name: 'Jessica L.',
                role: '6+ Orders',
                initials: 'JL',
                rating: 5,
                text: 'Been using Mama Mica for 6 months now. The admin is responsive, products are legit, and the community is knowledgeable. Best decision for my wellness journey.',
                color: 'from-accent/20 to-accent/40'
              }
            ].map((review, idx) => (
              <Card 
                key={idx} 
                className="border-border/50 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-foreground font-bold text-lg`}>
                      {review.initials}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{review.name}</h4>
                      <p className="text-sm text-muted-foreground">{review.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FDBA37] text-[#FDBA37]" />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    &quot;{review.text}&quot;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Row */}
          <div className="grid md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-border/50">
            {[
              { label: 'Active Members', value: '100+' },
              { label: 'Batches Completed', value: '25+' },
              { label: 'Average Savings', value: '35%' },
              { label: 'Satisfaction Rate', value: '98%' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center space-y-2">
                <div className="text-4xl font-black text-primary">{stat.value}</div>
                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Screenshots */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#f7f9ff] to-white">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="text-center mb-16 space-y-4">
            <Badge className="rounded-full px-4 py-1.5 bg-[#3CCB7F] text-white hover:bg-[#3CCB7F]">
              Real Results
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Member Testimonials
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our community members are saying about their experience
            </p>
          </div>

          {/* Horizontal Scrollable Testimonials */}
          <div className="relative -mx-6 px-6 md:mx-0 md:px-0">
            {/* Scroll container */}
            <div className="overflow-x-auto scrollbar-hide pb-4">
              <div className="flex gap-6 min-w-max px-6 md:px-0">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <Card 
                    key={idx} 
                    className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex-shrink-0 w-[280px] md:w-[320px]"
                  >
                    <CardContent className="p-0">
                      {/* Placeholder for testimonial screenshot */}
                      <div className="aspect-[4/5] bg-gradient-to-br from-muted/30 via-muted/20 to-muted/30 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute inset-0" style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)',
                            backgroundSize: '10px 10px'
                          }} />
                        </div>
                        
                        {/* Icon */}
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center relative z-10">
                          <Star className="w-10 h-10 text-primary" />
                        </div>
                        
                        {/* Text */}
                        <div className="text-center space-y-2 relative z-10 px-6">
                          <p className="text-sm font-semibold text-muted-foreground">
                            Testimonial Screenshot #{idx}
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            Replace with actual image
                          </p>
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Optional caption area - uncomment if needed */}
                      {/* <div className="p-4 bg-white">
                        <p className="text-sm text-muted-foreground text-center">
                          Caption for testimonial #{idx}
                        </p>
                      </div> */}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Scroll hint */}
            <div className="flex justify-center mt-6 gap-2">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                <span>Scroll to see more</span>
              </div>
            </div>
          </div>

          {/* CTA Below Testimonials */}
          <div className="text-center mt-16 space-y-6">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-[#3CCB7F]" />
              <span>All testimonials from verified members</span>
            </div>
            <div>
              <Link href="/batches">
                <Button size="lg" className="rounded-full">
                  Join Our Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="secondary" className="rounded-full px-4 py-1.5">
              <HelpCircle className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Common Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to the most frequently asked questions about our platform and peptides
            </p>
          </div>

          <FAQAccordion maxCategories={4} />

          {/* View All FAQ Link */}
          <div className="text-center mt-12">
            <Link href="/faq">
              <Button variant="outline" size="lg" className="rounded-full">
                View All FAQ
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary to-primary/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 max-w-[1200px] relative">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join our community of informed buyers accessing premium peptides at group pricing. Browse active batches and see how much you can save.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link href="/batches">
                <Button size="lg" variant="secondary" className="rounded-full text-base px-8 shadow-xl hover:scale-105 transition-transform">
                  View Active Batches
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="rounded-full text-base px-8 border-white text-white hover:bg-white/10">
                  Request Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

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
                <li><Link href="/orders" className="hover:text-foreground transition-colors">Orders</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
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
