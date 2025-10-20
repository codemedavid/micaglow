# FAQ Anchor Links Guide

## Overview
Each FAQ item now has a unique anchor link that allows you to send direct links to specific questions. When someone clicks the link, the page will:
1. ✅ Auto-scroll to the FAQ
2. ✅ Auto-expand the answer
3. ✅ Highlight the FAQ for 3 seconds with a colored ring

## How to Get a Link to a Specific FAQ

### Method 1: Hover & Copy (Recommended)
1. Go to the FAQ page
2. Hover over any FAQ question
3. Click the **link icon** that appears on the right side
4. The link is automatically copied to your clipboard
5. You'll see a "Copied!" confirmation

### Method 2: Manual Construction
The URL format is:
```
https://yourdomain.com/faq#[slug-of-question]
```

The slug is created by:
- Converting the question to lowercase
- Replacing spaces and special characters with hyphens
- Removing consecutive hyphens

## Example Links

### General Questions
- **What are peptides?**
  ```
  /faq#what-are-peptides-and-how-are-they-used-in-research
  ```

- **Minimum order?**
  ```
  /faq#do-you-have-a-minimum-order
  ```

### Ordering and Shipping
- **Individual buy minimum**
  ```
  /faq#what-is-the-individual-buy-minimum-order
  ```

- **Delivery timeframe**
  ```
  /faq#how-long-does-delivery-take
  ```

- **Customs issues**
  ```
  /faq#what-if-my-package-is-held-by-customs
  ```

### Payment
- **Payment methods**
  ```
  /faq#how-do-i-place-an-order-step-3-make-payment
  ```

- **Payment deadline**
  ```
  /faq#when-is-payment-due
  ```

### Product Information
- **BAC water requirement**
  ```
  /faq#is-bacteriostatic-water-bac-water-included
  ```

- **Shelf life**
  ```
  /faq#what-is-the-peptide-shelf-life
  ```

- **COA availability**
  ```
  /faq#do-you-have-a-coa-certificate-of-analysis
  ```

### Dosing
- **Semaglutide dosing**
  ```
  /faq#how-should-i-dose-semaglutide-for-weight-loss-research
  ```

- **BPC-157 dosing**
  ```
  /faq#what-is-the-typical-dosing-schedule-for-bpc-157-in-tissue-repair-studies
  ```

## Use Cases

### Customer Support
When answering customer questions via WhatsApp or email:
```
"Great question! Here's the info about our shipping costs:
https://yourdomain.com/faq#what-is-the-standard-international-shipping-fee"
```

### Social Media Posts
```
"📦 Wondering about delivery times?
Check out our FAQ: https://yourdomain.com/faq#how-long-does-delivery-take"
```

### Quick Reference
Save commonly asked questions as bookmarks:
- Shipping costs
- Payment methods
- Minimum orders
- Dosing guidelines

## Features

### Visual Feedback
- **Highlight Effect**: FAQ glows with a primary-colored ring for 3 seconds
- **Auto-Open**: The answer automatically expands
- **Smooth Scroll**: Animated scrolling to the FAQ
- **Copy Confirmation**: Shows "Copied!" when you copy a link

### Mobile Friendly
- Works perfectly on mobile devices
- Touch-friendly hover states
- Responsive highlighting

### SEO Benefits
- Each FAQ is now individually linkable
- Better for sharing on social media
- Improves user experience

## Technical Details

### Slug Generation
Questions are converted to URL-safe slugs automatically:
```
"What is the peptide shelf life?" → "what-is-the-peptide-shelf-life"
"How do I place an order? (Step 1: Collect Orders)" → "how-do-i-place-an-order-step-1-collect-orders"
```

### Browser Support
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Fallback for older browsers (link still works, just no smooth animation)

### Performance
- Lightweight implementation
- No external dependencies
- Optimized for fast page loads

## Tips for Best Use

1. **Test Links**: Always test the link before sending to customers
2. **Keep URLs Short**: Share the full FAQ page for general questions
3. **Mobile Share**: Links work great when shared via WhatsApp, Telegram, etc.
4. **Update Bookmarks**: If you change FAQ questions, the slugs might change

## Support

If a customer reports an anchor link not working:
1. Verify the URL is correct
2. Try clearing their browser cache
3. Check if the FAQ question text was recently changed
4. Send them the direct FAQ page link as fallback

