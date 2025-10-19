'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Info, 
  Beaker, 
  PillIcon, 
  AlertTriangle, 
  ShieldAlert,
  Link2,
  Clock,
  Thermometer,
} from 'lucide-react'
import type { Database } from '@/types/database'

type Peptide = Database['public']['Tables']['peptides']['Row']

interface DosingProtocol {
  vialSize: string
  reconstitution: string
  frequency: string
  subcutaneous: string
  notes?: string
}

interface PeptideDetailDialogProps {
  peptide: Peptide
  children?: React.ReactNode
}

export function PeptideDetailDialog({ peptide, children }: PeptideDetailDialogProps) {
  const [open, setOpen] = useState(false)

  const benefits = (peptide.benefits as string[]) || []
  const sideEffects = (peptide.side_effects as string[]) || []
  const contraindications = (peptide.contraindications as string[]) || []
  const dosing = (peptide.dosing as unknown as DosingProtocol[]) || []
  const stacking = (peptide.stacking as string[]) || []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Info className="h-4 w-4 mr-2" />
            View Details
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{peptide.icon || '🔬'}</span>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{peptide.name}</DialogTitle>
              <DialogDescription>
                {peptide.strength && <span className="font-medium">{peptide.strength}</span>}
                {peptide.vendor && <span className="ml-2 text-sm">• {peptide.vendor}</span>}
              </DialogDescription>
            </div>
            {peptide.category && (
              <Badge variant="secondary" className="text-sm">
                {peptide.category}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dosing">Dosing</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="stacking">Stacking</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-4">
            {peptide.description && (
              <div className="space-y-2">
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
              <div className="space-y-2">
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
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-sm">Half-Life</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{peptide.half_life}</p>
                </div>
              )}

              {peptide.storage && (
                <div className="p-4 rounded-lg border bg-card">
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
                  <PillIcon className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-semibold text-lg">Key Benefits</h3>
                </div>
                <ul className="space-y-2 pl-7">
                  {benefits.map((benefit, idx) => (
                    <li 
                      key={idx} 
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-emerald-600 mt-0.5">✓</span>
                      <span className="flex-1">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          {/* Dosing Tab */}
          <TabsContent value="dosing" className="space-y-6 mt-4">
            {dosing.length > 0 ? (
              <div className="space-y-4">
                {dosing.map((protocol, idx) => (
                  <div 
                    key={idx} 
                    className="border rounded-lg p-5 bg-gradient-to-br from-card to-primary/[0.02] hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-bold text-lg mb-3 text-primary">
                      {protocol.vialSize}
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-semibold text-foreground mb-1">Reconstitution</p>
                        <p className="text-muted-foreground">{protocol.reconstitution}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-1">Frequency</p>
                        <p className="text-muted-foreground">{protocol.frequency}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-1">Dosing Guide</p>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {protocol.subcutaneous}
                        </p>
                      </div>
                      {protocol.notes && (
                        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                          <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">
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
              <div className="text-center py-8">
                <PillIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No dosing information available
                </p>
              </div>
            )}

            {peptide.storage && (
              <div className="p-4 bg-muted/50 border rounded-lg">
                <p className="text-sm">
                  <strong className="text-foreground">Storage:</strong>{' '}
                  <span className="text-muted-foreground">{peptide.storage}</span>
                </p>
              </div>
            )}
          </TabsContent>

          {/* Safety Tab */}
          <TabsContent value="safety" className="space-y-6 mt-4">
            {sideEffects.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-lg">Potential Side Effects</h3>
                </div>
                <ul className="space-y-2 pl-7">
                  {sideEffects.map((effect, idx) => (
                    <li 
                      key={idx} 
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-amber-600 mt-0.5">⚠</span>
                      <span className="flex-1">{effect}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {contraindications.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-destructive" />
                  <h3 className="font-semibold text-lg text-destructive">Contraindications</h3>
                </div>
                <ul className="space-y-2 pl-7">
                  {contraindications.map((contra, idx) => (
                    <li 
                      key={idx} 
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-destructive mt-0.5">✖</span>
                      <span className="flex-1">{contra}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 p-4 bg-muted/50 border-l-4 border-primary rounded-lg">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground block mb-2">⚠️ Important Disclaimer</strong>
                Research peptides for educational and research purposes only. Not for human 
                consumption. Always consult with a qualified healthcare professional before 
                using any peptide or supplement. Individual results may vary.
              </p>
            </div>
          </TabsContent>

          {/* Stacking Tab */}
          <TabsContent value="stacking" className="space-y-6 mt-4">
            {stacking.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <Link2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Recommended Combinations</h3>
                </div>
                <div className="grid gap-3">
                  {stacking.map((stack, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 bg-gradient-to-r from-primary/[0.03] to-secondary/[0.03] border border-primary/10 rounded-lg hover:shadow-md transition-all"
                    >
                      <p className="text-sm text-foreground">{stack}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> Stacking recommendations 
                    are based on research and community feedback. Always research thoroughly 
                    and consult professionals before combining peptides.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Link2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No stacking recommendations available for this peptide
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

