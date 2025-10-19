'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { useCheckout } from '@/hooks/use-orders'
import { useBatch } from '@/hooks/use-batches'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/format'
import { ArrowLeft, Minus, Plus, Trash2, Package } from 'lucide-react'
import { Suspense } from 'react'
import { ShippingInfoForm, type ShippingInfo } from '@/components/shipping-info-form'

function CartPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const batchId = searchParams.get('batchId')
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null)

  const { data: batch } = useBatch(batchId || '')
  const { data: cart, updateCartItem, removeCartItem, isUpdating, isRemoving } = useCart(batchId || '')
  const { mutate: checkout, isPending: isCheckingOut } = useCheckout(batchId || '')

  if (!batchId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No batch selected</p>
          <Link href="/batches">
            <Button>Browse Batches</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
      <header className="border-b border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/batches/${batchId}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Pick peptides from the batch to fill remaining vials. When all vials are filled
                  across the batch, payment will open for everyone.
                </p>
                <Link href={`/batches/${batchId}`}>
                  <Button>Browse Peptides</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const canCheckout = batch?.status === 'FILLING'

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href={`/batches/${batchId}`}>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl font-bold truncate">Shopping Cart</h1>
              {batch && <p className="text-xs md:text-sm text-muted-foreground truncate">{batch.name}</p>}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Peptide</TableHead>
                        <TableHead>Strength</TableHead>
                        <TableHead className="text-right">Price/Vial</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.items.map((item) => {
                        const subtotal = item.quantity * item.batch_peptide.price_per_vial
                        
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.batch_peptide.peptide.name}
                            </TableCell>
                            <TableCell>{item.batch_peptide.peptide.strength || '-'}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.batch_peptide.price_per_vial)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateCartItem({ itemId: item.id, quantity: item.quantity - 1 })}
                                  disabled={isUpdating}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center">{item.quantity}</span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateCartItem({ itemId: item.id, quantity: item.quantity + 1 })}
                                  disabled={isUpdating}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(subtotal)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeCartItem(item.id)}
                                disabled={isRemoving}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {cart.items.map((item) => {
                    const subtotal = item.quantity * item.batch_peptide.price_per_vial
                    
                    return (
                      <div key={item.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-base">
                              {item.batch_peptide.peptide.name}
                            </h3>
                            {item.batch_peptide.peptide.strength && (
                              <p className="text-sm text-muted-foreground">
                                {item.batch_peptide.peptide.strength}
                              </p>
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => removeCartItem(item.id)}
                            disabled={isRemoving}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Price per vial</span>
                          <span className="font-medium">{formatCurrency(item.batch_peptide.price_per_vial)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Quantity</span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateCartItem({ itemId: item.id, quantity: item.quantity - 1 })}
                              disabled={isUpdating}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateCartItem({ itemId: item.id, quantity: item.quantity + 1 })}
                              disabled={isUpdating}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="pt-3 border-t flex items-center justify-between">
                          <span className="font-medium">Subtotal</span>
                          <span className="font-bold text-lg">{formatCurrency(subtotal)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items</span>
                    <span>{cart.items.reduce((sum, item) => sum + item.quantity, 0)} vials</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(cart.total)}</span>
                  </div>
                </div>

                {canCheckout ? (
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <p className="text-sm text-center font-medium">
                      ℹ️ Locking your order - Payment comes later
                    </p>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      You&apos;ll send order details to admin now, but payment instructions will come once all peptides are filled and batch enters PAYMENT phase.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-center text-muted-foreground">
                    This batch isn&apos;t accepting orders yet. Check back when status is FILLING.
                  </p>
                )}
              </CardContent>
            </Card>

            {shippingInfo ? (
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                      <Package className="h-5 w-5 flex-shrink-0" />
                      <span>Shipping Details</span>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="self-start sm:self-auto"
                      onClick={() => setShippingInfo(null)}
                      disabled={isCheckingOut}
                    >
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">Name</p>
                      <p className="font-medium text-sm md:text-base break-words">{shippingInfo.shipping_name}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">Address</p>
                      <p className="font-medium text-sm md:text-base break-words leading-relaxed">{shippingInfo.shipping_address}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">Phone</p>
                      <p className="font-medium text-sm md:text-base">{shippingInfo.shipping_phone}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">Delivery Method</p>
                      <div className="inline-flex items-center gap-2">
                        <p className="font-medium text-sm md:text-base">
                          {shippingInfo.delivery_method === 'J&T' ? 'J&T Express' : shippingInfo.delivery_method}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {shippingInfo.delivery_method === 'Lalamove' && '(Same-day)'}
                          {shippingInfo.delivery_method === 'LBC' && '(2-3 days)'}
                          {shippingInfo.delivery_method === 'J&T' && '(2-5 days)'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => checkout(shippingInfo)}
                    disabled={!canCheckout || isCheckingOut}
                  >
                    {isCheckingOut ? 'Processing...' : 'Lock In My Order'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              canCheckout && (
                <ShippingInfoForm
                  onSubmit={setShippingInfo}
                  isSubmitting={isCheckingOut}
                />
              )
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function CartPage() {
  return (
    <Suspense fallback={<div>Loading cart...</div>}>
      <CartPageContent />
    </Suspense>
  )
}

