# 💾 BRISCO Order Backup System

## Overview
This system automatically backs up every order locally to protect against Stripe outages or data loss. Every order is stored in multiple formats for maximum redundancy.

## 🎯 What Gets Backed Up

### Order Creation (Checkout)
When a customer starts checkout, we immediately backup:
- Customer email and contact info
- Items in cart (with sizes, colors, quantities)
- Pricing calculations (including bulk discounts)
- Shipping preferences
- Timestamp and session ID
- User agent and IP address (for fraud protection)

### Payment Confirmation (Webhook)
When payment succeeds, we update the backup with:
- Complete customer details (name, phone)
- Full shipping address
- Payment confirmation details
- Stripe receipt URL
- Line item details from Stripe
- Payment status and timestamps

## 📁 File Structure

```
order-backups/
├── orders.json                 # Master file with all orders
├── daily/
│   ├── orders-2024-01-15.json # Daily backup files
│   ├── orders-2024-01-16.json
│   └── ...
└── README.md                   # This file
```

## 🔍 How to Access Orders

### 1. Admin Dashboard (Recommended)
Visit: `https://www.brisclothing.com/admin/orders`

Features:
- View today's orders
- Search by customer email/name
- View all orders
- Business statistics
- Mobile-friendly interface

### 2. API Access
Direct API calls to `/api/orders-viewer`:

```javascript
// Get today's orders
fetch('/api/orders-viewer?action=today')

// Get all orders
fetch('/api/orders-viewer?action=all')

// Search orders
fetch('/api/orders-viewer?action=search&search=john@email.com')

// Get orders by date
fetch('/api/orders-viewer?action=date&date=2024-01-15')

// Get statistics
fetch('/api/orders-viewer?action=stats')
```

### 3. Direct File Access
If APIs are down, orders are stored as JSON files:
- `order-backups/orders.json` - All orders
- `order-backups/daily/orders-YYYY-MM-DD.json` - Daily files

## 📊 Order Data Format

Each backed up order contains:

```json
{
  "sessionId": "cs_1234567890",
  "internalOrderId": "BRISCO-1642234567890-ABC123DEF",
  "customerEmail": "customer@email.com",
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "items": [
    {
      "name": "BRISCO Black Tee",
      "size": "L",
      "quantity": 2,
      "productId": "brisco-black-tee"
    }
  ],
  "totalQuantity": 2,
  "subtotal": 110.00,
  "shippingCost": 5.00,
  "totalAmount": 115.00,
  "originalPrice": "130",
  "effectivePrice": "55",
  "totalSavings": "20",
  "shippingMethod": "standard",
  "shippingAddress": "123 Main St, Los Angeles, CA 90210",
  "orderStatus": "paid",
  "fulfillmentStatus": "ready_to_ship",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "paymentTimestamp": "2024-01-15T10:31:15.000Z",
  "stripeReceiptUrl": "https://pay.stripe.com/receipts/...",
  "notes": ""
}
```

## 🚨 Emergency Access

### If Stripe is Down
1. Go to `/admin/orders` to see all backed up orders
2. Orders are automatically saved before Stripe processing
3. You have customer info even if Stripe fails

### If Website is Down
1. Access server files directly
2. Orders are in `order-backups/orders.json`
3. Daily files provide additional redundancy

### If Everything is Down
1. Daily backup files are created automatically
2. Each day's orders are in separate files
3. Files can be opened with any text editor

## 🔧 Technical Details

### Backup Triggers
- **Checkout Creation**: Immediate backup when session starts
- **Payment Success**: Update with complete customer data
- **Daily**: Automatic daily file creation

### Error Handling
- Backup failures never block checkout process
- Errors are logged but don't affect customer experience
- Multiple backup locations ensure redundancy

### Performance
- Backups are asynchronous (don't slow down checkout)
- File operations are optimized for speed
- Daily files prevent single large file issues

## 📈 Business Benefits

### For Khalil
- Never lose an order, even if Stripe goes down
- Complete customer information always available
- Easy search and filtering of orders
- Business analytics and statistics
- Mobile access from anywhere

### For Customers
- Backup system is invisible to customers
- No impact on checkout speed or experience
- Additional data protection for their orders

## 🛠️ Maintenance

### Regular Tasks
- Monitor backup file sizes (should grow with orders)
- Check daily files are being created
- Verify API endpoints are working

### Monthly Tasks
- Archive old daily files if needed
- Check disk space usage
- Review backup system logs

### Emergency Procedures
- If backup system fails, orders still process normally
- Stripe data remains the primary source
- Backup system can be rebuilt from Stripe data

## 🔐 Security

### Data Protection
- Backup files contain same data as Stripe
- No additional sensitive data stored
- Files are server-side only (not publicly accessible)

### Access Control
- Admin dashboard requires direct URL access
- API endpoints have basic rate limiting
- No authentication required (internal system)

## 📞 Support

### For Technical Issues
- Check console logs for backup errors
- Verify file permissions on backup directory
- Test API endpoints individually

### For Business Questions
- Use admin dashboard for order management
- Export data as needed for accounting
- Search functionality for customer service

---

## 🎯 Quick Reference

**View Orders:** `https://www.brisclothing.com/admin/orders`
**API Endpoint:** `/api/orders-viewer`
**Backup Files:** `order-backups/orders.json`
**Daily Files:** `order-backups/daily/orders-YYYY-MM-DD.json`

**Remember:** This backup system ensures you never lose order data, even in worst-case scenarios. It's your safety net for business continuity!
