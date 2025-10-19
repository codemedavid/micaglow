'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOrder } from '@/hooks/use-orders'
import { useAuth } from '@/hooks/use-auth'
import { buildWhatsAppLink, getWhatsAppMessage } from '@/lib/whatsapp'
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
import { MessageCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface OrderConfirmPageProps {
  params: Promise<{ orderId: string }>
}

export default function OrderConfirmPage({ params }: OrderConfirmPageProps) {
  const { orderId } = use(params)
  const router = useRouter()
  const { data: order, isLoading } = useOrder(orderId)
  const { profile } = useAuth()

  useEffect(() => {
    // Automatically redirect to WhatsApp after a short delay
    if (order && profile) {
      const whatsappData = {
        id: order.id,
        batch_name: order.batch.name,
        batch_id: order.batch_id,
        user_whatsapp: profile.whatsapp_e164 || '',
        items: order.items.map((item) => ({
          name: item.batch_peptide.peptide.name,
          quantity: item.quantity,
          price: item.price_per_vial,
        })),
        total: order.total,
        shipping_name: order.shipping_name || undefined,
        shipping_address: order.shipping_address || undefined,
        shipping_phone: order.shipping_phone || undefined,
        delivery_method: order.delivery_method || undefined,
      }

      const link = buildWhatsAppLink(whatsappData)
      
      // Auto-redirect after 3 seconds
      const timeout = setTimeout(() => {
        window.location.href = link
      }, 3000)

      return () => clearTimeout(timeout)
    }
  }, [order, profile])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading order...</p>
      </div>
    )
  }

  if (!order || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Order not found</p>
          <Link href="/orders">
            <Button>View Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  const whatsappData = {
    id: order.id,
    batch_name: order.batch.name,
    batch_id: order.batch_id,
    user_whatsapp: profile.whatsapp_e164 || '',
    items: order.items.map((item) => ({
      name: item.batch_peptide.peptide.name,
      quantity: item.quantity,
      price: item.price_per_vial,
    })),
    total: order.total,
    shipping_name: order.shipping_name || undefined,
    shipping_address: order.shipping_address || undefined,
    shipping_phone: order.shipping_phone || undefined,
    delivery_method: order.delivery_method || undefined,
  }

  const whatsappLink = buildWhatsAppLink(whatsappData)
  const message = getWhatsAppMessage(whatsappData)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-primary/20 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Order Placed Successfully!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Order ID: <span className="font-mono">{order.id.slice(0, 8)}...</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Peptide</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.batch_peptide.peptide.name}</TableCell>
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
                  <TableCell colSpan={3} className="text-right font-semibold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(order.total)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <h3 className="font-semibold mb-3 text-primary">📌 Important: Order Locked, Payment Later</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">What happens now:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2 mt-1">
                  <li>Your order is <strong className="text-foreground">locked in</strong> - vials reserved for you</li>
                  <li>Send this order to admin via WhatsApp (button below)</li>
                  <li>Admin will confirm your order is received</li>
                </ol>
              </div>
              
              <div>
                <p className="font-medium">When to pay:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2 mt-1">
                  <li>Wait for batch to enter <strong className="text-foreground">PAYMENT phase</strong></li>
                  <li>This happens when <strong className="text-foreground">all peptides are fully filled</strong></li>
                  <li>Admin will send payment instructions via WhatsApp</li>
                  <li>You&apos;ll have time to complete payment</li>
                </ul>
              </div>

              <div className="bg-accent/20 p-2 rounded mt-2">
                <p className="text-xs text-center">
                  💡 No payment needed yet! Just lock in your order and wait for PAYMENT phase.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={() => (window.location.href = whatsappLink)}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Send Order via WhatsApp
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Redirecting automatically in 3 seconds...
            </p>
          </div>

          <div className="text-center">
            <Link href="/orders">
              <Button variant="ghost">View All Orders</Button>
            </Link>
          </div>

          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground mb-2">
              Preview WhatsApp Message
            </summary>
            <pre className="bg-muted p-3 rounded text-xs whitespace-pre-wrap">
              {message}
            </pre>
          </details>
        </CardContent>
      </Card>
    </div>
  )
}

