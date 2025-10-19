import { memo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatDateShort } from '@/lib/format'
import { BATCH_STATUS_LABELS } from '@/lib/constants'
import type { BatchWithStats } from '@/lib/api/batches'
import { TrendingUp, Calendar, ArrowRight } from 'lucide-react'

interface BatchCardProps {
  batch: BatchWithStats
}

export const BatchCard = memo(function BatchCard({ batch }: BatchCardProps) {
  const statusColor = {
    DRAFT: 'bg-muted text-muted-foreground',
    OPEN: 'bg-primary text-primary-foreground',
    FILLING: 'bg-secondary text-secondary-foreground',
    LOCKED: 'bg-accent text-accent-foreground',
    PAYMENT: 'bg-emerald-500 text-white',
    CLOSED: 'bg-muted text-muted-foreground',
  }[batch.status]

  const isActive = ['OPEN', 'FILLING'].includes(batch.status)

  return (
    <Link href={`/batches/${batch.id}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 border-primary/10 bg-gradient-to-br from-card via-card to-primary/[0.02] group-hover:border-primary/30 relative">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-secondary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Shine effect on hover */}
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <CardHeader className="relative pb-3">
          <div className="flex items-start justify-between gap-3 mb-2">
            <CardTitle className="text-lg font-bold leading-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text flex-1">
              {batch.name}
            </CardTitle>
            <Badge className={`${statusColor} shadow-sm font-semibold shrink-0`}>
              {BATCH_STATUS_LABELS[batch.status as keyof typeof BATCH_STATUS_LABELS]}
            </Badge>
          </div>
          {isActive && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Active batch
            </div>
          )}
        </CardHeader>
        
        <CardContent className="relative space-y-4">
          {/* Progress Section */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/[0.08] to-primary/[0.03] border border-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-md bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Fill Progress
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-muted-foreground">
                  {batch.vials_filled} / {batch.total_vials} vials
                </span>
                <span className="text-lg font-bold text-primary">
                  {batch.fill_percentage.toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary via-primary to-secondary transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(batch.fill_percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Closing Date */}
          {batch.closes_at && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium">Closes on</p>
                <p className="text-sm font-semibold truncate">{formatDateShort(batch.closes_at)}</p>
              </div>
            </div>
          )}

          {/* View Details Arrow */}
          <div className="flex items-center justify-end gap-2 text-primary text-sm font-semibold pt-2 group-hover:gap-3 transition-all duration-300">
            <span>View Details</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
})

