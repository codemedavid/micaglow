'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/format'
import { Package, MapPin, Phone, Truck, User, Calendar, Printer } from 'lucide-react'
import type { AdminOrder } from '@/lib/api/admin'

interface AdminOrderInvoiceDialogProps {
  order: AdminOrder | null
  batchName: string
  shippingFee: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusColors = {
  PENDING: 'bg-[#FDBA37] text-foreground',
  CONFIRMED: 'bg-primary text-white',
  PAID: 'bg-[#3CCB7F] text-white',
  SHIPPED: 'bg-secondary text-secondary-foreground',
  COMPLETED: 'bg-muted text-foreground',
  CANCELLED: 'bg-destructive text-white',
}

export function AdminOrderInvoiceDialog({
  order,
  batchName,
  shippingFee,
  open,
  onOpenChange,
}: AdminOrderInvoiceDialogProps) {
  if (!order) return null

  const totalWithShipping = order.total + shippingFee
  const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-black">Order Invoice</DialogTitle>
            <Button variant="outline" size="sm" onClick={handlePrint} className="rounded-full">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 print:text-black">
          {/* Order Header */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-xl space-y-3 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                <p className="font-mono font-bold text-xl mt-1">{order.id}</p>
              </div>
              <Badge className={`${statusColors[order.status]} rounded-full text-base px-5 py-2 shadow-sm`}>
                {order.status}
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Batch
                </p>
                <p className="font-medium">{batchName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Order Date
                </p>
                <p className="font-medium">{orderDate}</p>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Information */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="border border-border/50 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Customer Information</h3>
              </div>
              <div className="space-y-2">
                {order.profile.whatsapp_e164 && (
                  <div>
                    <p className="text-sm text-muted-foreground">WhatsApp</p>
                    <p className="font-medium">{order.profile.whatsapp_e164}</p>
                  </div>
                )}
                {order.shipping_name && (
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{order.shipping_name}</p>
                  </div>
                )}
                {!order.shipping_name && !order.profile.whatsapp_e164 && (
                  <p className="text-sm text-muted-foreground">No customer info available</p>
                )}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="border border-border/50 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3CCB7F]/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-[#3CCB7F]" />
                </div>
                <h3 className="font-bold text-lg">Shipping Information</h3>
              </div>
              {order.shipping_address || order.shipping_phone || order.delivery_method ? (
                <div className="space-y-2">
                  {order.shipping_address && (
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Address
                      </p>
                      <p className="font-medium">{order.shipping_address}</p>
                    </div>
                  )}
                  {order.shipping_phone && (
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Contact Phone
                      </p>
                      <p className="font-medium">{order.shipping_phone}</p>
                    </div>
                  )}
                  {order.delivery_method && (
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Method</p>
                      <Badge variant="outline" className="mt-1">
                        {order.delivery_method}
                      </Badge>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No shipping information available</p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="border border-border/50 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-6 py-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Order Items</h3>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price/Vial</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => {
                  const itemSubtotal = item.quantity * item.price_per_vial
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.batch_peptide.peptide.name}</p>
                          {item.batch_peptide.peptide.strength && (
                            <p className="text-sm text-muted-foreground">
                              {item.batch_peptide.peptide.strength}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.price_per_vial)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(itemSubtotal)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Order Summary */}
          <div className="border border-border/50 rounded-xl p-6 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-sm">
            <h3 className="font-bold text-xl mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping Fee</span>
                <span className="font-medium">{formatCurrency(shippingFee)}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between text-xl font-black">
                <span>Total Amount</span>
                <span className="text-primary text-2xl">{formatCurrency(totalWithShipping)}</span>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {order.whatsapp_message && (
            <div className="border border-border/50 rounded-xl p-5 bg-muted/20 shadow-sm">
              <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                <span className="text-lg">💬</span>
                Original WhatsApp Message
              </h3>
              <pre className="text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {order.whatsapp_message}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

