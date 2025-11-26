import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Info, 
  Beaker, 
  Package,
  ChevronRight,
  PillIcon
} from 'lucide-react'
import type { Database } from '@/types/database'

type Peptide = Database['public']['Tables']['peptides']['Row']

interface DosingGuideCardProps {
  peptide: Peptide
}

export function DosingGuideCard({ peptide }: DosingGuideCardProps) {
  // Ensure dosing is always an array
  let dosing: Array<{
    vialSize: string
    reconstitution: string
    frequency: string
    subcutaneous: string
  }> = []
  
  if (peptide.dosing) {
    if (Array.isArray(peptide.dosing)) {
      dosing = peptide.dosing as Array<{
        vialSize: string
        reconstitution: string
        frequency: string
        subcutaneous: string
      }>
    }
  }

  const hasDosing = Array.isArray(dosing) && dosing.length > 0

  return (
    <Link href={`/dosing-guide/${peptide.id}`}>
      <Card className="group overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 bg-gradient-to-br from-card to-primary/[0.01] h-full">
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                {peptide.icon || '🔬'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                  {peptide.name}
                </h3>
                {peptide.strength && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Package className="h-3.5 w-3.5" />
                    <span>{peptide.strength}</span>
                  </div>
                )}
              </div>
            </div>
            {peptide.category && (
              <Badge variant="secondary" className="text-xs w-fit">
                {peptide.category}
              </Badge>
            )}
          </div>

          {/* Vendor */}
          {peptide.vendor && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Beaker className="h-3.5 w-3.5" />
              <span>{peptide.vendor}</span>
            </div>
          )}

          {/* Description */}
          {peptide.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {peptide.description}
            </p>
          )}

          {/* Dosing Preview */}
          {hasDosing ? (
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <PillIcon className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm text-foreground">
                  Dosing Protocol{dosing.length > 1 ? 's' : ''} Available
                </span>
              </div>
              <div className="space-y-1.5">
                {dosing.slice(0, 2).map((protocol, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{protocol.vialSize}:</span>{' '}
                    {protocol.frequency}
                  </div>
                ))}
                {dosing.length > 2 && (
                  <p className="text-xs text-primary font-medium">
                    +{dosing.length - 2} more protocol{dosing.length - 2 > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-muted/50 border rounded-lg p-4 text-center">
              <Info className="h-5 w-5 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground">
                No dosing information available yet
              </p>
            </div>
          )}

          {/* View Details Button */}
          <Button
            className="w-full group-hover:shadow-lg transition-all pointer-events-none"
            variant={hasDosing ? 'default' : 'outline'}
          >
            <span>View Full Details</span>
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}

