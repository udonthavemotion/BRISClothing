# BRISCO Order Fulfillment Guide

## Overview
This guide explains how to manage orders after customers complete their Stripe checkout. As a new business owner, this will help you understand the entire process from payment to delivery.

## 📧 Order Notifications

### What You'll Receive
When a customer completes a purchase, you'll get:

1. **Stripe Email Receipt** - Sent to your Stripe account email
   - Contains customer details, items purchased, and payment amount
   - Includes shipping address provided by customer
   - Shows order ID for tracking

2. **Stripe Dashboard Notification** - Available at https://dashboard.stripe.com
   - Real-time payment confirmations
   - Customer information and order details
   - Payment status and transaction fees

### Order Information Included
- Customer name and email
- Shipping address
- Items purchased (with sizes and colors)
- Quantity of each item
- Total amount paid (including shipping)
- Unique order ID

## 📦 Fulfillment Process

### Step 1: Review the Order
1. Log into your Stripe dashboard
2. Go to "Payments" section
3. Find the recent payment
4. Click to view full order details
5. Note the customer's shipping address and item details

### Step 2: Prepare the Items
- **White BRISCO Tees**: Check inventory for requested sizes
- **Black BRISCO Tees**: Check inventory for requested sizes
- Ensure items are in good condition
- Package items securely to prevent damage during shipping

### Step 3: Shipping Options
Based on what customer selected:

**Standard Shipping ($5.00)**
- USPS Ground Advantage or similar
- 3-7 business days delivery
- Tracking number provided

**Express Shipping ($12.00)**
- USPS Priority Mail or UPS 2-Day
- 1-3 business days delivery
- Tracking number provided

### Step 4: Create Shipping Label
1. Use your preferred shipping service (USPS, UPS, FedEx)
2. Enter customer's address exactly as shown in Stripe
3. Select appropriate shipping speed based on what they paid for
4. Print shipping label and tracking number

### Step 5: Send Tracking Information
**Option A: Manual Email**
```
Subject: Your BRISCO Order is On Its Way! 🔥

Hi [Customer Name],

Thank you for your order! Your BRISCO items are now on their way to you.

Order Details:
- Items: [List items and sizes]
- Tracking Number: [Tracking Number]
- Estimated Delivery: [Date Range]

Track your package: [Tracking URL]

Be Your Own Light,
The BRISCO Team
```

**Option B: Stripe Integration** (Advanced)
- Use Stripe's order update features
- Automatically send tracking info through Stripe

## 💰 Financial Management

### Understanding Your Revenue
- **Gross Revenue**: Total amount customer paid
- **Stripe Fees**: ~2.9% + 30¢ per transaction
- **Net Revenue**: What you actually receive

### Example Calculation
Customer pays $170 for 3 shirts + shipping:
- Gross: $170.00
- Stripe Fee: ~$5.23
- Net to You: ~$164.77

### Payout Schedule
- Stripe pays out to your bank account
- Default: Every 2 business days
- Can be changed in Stripe settings

## 📊 Inventory Management

### Track Your Stock
- **White Tees**: [Your current inventory by size]
- **Black Tees**: [Your current inventory by size]

### Reorder Points
- Set minimum stock levels (e.g., 5 per size)
- Reorder when inventory gets low
- Consider seasonal demand patterns

### Size Distribution Tracking
Monitor which sizes sell most to optimize future orders:
- Small: ___% of sales
- Medium: ___% of sales  
- Large: ___% of sales
- XL: ___% of sales

## 🚨 Common Issues & Solutions

### Customer Didn't Receive Order
1. Check tracking number status
2. Contact shipping carrier
3. If lost, offer replacement or refund
4. Use Stripe's dispute resolution tools

### Wrong Size Shipped
1. Apologize immediately
2. Send prepaid return label
3. Ship correct size priority
4. Consider partial refund for inconvenience

### Customer Wants to Cancel
- **Before Shipping**: Full refund through Stripe
- **After Shipping**: Return policy applies
- Be generous with customer service for brand reputation

### Payment Disputes/Chargebacks
1. Respond quickly in Stripe dashboard
2. Provide tracking info and delivery confirmation
3. Include photos of items if available
4. Stripe will help mediate the dispute

## 📈 Growing Your Business

### Customer Communication
- Send thank you emails
- Ask for reviews/testimonials
- Share on social media (with permission)
- Build email list for future launches

### Analytics to Track
- Best-selling sizes and colors
- Average order value
- Customer acquisition cost
- Return/exchange rates
- Seasonal trends

### Scaling Considerations
- **Inventory Management Software**: When you hit 50+ orders/month
- **Fulfillment Services**: When shipping becomes overwhelming
- **Customer Service Tools**: For handling inquiries efficiently

## 🔧 Technical Setup

### Stripe Dashboard Access
- URL: https://dashboard.stripe.com
- Use your account credentials
- Enable email notifications for new payments

### Webhook Monitoring
- Your site automatically receives order confirmations
- Check `/api/stripe-webhook` logs if needed
- Contact your developer for technical issues

### Test Mode vs Live Mode
- **Test Mode**: For practice (uses fake money)
- **Live Mode**: Real customer payments
- Make sure you're in Live Mode for real orders!

## 📞 Support Contacts

### For Technical Issues
- Your Developer: [Your contact info]
- Stripe Support: https://support.stripe.com

### For Business Questions
- SCORE Mentors: https://www.score.org
- Small Business Administration: https://www.sba.gov

---

## Quick Reference Checklist

**For Each New Order:**
- [ ] Check Stripe dashboard for order details
- [ ] Verify inventory availability
- [ ] Package items securely
- [ ] Create shipping label with tracking
- [ ] Send tracking info to customer
- [ ] Update inventory records
- [ ] Monitor delivery status

**Weekly Tasks:**
- [ ] Review sales analytics
- [ ] Check inventory levels
- [ ] Reconcile Stripe payouts
- [ ] Follow up on any shipping issues

**Monthly Tasks:**
- [ ] Analyze best-selling items
- [ ] Plan inventory reorders
- [ ] Review customer feedback
- [ ] Update pricing if needed

---

*Remember: Great customer service builds loyal customers who become brand ambassadors. Always prioritize the customer experience!*
