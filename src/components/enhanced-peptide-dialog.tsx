'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Info, 
  Beaker, 
  PillIcon, 
  AlertTriangle, 
  ShieldAlert,
  Link2,
  Clock,
  Thermometer,
  Package,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import type { Database } from '@/types/database'
import { getRelatedPeptides } from '@/lib/api/peptides'

type Peptide = Database['public']['Tables']['peptides']['Row']

interface DosingProtocol {
  vialSize: string
  reconstitution: string
  frequency: string
  subcutaneous: string
  notes?: string
}

interface EnhancedPeptideDialogProps {
  peptide: Peptide | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPeptideSelect?: (peptide: Peptide) => void
}

export function EnhancedPeptideDialog({ 
  peptide, 
  open, 
  onOpenChange,
  onPeptideSelect 
}: EnhancedPeptideDialogProps) {
  const [relatedPeptides, setRelatedPeptides] = useState<Peptide[]>([])
  const [loadingRelated, setLoadingRelated] = useState(false)

  useEffect(() => {
    if (open && peptide) {
      setLoadingRelated(true)
      getRelatedPeptides(peptide)
        .then(setRelatedPeptides)
        .catch(console.error)
        .finally(() => setLoadingRelated(false))
    }
  }, [peptide, open])

  if (!peptide) return null

  const benefits = (peptide.benefits as string[]) || []
  const sideEffects = (peptide.side_effects as string[]) || []
  const contraindications = (peptide.contraindications as string[]) || []
  const dosing = (peptide.dosing as unknown as DosingProtocol[]) || []
  const stacking = (peptide.stacking as string[]) || []

  function handleRelatedClick(relatedPeptide: Peptide) {
    onPeptideSelect?.(relatedPeptide)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-3xl">
              {peptide.icon || '🔬'}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-3xl font-black tracking-tight">
                {peptide.name}
              </DialogTitle>
              <DialogDescription className="text-base">
                {peptide.strength && <span className="font-medium">{peptide.strength}</span>}
                {peptide.vendor && <span className="ml-2">• {peptide.vendor}</span>}
              </DialogDescription>
            </div>
            {peptide.category && (
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {peptide.category}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="dosing" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dosing" className="gap-2">
              <PillIcon className="h-4 w-4" />
              Dosing
            </TabsTrigger>
            <TabsTrigger value="overview" className="gap-2">
              <Info className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="safety" className="gap-2">
              <ShieldAlert className="h-4 w-4" />
              Safety
            </TabsTrigger>
            <TabsTrigger value="stacking" className="gap-2">
              <Link2 className="h-4 w-4" />
              Stacking
            </TabsTrigger>
          </TabsList>

          {/* Dosing Tab - Now First */}
          <TabsContent value="dosing" className="space-y-6 mt-6">
            {dosing.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <PillIcon className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Dosing Protocols</h3>
                </div>
                {dosing.map((protocol, idx) => (
                  <div 
                    key={idx} 
                    className="border-2 border-primary/20 rounded-xl p-6 bg-gradient-to-br from-card to-primary/[0.02] hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {idx + 1}
                      </div>
                      <h4 className="font-bold text-xl text-primary">
                        {protocol.vialSize}
                      </h4>
                    </div>
                    <div className="space-y-4 text-sm">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Beaker className="h-4 w-4 text-primary" />
                            Reconstitution
                          </p>
                          <p className="text-muted-foreground">{protocol.reconstitution}</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            Frequency
                          </p>
                          <p className="text-muted-foreground">{protocol.frequency}</p>
                        </div>
                      </div>
                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                        <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" />
                          Dosing Guide
                        </p>
                        <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                          {protocol.subcutaneous}
                        </p>
                      </div>
                      {protocol.notes && (
                        <div className="p-4 bg-amber-500/10 border-2 border-amber-500/20 rounded-lg">
                          <p className="font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Important Note
                          </p>
                          <p className="text-sm text-amber-600 dark:text-amber-300">
                            {protocol.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-xl">
                <PillIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-muted-foreground mb-2">
                  No dosing information available
                </p>
                <p className="text-sm text-muted-foreground/70">
                  Please consult with a healthcare professional for dosing guidance
                </p>
              </div>
            )}

            {peptide.storage && (
              <div className="p-4 bg-gradient-to-r from-muted/50 to-muted/30 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="h-4 w-4 text-primary" />
                  <p className="font-semibold text-foreground">Storage Requirements</p>
                </div>
                <p className="text-sm text-muted-foreground">{peptide.storage}</p>
              </div>
            )}
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {peptide.description && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Description</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                  {peptide.description}
                </p>
              </div>
            )}

            {peptide.mechanism && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Mechanism of Action</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                  {peptide.mechanism}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {peptide.half_life && (
                <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-sm">Half-Life</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{peptide.half_life}</p>
                </div>
              )}

              {peptide.storage && (
                <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-sm">Storage</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{peptide.storage}</p>
                </div>
              )}
            </div>

            {benefits.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-semibold text-lg">Key Benefits</h3>
                </div>
                <div className="grid gap-2 pl-7">
                  {benefits.map((benefit, idx) => (
                    <div 
                      key={idx} 
                      className="text-sm text-muted-foreground flex items-start gap-2 p-2 rounded-lg hover:bg-emerald-500/5 transition-colors"
                    >
                      <span className="text-emerald-600 mt-0.5 font-bold">✓</span>
                      <span className="flex-1">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Safety Tab */}
          <TabsContent value="safety" className="space-y-6 mt-6">
            {sideEffects.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-lg">Potential Side Effects</h3>
                </div>
                <div className="grid gap-2 pl-7">
                  {sideEffects.map((effect, idx) => (
                    <div 
                      key={idx} 
                      className="text-sm text-muted-foreground flex items-start gap-2 p-2 rounded-lg hover:bg-amber-500/5 transition-colors"
                    >
                      <span className="text-amber-600 mt-0.5">⚠</span>
                      <span className="flex-1">{effect}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {contraindications.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-destructive" />
                  <h3 className="font-semibold text-lg text-destructive">Contraindications</h3>
                </div>
                <div className="grid gap-2 pl-7">
                  {contraindications.map((contra, idx) => (
                    <div 
                      key={idx} 
                      className="text-sm text-muted-foreground flex items-start gap-2 p-2 rounded-lg hover:bg-destructive/5 transition-colors"
                    >
                      <span className="text-destructive mt-0.5">✖</span>
                      <span className="flex-1">{contra}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-l-4 border-primary rounded-lg">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground mb-3 flex items-center gap-2 text-base">
                  <ShieldAlert className="h-5 w-5" />
                  Important Disclaimer
                </strong>
                Research peptides for educational and research purposes only. Not for human 
                consumption. Always consult with a qualified healthcare professional before 
                using any peptide or supplement. Individual results may vary.
              </p>
            </div>
          </TabsContent>

          {/* Stacking Tab */}
          <TabsContent value="stacking" className="space-y-6 mt-6">
            {stacking.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Link2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Recommended Combinations</h3>
                </div>
                <div className="grid gap-3">
                  {stacking.map((stack, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 bg-gradient-to-r from-primary/[0.05] to-secondary/[0.05] border border-primary/20 rounded-lg hover:shadow-md transition-all"
                    >
                      <p className="text-sm text-foreground leading-relaxed">{stack}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> Stacking recommendations 
                    are based on research and community feedback. Always research thoroughly 
                    and consult professionals before combining peptides.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-xl">
                <Link2 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No stacking recommendations available
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Related Peptides Section */}
        {relatedPeptides.length > 0 && (
          <div className="mt-8 pt-8 border-t space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Related Peptides</h3>
              <Badge variant="secondary" className="ml-2">{relatedPeptides.length}</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {relatedPeptides.map((related) => (
                <Card 
                  key={related.id}
                  className="group cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
                  onClick={() => handleRelatedClick(related)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-lg flex-shrink-0">
                        {related.icon || '🔬'}
                      </div>
                      <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {related.name}
                      </h4>
                    </div>
                    {related.strength && (
                      <p className="text-xs text-muted-foreground">{related.strength}</p>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="w-full justify-between group-hover:bg-primary group-hover:text-white transition-colors"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

