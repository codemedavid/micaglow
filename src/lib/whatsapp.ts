interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface OrderData {
  id: string
  batch_name: string
  batch_id: string
  user_whatsapp: string
  items: OrderItem[]
  total: number
  shipping_name?: string
  shipping_address?: string
  shipping_phone?: string
  delivery_method?: string
}

/**
 * Build a WhatsApp deep link with prefilled message
 */
export function buildWhatsAppLink(order: OrderData): string {
  const adminNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '639154901224'
  
  const messageParts = [
    `Hello! I'd like to LOCK IN an order for Batch ${order.batch_name}`,
    ' -------------------------------- ',
    ' -------------------------------- ',
    
    `WhatsApp: ${order.user_whatsapp}`,
    `Order ID: ${order.id}`,
    ' -------------------------------- ',
    ' -------------------------------- ',
    'Items:',
    ...order.items.map(
      (item) =>
        `- ${item.name} x ${item.quantity} vials @ ₱${item.price} = ₱${item.quantity * item.price}`
    ),
    '',
    `Total: ₱${order.total}`,
  ]

  // Add shipping information if available
  if (order.shipping_name || order.shipping_address || order.shipping_phone || order.delivery_method) {
    messageParts.push(
      ' -------------------------------- ',
      ' -------------------------------- ',
      'SHIPPING DETAILS:',
      order.shipping_name ? `Name: ${order.shipping_name}` : '',
      order.shipping_address ? `Address: ${order.shipping_address}` : '',
      order.shipping_phone ? `Phone: ${order.shipping_phone}` : '',
      order.delivery_method ? `Delivery: ${order.delivery_method}` : ''
    )
  }

  messageParts.push(
    ' -------------------------------- ',
    ' -------------------------------- ',
    'NO PAYMENT YET - Just confirming my order',
    'I will wait for PAYMENT phase and your payment instructions.'
  )

  const message = messageParts.filter(line => line !== '').join('\n')

  return `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`
}

/**
 * Extract WhatsApp message text for logging
 */
export function getWhatsAppMessage(order: OrderData): string {
  const messageParts = [
    `Hello! I'd like to LOCK IN an order for Batch ${order.batch_name}`,
    '',
    `WhatsApp: ${order.user_whatsapp}`,
    `Order ID: ${order.id}`,
    '',
    'Items:',
    ...order.items.map(
      (item) =>
        `- ${item.name} x ${item.quantity} vials @ ₱${item.price} = ₱${item.quantity * item.price}`
    ),
    '',
    `Total: ₱${order.total}`,
  ]

  // Add shipping information if available
  if (order.shipping_name || order.shipping_address || order.shipping_phone || order.delivery_method) {
    messageParts.push(
      '',
      '📦 SHIPPING DETAILS:',
      order.shipping_name ? `Name: ${order.shipping_name}` : '',
      order.shipping_address ? `Address: ${order.shipping_address}` : '',
      order.shipping_phone ? `Phone: ${order.shipping_phone}` : '',
      order.delivery_method ? `Delivery: ${order.delivery_method}` : ''
    )
  }

  messageParts.push(
    '',
    '⚠️ NO PAYMENT YET - Just confirming my order',
    'I will wait for PAYMENT phase and your payment instructions.'
  )

  return messageParts.filter(line => line !== '').join('\n')
}

/**
 * Build admin-to-customer WhatsApp link for payment phase
 */
export interface AdminOrderData {
  customer_whatsapp: string
  order_id: string
  batch_name: string
  items: OrderItem[]
  subtotal: number
  shipping_fee: number
}

export function buildAdminWhatsAppLink(order: AdminOrderData): string {
  const total = order.subtotal + order.shipping_fee
  
  const message = [
    `Hello! Your order for Batch ${order.batch_name} is ready for payment.`,
    '',
    `Order ID: ${order.order_id}`,
    '',
    'Items:',
    ...order.items.map(
      (item) =>
        `- ${item.name} x ${item.quantity} vials @ ₱${item.price} = ₱${item.quantity * item.price}`
    ),
    '',
    `Subtotal: ₱${order.subtotal.toFixed(2)}`,
    `Shipping Fee: ₱${order.shipping_fee.toFixed(2)}`,
    `Total Amount Due: ₱${total.toFixed(2)}`,
    '',
    '📱 Payment Instructions:',
    'Please send payment via GCash/Bank Transfer and reply with proof of payment.',
    '',
    'Thank you! 😊',
  ].join('\n')

  // Remove '+' from whatsapp number if it exists
  const cleanNumber = order.customer_whatsapp.replace('+', '')
  
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
}

