# Payment Workflow - Two-Phase System

## 🎯 Overview

Mama Mica uses a **two-phase order system** to ensure all peptides are filled before collecting payment.

## 📊 The Two Phases

### Phase 1: ORDER LOCKING (During FILLING Status)
**What customers do:**
- Browse batch and add peptides to cart
- Click "Lock In My Order" (checkout)
- Send order details to admin via WhatsApp
- **NO PAYMENT YET** ⚠️

**What happens:**
- Order created with status: PENDING
- Vials reserved for the customer
- WhatsApp message sent to admin
- Order tracked in system

### Phase 2: PAYMENT (When All Peptides Filled)
**What triggers this:**
- ALL peptides reach 100% fill capacity
- Admin changes batch status to PAYMENT
- System notifies all customers with PENDING orders

**What customers do:**
- Receive payment instructions via WhatsApp from admin
- Complete payment
- Admin marks order as VERIFIED

## 🔄 Complete Workflow

### Customer Journey

```
1. FILLING Phase
   ├─ Browse batch
   ├─ Add peptides to cart
   ├─ Click "Lock In My Order"
   ├─ Send order via WhatsApp to admin
   └─ Status: Order PENDING ⏳

2. Waiting Phase
   ├─ Order locked in ✅
   ├─ Vials reserved ✅
   ├─ Watch batch fill progress
   └─ Wait for PAYMENT phase

3. PAYMENT Phase (All peptides filled)
   ├─ Admin sends payment instructions via WhatsApp
   ├─ Customer pays
   ├─ Admin verifies payment
   └─ Status: Order VERIFIED ✅

4. CLOSED Phase
   └─ Order complete! 🎉
```

### Admin Journey

```
1. Batch Setup
   ├─ Create batch (status: DRAFT)
   ├─ Add peptides with pricing
   └─ Change status to FILLING

2. FILLING Phase
   ├─ Customers lock in orders
   ├─ Vials_filled increases
   ├─ Monitor fill progress
   └─ Wait for 100% capacity

3. All Filled! 🎉
   ├─ System shows alert: "Ready for PAYMENT"
   ├─ Admin changes status to PAYMENT
   └─ Time to collect payment!

4. PAYMENT Phase
   ├─ Send payment instructions to all PENDING orders via WhatsApp
   ├─ Customers pay
   ├─ Mark each order as VERIFIED
   └─ Change batch to CLOSED when done
```

## 💬 WhatsApp Messages

### Customer Message (During Checkout)
```
Hello! I'd like to LOCK IN an order for Batch November 2024

WhatsApp: +639171234567
Order ID: abc123...

Items:
- BPC-157 x 5 vials @ ₱950 = ₱4750
- TB-500 x 3 vials @ ₱1200 = ₱3600

Total: ₱8350

⚠️ NO PAYMENT YET - Just confirming my order
I will wait for PAYMENT phase and your payment instructions.
```

### Admin Response (During PAYMENT Phase)
```
Hi! Your order for Batch November 2024 is ready for payment.

Order ID: abc123...
Total: ₱8,350

Payment Details:
[Bank details / GCash / payment method]

Please send payment proof once done.
Thank you! 🙏
```

## 🎯 Batch Status Guide

| Status | Customer Can | Admin Action | Payment Status |
|--------|-------------|--------------|----------------|
| **DRAFT** | Nothing | Setup batch | N/A |
| **OPEN** | View only | Add peptides | N/A |
| **FILLING** | 🔒 Lock orders | Monitor fill | **NO PAYMENT** |
| **LOCKED** | View only | Review totals | **NO PAYMENT** |
| **PAYMENT** | View orders | 💳 Collect payment | **PAYMENT TIME!** |
| **CLOSED** | View only | Done! | Complete |

## ✨ Key Points

### For Customers

✅ **FILLING Phase:**
- Lock in your order (reserve vials)
- Send order confirmation to admin
- **NO PAYMENT YET**

⏳ **Waiting:**
- Your vials are reserved
- Wait for batch to fill completely
- You'll be notified when PAYMENT opens

💳 **PAYMENT Phase:**
- Admin sends payment instructions
- Pay within deadline
- Admin verifies payment
- Order complete!

### For Admin

✅ **FILLING Phase:**
- Accept and lock customer orders
- Monitor fill progress
- Each checkout increases vials_filled

🎉 **All Filled:**
- System shows "Ready for PAYMENT" alert
- Click button to change to PAYMENT
- Or manually change status

💳 **PAYMENT Phase:**
- Message all PENDING order customers
- Send payment details
- Collect payments
- Mark orders as VERIFIED
- Close batch when done

## 🔐 Why This System?

**Protects Everyone:**

1. **Customers don't overpay**
   - Only pay when ALL peptides available
   - No partial orders
   - Fair for everyone

2. **Admin gets full orders**
   - All peptides must fill before payment
   - No partial batches
   - Efficient bulk ordering

3. **Transparent Process**
   - Clear what phase you're in
   - Know when to pay
   - No confusion

## 💡 Best Practices

### For Customers

1. **Lock orders early** during FILLING
   - Best selection available
   - Secure your vials

2. **Monitor batch progress**
   - Check fill percentage
   - See when approaching PAYMENT

3. **Be ready to pay**
   - When PAYMENT phase starts
   - Respond to admin quickly

### For Admin

1. **Set realistic timelines**
   - Give customers time to order
   - Set closes_at date

2. **Monitor fill progress**
   - Check batch editor regularly
   - See which peptides need more orders

3. **Communication**
   - Message customers about PAYMENT phase
   - Send clear payment instructions
   - Set payment deadline

4. **Verification**
   - Mark orders as VERIFIED after payment
   - Keep WhatsApp confirmations
   - Update order status promptly

## 📱 UI Indicators

### Customer View

**Batch Detail Page:**
- FILLING: Can add to cart ✅
- PAYMENT: See "Payment phase active" message
- Progress bar shows overall fill

**Cart Page:**
- Button: "Lock In My Order" (not "Pay Now")
- Info box: "Payment comes later"

**Order Confirmation:**
- Clear explanation of two phases
- WhatsApp button to send confirmation
- No payment fields

**Order History:**
- PENDING: "Locked in, waiting for PAYMENT phase"
- VERIFIED: "Payment confirmed!"

### Admin View

**Batch Editor:**
- Fill progress percentage
- Alert when 100% filled → "Ready for PAYMENT"
- Quick button to change to PAYMENT
- Status helper text for each phase

## 🚀 Summary

**Two-Phase System:**
1. **FILLING** → Lock orders (no payment)
2. **PAYMENT** → Collect payment (when all filled)

**Benefits:**
- ✅ Fair for customers (only pay when complete)
- ✅ Efficient for admin (bulk everything)
- ✅ Clear expectations (know when to pay)
- ✅ No confusion (explicit messaging)

**Result:**
- Happy customers 😊
- Smooth operations 📦
- No partial orders ✅
- Everyone wins! 🎉

