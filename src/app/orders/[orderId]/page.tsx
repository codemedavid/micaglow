'use client'

import { use } from 'react'
import Link from 'next/link'
import { useOrder } from '@/hooks/use-orders'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/format'
import { ORDER_STATUS_LABELS } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = use(params)
  const { data: order, isLoading } = useOrder(orderId)

  const statusColor = {
    PENDING: 'bg-accent text-accent-foreground',
    VERIFIED: 'bg-primary text-primary-foreground',
    INVALID: 'bg-destructive text-destructive-foreground',
    CANCELLED: 'bg-muted text-muted-foreground',
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading order...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Order not found</p>
          <Link href="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/orders">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Order Details</h1>
              <p className="text-sm text-muted-foreground">
                Order ID: <span className="font-mono">{order.id}</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                className={`${statusColor[order.status as keyof typeof statusColor]} text-lg px-4 py-2`}
              >
                {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Batch</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.batch.name}</p>
              <Link href={`/batches/${order.batch_id}`}>
                <Button variant="link" className="px-0">
                  View Batch
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Date</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{formatDate(order.created_at)}</p>
            </CardContent>
          </Card>
        </div>

        {(order.shipping_name || order.shipping_address || order.shipping_phone || order.delivery_method) && (
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {order.shipping_name && (
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{order.shipping_name}</p>
                  </div>
                )}
                {order.shipping_address && (
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{order.shipping_address}</p>
                  </div>
                )}
                {order.shipping_phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Phone</p>
                    <p className="font-medium">{order.shipping_phone}</p>
                  </div>
                )}
                {order.delivery_method && (
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Method</p>
                    <p className="font-medium">{order.delivery_method}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Peptide</TableHead>
                  <TableHead>Strength</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price/Vial</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.batch_peptide.peptide.name}
                    </TableCell>
                    <TableCell>{item.batch_peptide.peptide.strength || '-'}</TableCell>
                    <TableCell>{item.batch_peptide.peptide.vendor || '-'}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.price_per_vial)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.quantity * item.price_per_vial)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5} className="text-right font-semibold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg">
                    {formatCurrency(order.total)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {order.status === 'PENDING' && (
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <p className="text-sm text-center font-medium">
                  ✅ Your order is locked in!
                </p>
                <p className="text-sm text-center text-muted-foreground">
                  You should have sent your order details to admin via WhatsApp. Your vials are reserved.
                </p>
                <div className="bg-accent/20 p-3 rounded-lg">
                  <p className="text-sm text-center font-medium">
                    💡 No payment needed yet!
                  </p>
                  <p className="text-xs text-center text-muted-foreground mt-1">
                    Wait for the batch to enter <strong>PAYMENT phase</strong> (when all peptides are filled).
                    Admin will send payment instructions via WhatsApp.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {order.status === 'VERIFIED' && (
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-center font-medium text-primary">
                ✅ Payment verified! Your order is complete.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

