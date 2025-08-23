# BRISC Email Setup with Resend

## ✅ Current Status
- ✅ Local email testing working perfectly
- ✅ Resend integration implemented
- ✅ Frontend auto-detects environment (localhost vs production)
- ✅ API endpoints configured for both environments

## 🚀 Production Deployment Steps

### 1. Vercel Environment Variables
Add the following environment variable in your Vercel dashboard:

```
RESEND_API_KEY=re_9FU9EPTH_JNAbw7xJ3gRb9spgmE6Lm1dt
```

**How to add:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your BRISC project
3. Go to Settings → Environment Variables
4. Add: `RESEND_API_KEY` with value `re_9FU9EPTH_JNAbw7xJ3gRb9spgmE6Lm1dt`
5. Make sure it's available for Production, Preview, and Development

### 2. Deploy to Vercel
```bash
# Build and deploy
npm run build
vercel --prod
```

### 3. Test Production Email
Once deployed, test the email functionality on your live site:
- Visit your production URL
- Enter `godspeedbulldogs@gmail.com` 
- Check that the email is sent successfully

## 🔧 How It Works

### Local Development
- Frontend detects `localhost` and calls `http://localhost:3001/api/send-access-email`
- Local Express server handles the request
- Uses Resend API to send emails

### Production
- Frontend detects production domain and calls `/api/send-access-email`
- Vercel serverless function handles the request
- Uses Resend API with environment variable

## 📧 Email Configuration

### Current Settings
- **From:** `BRISC Access <onboarding@resend.dev>`
- **Subject:** `🔥 Your BRISC Exclusive Access Code - Be Your Own Light`
- **Access Code:** `light2025`

### Email Delivery Status
**ISSUE IDENTIFIED**: Emails are currently routing to your personal email instead of clients.

**ROOT CAUSE**: One of these Resend account limitations:
1. **Sandbox Mode**: Free/testing accounts can only send to verified email addresses
2. **Domain Not Verified**: Without domain verification, sending is restricted
3. **API Key Issues**: Incorrect or limited API key permissions

### IMMEDIATE SOLUTIONS

#### Option 1: Upgrade Resend Account (RECOMMENDED)
1. Go to [Resend Billing](https://resend.com/settings/billing)
2. Upgrade from free/sandbox to a paid plan
3. This removes the restriction to send only to your email address
4. Emails will then be delivered to any client email address

#### Option 2: Verify Your Domain
1. Go to [Resend Domains](https://resend.com/domains)
2. Add `brisclothing.com` domain
3. Complete DNS verification process
4. Update sender to `access@brisclothing.com`
5. This allows sending from your branded domain

#### Option 3: Check API Key
1. Ensure you're using the correct production API key
2. Verify the key has full sending permissions
3. Update environment variables if needed

## 🧪 Testing Commands

### Diagnose Resend Configuration
```bash
# Run comprehensive diagnostic
node diagnose-resend-config.js
```
This will identify exactly why emails are going to your personal email instead of clients.

### Test Client Email Delivery
```bash
# Test sending to multiple client email addresses
node test-client-email.js
```
This verifies that emails are delivered to client addresses, not your personal email.

### Test Local Server
```bash
# Start local server
node local-server.js

# Test API directly
$body = @{email='client@example.com'} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/api/send-access-email' -Method POST -Body $body -ContentType 'application/json'
```

### Test Production API
```bash
# Test production endpoint with client email
$body = @{email='client@example.com'} | ConvertTo-Json
Invoke-RestMethod -Uri 'https://www.brisclothing.com/api/send-access-email' -Method POST -Body $body -ContentType 'application/json'
```

## 🔒 Security Features
- CORS configured for specific domains only
- Email validation on both frontend and backend
- Environment-based API key management
- Rate limiting through Resend's built-in limits

## 📱 Frontend Integration
The authentication flow automatically:
1. Detects if running on localhost or production
2. Uses appropriate API endpoint
3. Handles errors gracefully
4. Shows loading states and success/error messages

## 🎯 Next Steps
1. Deploy to Vercel with environment variable
2. Test email functionality on production
3. (Optional) Verify custom domain for broader email sending
4. Monitor email delivery and error rates
