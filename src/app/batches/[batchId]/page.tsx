'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useBatch, useBatchPeptides } from '@/hooks/use-batches'
import { useCart } from '@/hooks/use-cart'
import { PeptidesTable } from '@/components/peptides-table'
import { BatchesHeader } from '@/components/batches-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BATCH_STATUS_LABELS } from '@/lib/constants'
import { ArrowLeft, ShoppingCart, TrendingUp } from 'lucide-react'

interface BatchDetailPageProps {
  params: Promise<{ batchId: string }>
}

export default function BatchDetailPage({ params }: BatchDetailPageProps) {
  const { batchId } = use(params)
  const router = useRouter()
  
  // Fetch batch and peptides in parallel (optimized)
  const { data: batch, isLoading: isBatchLoading } = useBatch(batchId)
  const { data: peptides, isLoading: isPeptidesLoading } = useBatchPeptides(batchId)
  
  // Only fetch cart when batch data is loaded (optimization)
  const { data: cart, addToCart, isAdding } = useCart(batchId, !!batch)

  if (isBatchLoading || isPeptidesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="text-muted-foreground">Loading batch details...</p>
        </div>
      </div>
    )
  }

  if (!batch || !peptides) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Batch not found</p>
          <Link href="/batches">
            <Button>Back to Batches</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Memoize calculations (optimization)
  const totalVials = peptides.reduce((sum, p) => sum + p.total_vials, 0)
  const vialsFilled = peptides.reduce((sum, p) => sum + p.vials_filled, 0)
  const fillPercentage = totalVials > 0 ? (vialsFilled / totalVials) * 100 : 0

  const statusColor = {
    DRAFT: 'bg-muted text-muted-foreground',
    OPEN: 'bg-primary text-primary-foreground',
    FILLING: 'bg-secondary text-secondary-foreground',
    LOCKED: 'bg-accent text-accent-foreground',
    PAYMENT: 'bg-primary text-primary-foreground',
    CLOSED: 'bg-muted text-muted-foreground',
  }[batch.status]

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9ff] via-white to-white">
      {/* Header with Navigation */}
      <BatchesHeader />
      
      {/* Batch Info Bar */}
      <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6 py-4 max-w-[1200px]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/batches">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="shrink-0 hover:bg-primary/10 hover:text-primary rounded-full"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent truncate">
                  {batch.name}
                </h1>
                <Badge className={`${statusColor} mt-1 shadow-sm`}>
                  {BATCH_STATUS_LABELS[batch.status as keyof typeof BATCH_STATUS_LABELS]}
                </Badge>
              </div>
            </div>
            <Button 
              onClick={() => router.push(`/cart?batchId=${batchId}`)} 
              className="shrink-0 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 rounded-full"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary-foreground/20 text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8 md:py-12 space-y-8 max-w-[1200px]">
        {/* Progress Card */}
        <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-card via-card to-primary/[0.02] shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <CardHeader className="relative">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              Batch Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Overall Fill Progress</span>
                <span className="font-bold text-foreground">
                  {vialsFilled} / {totalVials} vials
                </span>
              </div>
              <div className="space-y-2">
                <Progress value={fillPercentage} className="h-3" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {fillPercentage.toFixed(1)}% Complete
                  </span>
                  {fillPercentage >= 100 && (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      🎉 Fully Filled!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peptides Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-1 rounded-full bg-gradient-to-b from-primary to-secondary" />
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Available Peptides</h2>
              <p className="text-sm text-muted-foreground">Browse and add items to your cart</p>
            </div>
          </div>
          <PeptidesTable
            peptides={peptides}
            onAddToCart={(batchPeptideId, quantity) => addToCart({ batchPeptideId, quantity })}
            isAddingToCart={isAdding}
            batchStatus={batch.status}
          />
        </div>

        {/* Status Messages */}
        {batch.status === 'OPEN' && (
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 shadow-lg">
            <CardContent className="pt-6">
              <p className="text-sm text-center font-semibold text-blue-700 dark:text-blue-400">
                ℹ️ Batch is OPEN - View only
              </p>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Orders will be accepted once status changes to FILLING
              </p>
            </CardContent>
          </Card>
        )}
        
        {batch.status === 'LOCKED' && (
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20 shadow-lg">
            <CardContent className="pt-6">
              <p className="text-sm text-center font-semibold text-amber-700 dark:text-amber-400">
                🔒 Batch is LOCKED
              </p>
              <p className="text-xs text-center text-muted-foreground mt-2">
                No new orders accepted. Admin is reviewing totals.
              </p>
            </CardContent>
          </Card>
        )}
        
        {batch.status === 'PAYMENT' && (
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 shadow-lg">
            <CardContent className="pt-6">
              <p className="text-sm text-center font-semibold text-emerald-700 dark:text-emerald-400">
                💳 PAYMENT PHASE - All peptides filled!
              </p>
              <p className="text-xs text-center text-muted-foreground mt-2">
                If you have a pending order, admin will send payment instructions via WhatsApp
              </p>
            </CardContent>
          </Card>
        )}
        
        {batch.status === 'CLOSED' && (
          <Card className="bg-gradient-to-br from-muted to-muted/50 border-border shadow-lg">
            <CardContent className="pt-6">
              <p className="text-sm text-center font-medium text-muted-foreground">
                This batch is closed. Check other batches for ordering.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

