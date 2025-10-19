export function BatchLoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Featured Badge Skeleton */}
      <div className="text-center space-y-4">
        <div className="inline-block h-9 w-64 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full animate-pulse" />
        <div className="h-4 w-96 mx-auto bg-muted/50 rounded animate-pulse" />
      </div>
      
      {/* Batch Card Skeleton */}
      <div className="relative">
        {/* Decorative background glow */}
        <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-3xl blur-2xl -z-10" />
        
        <div className="overflow-hidden rounded-xl border border-primary/10 bg-gradient-to-br from-card via-card to-primary/[0.02]">
          {/* Header */}
          <div className="p-6 pb-3">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="h-7 w-64 bg-muted/50 rounded animate-pulse" />
              <div className="h-7 w-20 bg-primary/20 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
              <div className="h-4 w-24 bg-muted/30 rounded animate-pulse" />
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 pt-0 space-y-4">
            {/* Progress Section */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/[0.08] to-primary/[0.03] border border-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md bg-primary/20 animate-pulse" />
                <div className="h-4 w-28 bg-muted/30 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <div className="h-5 w-32 bg-muted/40 rounded animate-pulse" />
                  <div className="h-6 w-12 bg-primary/30 rounded animate-pulse" />
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-gradient-to-r from-primary/30 via-primary/20 to-secondary/30 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Closing Date */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
              <div className="w-4 h-4 rounded bg-muted/60 animate-pulse shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-3 w-16 bg-muted/40 rounded animate-pulse" />
                <div className="h-4 w-32 bg-muted/60 rounded animate-pulse" />
              </div>
            </div>

            {/* View Details */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <div className="h-5 w-24 bg-primary/20 rounded animate-pulse" />
              <div className="h-4 w-4 bg-primary/20 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

