# Admin Order Management System

## Overview

The admin order management system allows administrators to efficiently manage customer orders across different batches with integrated WhatsApp communication and status tracking.

## Features

### 1. **Batch Selection**
- View all batches (including drafts)
- Select a batch to view all orders for that batch
- See batch name and status

### 2. **Order Listing**
- View all orders for the selected batch in a table format
- See customer WhatsApp numbers
- View order items with quantities
- See subtotal, shipping fee, and total amount

### 3. **WhatsApp Integration**
- Click "Send Payment" button to send prefilled WhatsApp message to customer
- Message automatically includes:
  - Batch name
  - Order ID
  - All ordered items with quantities and prices
  - Subtotal
  - Shipping fee (₱500)
  - Total amount due
  - Payment instructions
- Opens WhatsApp Web/App in new tab

### 4. **Order Status Management**
- Update order status with dropdown selector
- Available statuses:
  - **PENDING** - Order placed, awaiting confirmation
  - **CONFIRMED** - Order confirmed by admin
  - **PAID** - Customer has paid
  - **SHIPPED** - Order has been shipped
  - **COMPLETED** - Order completed
  - **CANCELLED** - Order cancelled
- Status updates are instant and reflected in the database

## Setup Instructions

### 1. Database Migration

Run the migration SQL to update order statuses:

```sql
-- Execute this in Supabase SQL Editor
\i update-order-statuses.sql
```

Or copy-paste the contents of `update-order-statuses.sql` into your Supabase SQL Editor.

### 2. Access the Admin Panel

Navigate to: `/admin/orders`

### 3. Workflow

1. **Select Batch**: Choose a batch from the dropdown
2. **Review Orders**: See all orders and customer details
3. **Send Payment Request**: Click "Send Payment" to contact customer via WhatsApp
4. **Update Status**: Change order status as customers progress through payment
5. **Track Progress**: Monitor all orders in one place

## Order Status Workflow

```
PENDING → CONFIRMED → PAID → SHIPPED → COMPLETED
                ↓
            CANCELLED
```

### Typical Flow:

1. Customer places order → **PENDING**
2. Admin reviews and confirms order → **CONFIRMED**
3. Admin sends WhatsApp payment request → Customer pays
4. Admin verifies payment → **PAID**
5. Admin ships order → **SHIPPED**
6. Customer receives order → **COMPLETED**

## Shipping Fee

- Fixed shipping fee of **₱500** is automatically added to all orders
- Displayed separately in the order table
- Included in WhatsApp payment message

## WhatsApp Message Format

When you click "Send Payment", the customer receives:

```
Hello! Your order for Batch [Batch Name] is ready for payment.

Order ID: [Order ID]

Items:
- [Peptide Name] [Strength] x [Quantity] vials @ ₱[Price] = ₱[Subtotal]
- ...

Subtotal: ₱[Subtotal]
Shipping Fee: ₱500.00
Total Amount Due: ₱[Total]

📱 Payment Instructions:
Please send payment via GCash/Bank Transfer and reply with proof of payment.

Thank you! 😊
```

## Technical Details

### API Functions

**Get Orders by Batch**:
```typescript
getOrdersByBatch(batchId: string): Promise<AdminOrder[]>
```

**Update Order Status**:
```typescript
updateOrderStatus(
  orderId: string,
  status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED'
): Promise<void>
```

### WhatsApp Integration

**Build Admin WhatsApp Link**:
```typescript
buildAdminWhatsAppLink(order: AdminOrderData): string
```

Generates a WhatsApp deep link with prefilled message including all order details and shipping fee.

## Security

- Only admins can access the order management page
- Protected by middleware authentication
- Row Level Security (RLS) policies ensure data isolation
- All updates are logged and tracked

## Tips

1. **Batch Orders Together**: Process all orders for a batch at once when moving to PAYMENT phase
2. **Use WhatsApp Templates**: Click "Send Payment" to ensure consistent messaging
3. **Update Status Promptly**: Keep statuses up-to-date for better tracking
4. **Double-Check Payments**: Verify payment proof before marking as PAID
5. **Track Shipping**: Update to SHIPPED when order is dispatched

## Troubleshooting

### Customer has no WhatsApp number
- "Send Payment" button will be disabled
- Contact customer through alternative means
- Update their profile with WhatsApp number

### Can't update order status
- Check if you have admin role
- Verify database connection
- Check browser console for errors

### WhatsApp link doesn't open
- Ensure WhatsApp is installed or WhatsApp Web is accessible
- Check if WhatsApp number format is correct (E.164 format)
- Verify browser popup settings

## Future Enhancements

Potential features to add:
- Bulk status updates
- Export orders to CSV
- Payment tracking integration
- Automated WhatsApp messages
- Order analytics and reporting
- SMS fallback for non-WhatsApp users

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify Supabase connection
3. Ensure migration was run successfully
4. Check admin role assignment

