'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, MessageSquare, Loader2, Users, Package, Eye } from 'lucide-react'
import { getAllBatches } from '@/lib/api/admin'
import { getOrdersByBatch, updateOrderStatus, type AdminOrder } from '@/lib/api/admin'
import { buildAdminWhatsAppLink } from '@/lib/whatsapp'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/format'
import { AdminOrderInvoiceDialog } from '@/components/admin-order-invoice-dialog'

const SHIPPING_FEE = 500

const statusColors = {
  PENDING: 'bg-[#FDBA37] text-foreground hover:bg-[#FDBA37]',
  CONFIRMED: 'bg-primary text-white hover:bg-primary',
  PAID: 'bg-[#3CCB7F] text-white hover:bg-[#3CCB7F]',
  SHIPPED: 'bg-secondary text-secondary-foreground hover:bg-secondary',
  COMPLETED: 'bg-muted text-foreground hover:bg-muted',
  CANCELLED: 'bg-destructive text-white hover:bg-destructive',
}

export default function AdminOrdersPage() {
  const [selectedBatchId, setSelectedBatchId] = useState<string>('')
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Get all batches
  const { data: batches = [], isLoading: batchesLoading } = useQuery({
    queryKey: ['admin', 'batches'],
    queryFn: getAllBatches,
  })

  // Get orders for selected batch
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin', 'orders', selectedBatchId],
    queryFn: () => getOrdersByBatch(selectedBatchId),
    enabled: !!selectedBatchId,
  })

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: AdminOrder['status'] }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders', selectedBatchId] })
      toast({
        title: 'Status updated',
        description: 'Order status has been updated successfully.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const selectedBatch = batches.find((b) => b.id === selectedBatchId)

  const handleSendWhatsApp = (order: AdminOrder) => {
    if (!order.profile.whatsapp_e164) {
      toast({
        title: 'Error',
        description: 'Customer WhatsApp number not found',
        variant: 'destructive',
      })
      return
    }

    const whatsappLink = buildAdminWhatsAppLink({
      customer_whatsapp: order.profile.whatsapp_e164,
      order_id: order.id,
      batch_name: selectedBatch?.name || 'Unknown Batch',
      items: order.items.map((item) => ({
        name: `${item.batch_peptide.peptide.name} ${item.batch_peptide.peptide.strength || ''}`.trim(),
        quantity: item.quantity,
        price: item.price_per_vial,
      })),
      subtotal: order.total,
      shipping_fee: SHIPPING_FEE,
    })

    window.open(whatsappLink, '_blank')
  }

  const getTotalWithShipping = (orderTotal: number) => orderTotal + SHIPPING_FEE

  const handleViewDetails = (order: AdminOrder) => {
    setSelectedOrder(order)
    setInvoiceDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9ff] via-white to-white">
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 max-w-[1400px]">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">Orders Management</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Track and manage customer orders
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-[1400px] space-y-6">
        {/* Batch Selection */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Select Batch</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose a batch to view and manage its orders
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {batchesLoading ? (
              <div className="flex items-center justify-center py-8 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : batches.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-muted/50 mx-auto flex items-center justify-center">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No batches found</p>
              </div>
            ) : (
              <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                <SelectTrigger className="h-12 rounded-xl text-base">
                  <SelectValue placeholder="Select a batch to view orders" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      <div className="flex items-center gap-3 py-1">
                        <span className="font-medium">{batch.name}</span>
                        <Badge className="rounded-full text-xs">{batch.status}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        {/* Orders Table */}
        {selectedBatchId && (
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">
                      Orders for {selectedBatch?.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Manage order statuses and send payment requests
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="rounded-full px-4 py-2 w-fit">
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-muted/50 mx-auto flex items-center justify-center">
                    <Users className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-foreground">No orders yet</p>
                    <p className="text-sm text-muted-foreground">
                      Orders will appear here once customers start placing them
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead>Shipping</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-xs">
                            {order.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {order.shipping_name ? (
                                <div>
                                  <p className="text-sm font-medium">{order.shipping_name}</p>
                                  {order.profile.whatsapp_e164 && (
                                    <p className="text-xs text-muted-foreground">
                                      {order.profile.whatsapp_e164}
                                    </p>
                                  )}
                                </div>
                              ) : order.profile.whatsapp_e164 ? (
                                <span className="text-sm font-medium">
                                  {order.profile.whatsapp_e164}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">No info</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {order.items.map((item) => (
                                <div key={item.id} className="text-xs">
                                  {item.batch_peptide.peptide.name}{' '}
                                  {item.batch_peptide.peptide.strength} x{item.quantity}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(order.total)}</TableCell>
                          <TableCell>{formatCurrency(SHIPPING_FEE)}</TableCell>
                          <TableCell className="font-bold">
                            {formatCurrency(getTotalWithShipping(order.total))}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) =>
                                updateStatusMutation.mutate({
                                  orderId: order.id,
                                  status: value as AdminOrder['status'],
                                })
                              }
                              disabled={updateStatusMutation.isPending}
                            >
                              <SelectTrigger className="w-[140px] rounded-full border-0">
                                <SelectValue>
                                  <Badge className={`${statusColors[order.status]} rounded-full`}>
                                    {order.status}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">
                                  <Badge className={`${statusColors.PENDING} rounded-full`}>PENDING</Badge>
                                </SelectItem>
                                <SelectItem value="CONFIRMED">
                                  <Badge className={`${statusColors.CONFIRMED} rounded-full`}>CONFIRMED</Badge>
                                </SelectItem>
                                <SelectItem value="PAID">
                                  <Badge className={`${statusColors.PAID} rounded-full`}>PAID</Badge>
                                </SelectItem>
                                <SelectItem value="SHIPPED">
                                  <Badge className={`${statusColors.SHIPPED} rounded-full`}>SHIPPED</Badge>
                                </SelectItem>
                                <SelectItem value="COMPLETED">
                                  <Badge className={`${statusColors.COMPLETED} rounded-full`}>COMPLETED</Badge>
                                </SelectItem>
                                <SelectItem value="CANCELLED">
                                  <Badge className={`${statusColors.CANCELLED} rounded-full`}>CANCELLED</Badge>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                onClick={() => handleViewDetails(order)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full bg-[#3CCB7F]/10 border-[#3CCB7F]/30 hover:bg-[#3CCB7F]/20"
                                onClick={() => handleSendWhatsApp(order)}
                                disabled={!order.profile.whatsapp_e164}
                              >
                                <MessageSquare className="h-4 w-4 mr-2 text-[#3CCB7F]" />
                                <span className="text-[#3CCB7F] font-medium">Pay</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-border/50">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">📝</span>
                </div>
                <p className="font-bold text-lg">How to use:</p>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-10">
                <li>Select a batch from the dropdown above</li>
                <li>View all orders, customer info, and shipping details</li>
                <li>Click &quot;View&quot; to see full order invoice with shipping information</li>
                <li>Click &quot;Pay&quot; to send prefilled WhatsApp payment request</li>
                <li>Update order status as customers confirm/pay</li>
                <li>Fixed shipping fee of ₱500 is automatically added to all orders</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Order Invoice Dialog */}
      <AdminOrderInvoiceDialog
        order={selectedOrder}
        batchName={selectedBatch?.name || 'Unknown Batch'}
        shippingFee={SHIPPING_FEE}
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
      />
    </div>
  )
}
