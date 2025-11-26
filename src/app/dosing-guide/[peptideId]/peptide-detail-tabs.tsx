'use client'

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
  Package,
  Sparkles,
} from 'lucide-react'

interface DosingProtocol {
  vialSize: string
  reconstitution: string
  frequency: string
  subcutaneous: string
  notes?: string
}

interface PeptideDetailTabsProps {
  peptide: {
    name: string
    description?: string | null
    mechanism?: string | null
    half_life?: string | null
    storage?: string | null
    icon?: string | null
    category?: string | null
    strength?: string | null
    vendor?: string | null
  }
  dosing: DosingProtocol[]
  benefits: string[]
  sideEffects: string[]
  contraindications: string[]
  stacking: string[]
}

export function PeptideDetailTabs({
  peptide,
  dosing,
  benefits,
  sideEffects,
  contraindications,
  stacking,
}: PeptideDetailTabsProps) {
  // Ensure dosing is always an array (defense in depth)
  const safeDosing = Array.isArray(dosing) ? dosing : []
  const safeBenefits = Array.isArray(benefits) ? benefits : []
  const safeSideEffects = Array.isArray(sideEffects) ? sideEffects : []
  const safeContraindications = Array.isArray(contraindications) ? contraindications : []
  const safeStacking = Array.isArray(stacking) ? stacking : []

  return (
    <Tabs defaultValue="dosing" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="dosing" className="gap-2">
          <PillIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Dosing</span>
        </TabsTrigger>
        <TabsTrigger value="overview" className="gap-2">
          <Info className="h-4 w-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="safety" className="gap-2">
          <ShieldAlert className="h-4 w-4" />
          <span className="hidden sm:inline">Safety</span>
        </TabsTrigger>
        <TabsTrigger value="stacking" className="gap-2">
          <Link2 className="h-4 w-4" />
          <span className="hidden sm:inline">Stacking</span>
        </TabsTrigger>
      </TabsList>

      {/* Dosing Tab */}
      <TabsContent value="dosing" className="space-y-6 mt-8">
        {safeDosing.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <PillIcon className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Dosing Protocols</h2>
            </div>
            {safeDosing.map((protocol, idx) => (
              <div 
                key={idx} 
                className="border-2 border-primary/20 rounded-xl p-6 bg-gradient-to-br from-card to-primary/[0.02] hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-xl text-primary">
                    {protocol.vialSize}
                  </h3>
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
          <div className="text-center py-16 bg-muted/30 rounded-xl">
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
      <TabsContent value="overview" className="space-y-6 mt-8">
        {peptide.description && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-xl">Description</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed pl-7">
              {peptide.description}
            </p>
          </div>
        )}

        {peptide.mechanism && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-xl">Mechanism of Action</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed pl-7">
              {peptide.mechanism}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {peptide.half_life && (
            <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Half-Life</h3>
              </div>
              <p className="text-sm text-muted-foreground">{peptide.half_life}</p>
            </div>
          )}

          {peptide.storage && (
            <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Storage</h3>
              </div>
              <p className="text-sm text-muted-foreground">{peptide.storage}</p>
            </div>
          )}
        </div>

        {safeBenefits.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <h2 className="font-bold text-xl">Key Benefits</h2>
            </div>
            <div className="grid gap-2 pl-7">
              {safeBenefits.map((benefit, idx) => (
                <div 
                  key={idx} 
                  className="text-sm text-muted-foreground flex items-start gap-2 p-3 rounded-lg hover:bg-emerald-500/5 transition-colors"
                >
                  <span className="text-emerald-600 mt-0.5 font-bold text-lg">✓</span>
                  <span className="flex-1">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </TabsContent>

      {/* Safety Tab */}
      <TabsContent value="safety" className="space-y-6 mt-8">
        {safeSideEffects.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h2 className="font-bold text-xl">Potential Side Effects</h2>
            </div>
            <div className="grid gap-2 pl-7">
              {safeSideEffects.map((effect, idx) => (
                <div 
                  key={idx} 
                  className="text-sm text-muted-foreground flex items-start gap-2 p-3 rounded-lg hover:bg-amber-500/5 transition-colors"
                >
                  <span className="text-amber-600 mt-0.5 text-lg">⚠</span>
                  <span className="flex-1">{effect}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {safeContraindications.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              <h2 className="font-bold text-xl text-destructive">Contraindications</h2>
            </div>
            <div className="grid gap-2 pl-7">
              {safeContraindications.map((contra, idx) => (
                <div 
                  key={idx} 
                  className="text-sm text-muted-foreground flex items-start gap-2 p-3 rounded-lg hover:bg-destructive/5 transition-colors"
                >
                  <span className="text-destructive mt-0.5 text-lg">✖</span>
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
      <TabsContent value="stacking" className="space-y-6 mt-8">
        {safeStacking.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-xl">Recommended Combinations</h2>
            </div>
            <div className="grid gap-3">
              {safeStacking.map((stack, idx) => (
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
          <div className="text-center py-16 bg-muted/30 rounded-xl">
            <Link2 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              No stacking recommendations available
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

