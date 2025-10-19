import { useState, memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/format'
import type { BatchPeptideWithDetails } from '@/lib/api/batches'
import { Plus, Minus, Package, Info, Clock, Thermometer, Pill, AlertCircle, Beaker, ExternalLink } from 'lucide-react'

interface PeptideCardProps {
  peptide: BatchPeptideWithDetails
  onAddToCart: (batchPeptideId: string, quantity: number) => void
  isAddingToCart: boolean
  canAddToCart: boolean
}

export const PeptideCard = memo(function PeptideCard({
  peptide,
  onAddToCart,
  isAddingToCart,
  canAddToCart,
}: PeptideCardProps) {
  const [quantity, setQuantity] = useState(0)

  function handleAddToCart() {
    if (quantity > 0) {
      onAddToCart(peptide.id, quantity)
      setQuantity(0)
    }
  }

  function getAvailabilityBadge() {
    if (peptide.remaining_vials <= 0) {
      return <Badge variant="destructive" className="shadow-sm">Full</Badge>
    }
    if (peptide.remaining_vials < 10) {
      return (
        <Badge className="bg-accent text-accent-foreground shadow-sm">
          Low ({peptide.remaining_vials} left)
        </Badge>
      )
    }
    return <Badge className="bg-primary text-primary-foreground shadow-sm">Available</Badge>
  }

  const isDisabled = !canAddToCart || peptide.remaining_vials <= 0 || isAddingToCart

  return (
    <Card className="overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200 bg-gradient-to-br from-card to-primary/[0.01]">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg mb-1 truncate">{peptide.peptide.name}</h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {peptide.peptide.strength && (
                <span className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  {peptide.peptide.strength}
                </span>
              )}
              {peptide.peptide.vendor && (
                <span>• {peptide.peptide.vendor}</span>
              )}
            </div>
          </div>
          {getAvailabilityBadge()}
        </div>

        {/* Category */}
        {peptide.peptide.category && (
          <Badge variant="outline" className="text-xs">
            {peptide.peptide.category}
          </Badge>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-muted-foreground text-xs mb-1">Price/Vial</p>
            <p className="font-bold text-primary">{formatCurrency(peptide.price_per_vial)}</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-muted-foreground text-xs mb-1">Available</p>
            <p className="font-bold">{peptide.remaining_vials} vials</p>
          </div>
        </div>

        {/* Box Info */}
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{peptide.box_vial_min} vials/box</span>
          <span>{peptide.boxes_available} boxes</span>
          <span>{peptide.vials_filled}/{peptide.total_vials} filled</span>
        </div>

        {/* Quantity Controls */}
        {canAddToCart && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 shrink-0"
                onClick={() => setQuantity(Math.max(0, quantity - 1))}
                disabled={quantity <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="0"
                max={peptide.remaining_vials}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, Math.min(peptide.remaining_vials, parseInt(e.target.value) || 0)))}
                className="text-center h-9"
              />
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 shrink-0"
                onClick={() => setQuantity(Math.min(peptide.remaining_vials, quantity + 1))}
                disabled={quantity >= peptide.remaining_vials}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={isDisabled || quantity <= 0}
            >
              {quantity > 0 ? `Add ${quantity} to Cart` : 'Add to Cart'}
            </Button>
          </div>
        )}

        {/* View Details Modal */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-center gap-2 hover:bg-primary/5 border border-primary/10 group"
            >
              <Info className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium text-sm">View Full Details</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {peptide.peptide.name}
              </DialogTitle>
              {peptide.peptide.strength && (
                <DialogDescription className="text-base">
                  {peptide.peptide.strength}
                </DialogDescription>
              )}
            </DialogHeader>

            <div className="space-y-6 pt-4">
              {/* Vendor & Category Tags */}
              <div className="flex flex-wrap gap-2">
                {peptide.peptide.vendor && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {peptide.peptide.vendor}
                  </Badge>
                )}
                {peptide.peptide.category && (
                  <Badge variant="outline">
                    {peptide.peptide.category}
                  </Badge>
                )}
              </div>

              {/* Description */}
              {peptide.peptide.description && (
                <div className="space-y-2">
                  <h4 className="text-base font-semibold flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Description
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {peptide.peptide.description}
                  </p>
                </div>
              )}

              {/* Mechanism */}
              {peptide.peptide.mechanism && (
                <div className="space-y-2">
                  <h4 className="text-base font-semibold flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-primary" />
                    Mechanism of Action
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {peptide.peptide.mechanism}
                  </p>
                </div>
              )}

              {/* Technical Details */}
              <div className="grid grid-cols-2 gap-4">
                {peptide.peptide.half_life && (
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Half Life</p>
                    </div>
                    <p className="text-base font-bold">{peptide.peptide.half_life}</p>
                  </div>
                )}

                {peptide.peptide.storage && (
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-4 w-4 text-primary" />
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Storage</p>
                    </div>
                    <p className="text-base font-bold">{peptide.peptide.storage}</p>
                  </div>
                )}
              </div>

              {/* Benefits */}
              {peptide.peptide.benefits && Array.isArray(peptide.peptide.benefits) && (peptide.peptide.benefits as string[]).length > 0 && (
                <div className="space-y-3 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <h4 className="text-base font-semibold flex items-center gap-2">
                    <Pill className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Benefits
                  </h4>
                  <ul className="space-y-2">
                    {(peptide.peptide.benefits as string[]).map((benefit, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-3">
                        <span className="text-emerald-600 dark:text-emerald-400 text-lg leading-none">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Side Effects */}
              {peptide.peptide.side_effects && Array.isArray(peptide.peptide.side_effects) && (peptide.peptide.side_effects as string[]).length > 0 && (
                <div className="space-y-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <h4 className="text-base font-semibold flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    Possible Side Effects
                  </h4>
                  <ul className="space-y-2">
                    {(peptide.peptide.side_effects as string[]).map((effect, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-3">
                        <span className="text-amber-600 dark:text-amber-400">⚠</span>
                        <span>{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contraindications */}
              {peptide.peptide.contraindications && Array.isArray(peptide.peptide.contraindications) && (peptide.peptide.contraindications as string[]).length > 0 && (
                <div className="space-y-3 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                  <h4 className="text-base font-semibold flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    Contraindications
                  </h4>
                  <ul className="space-y-2">
                    {(peptide.peptide.contraindications as string[]).map((contra, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-3">
                        <span className="text-red-600 dark:text-red-400">✕</span>
                        <span>{contra}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dosing */}
              {peptide.peptide.dosing && (
                <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="text-base font-semibold flex items-center gap-2">
                    <Pill className="h-5 w-5 text-primary" />
                    Dosing Information
                  </h4>
                {typeof peptide.peptide.dosing === 'string' ? (
                  <p className="text-sm text-muted-foreground">{peptide.peptide.dosing}</p>
                ) : Array.isArray(peptide.peptide.dosing) ? (
                  <ul className="space-y-1">
                    {(peptide.peptide.dosing as string[]).map((dose, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{dose}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-1">
                    {Object.entries(peptide.peptide.dosing as Record<string, any>).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium capitalize">{key.replace(/_/g, ' ')}: </span>
                        <span className="text-muted-foreground">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

              {/* Stacking */}
              {peptide.peptide.stacking && (
                <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="text-base font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Stacking Information
                  </h4>
                {typeof peptide.peptide.stacking === 'string' ? (
                  <p className="text-sm text-muted-foreground">{peptide.peptide.stacking}</p>
                ) : Array.isArray(peptide.peptide.stacking) ? (
                  <ul className="space-y-1">
                    {(peptide.peptide.stacking as string[]).map((stack, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{stack}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )}

              {/* Specifications */}
              {peptide.peptide.specifications && typeof peptide.peptide.specifications === 'object' && (
                <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="text-base font-semibold flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-primary" />
                    Technical Specifications
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(peptide.peptide.specifications as Record<string, any>).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 text-sm border-b border-border/30 last:border-0">
                        <span className="text-muted-foreground capitalize font-medium">{key.replace(/_/g, ' ')}</span>
                        <span className="font-semibold">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
})
