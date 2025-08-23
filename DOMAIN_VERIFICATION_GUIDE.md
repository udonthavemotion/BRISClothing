# BRISC Email Domain Verification Guide

## ✅ Current Status
- ✅ Code deployed to Vercel with improved error handling
- ✅ Email API updated to support verified domains
- ⚠️ Domain verification pending (currently in testing mode)

## 🚨 IMMEDIATE ISSUE
The Resend account is currently in **Sandbox Mode**, which only allows sending emails to verified addresses (`godspeedbulldogs@gmail.com`). To send emails to ANY address (including your client's email), you need to:

1. **Complete domain verification** 
2. **Upgrade Resend account to Production Mode**

## 📋 Required DNS Records for Domain Verification

Based on the Resend API response, you need to add these DNS records to your domain:

### For `www.brisclothing.com`:

1. **MX Record:**
   - **Name:** `send.www`
   - **Type:** `MX`
   - **Value:** `feedback-smtp.us-east-1.amazonses.com`
   - **Priority:** `10`
   - **TTL:** `60`

2. **SPF Record:**
   - **Name:** `send.www`
   - **Type:** `TXT`
   - **Value:** `v=spf1 include:amazonses.com ~all`
   - **TTL:** `60`

3. **DKIM Record:**
   - **Name:** `resend._domainkey.www`
   - **Type:** `TXT`
   - **Value:** `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9SpWV7n3LjLJuvTMGlAE7pzXggvFKOoN6EGNdeVcbLTWfC5p7d2MRiea19UOZWFN2pRMvwfuUtS29AcJ06gWpxpCkFZhKjxGVAQzt+kMEHUZTAFlI8vt+d7lzxl+M4xaAxBU3txC5kc9mrasNNUs4HssyzQMI vXxFI/LrCYpaFwIDAQAB`
   - **TTL:** `Auto`

## 🔧 How to Add DNS Records in Vercel

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your BRISC project

2. **Navigate to Domains:**
   - Go to Settings → Domains
   - Find your `brisclothing.com` domain

3. **Add DNS Records:**
   - Click on the domain to manage DNS
   - Add each of the three records above
   - Make sure the values match exactly

## 🚀 Alternative: Use Root Domain Instead

If you're having issues with `www.brisclothing.com`, consider using the root domain `brisclothing.com`:

1. **In Resend Dashboard:**
   - Go to [resend.com/domains](https://resend.com/domains)
   - Remove `www.brisclothing.com`
   - Add `brisclothing.com` instead

2. **Get new DNS records for the root domain**
3. **Update the API code** to use `brisclothing.com`

## 📧 Upgrade to Production Mode

After domain verification:

1. **Contact Resend Support:**
   - Email: support@resend.com
   - Request: "Please upgrade my account to Production Mode"
   - Mention: "I have verified my domain and need to send emails to any address"

2. **Or check account settings:**
   - Login to Resend dashboard
   - Look for "Account Mode" or "Production Mode" settings
   - Some accounts upgrade automatically after domain verification

## 🧪 Testing the Fix

Once domain is verified and account is in production mode:

1. **Test with your client's email:**
   ```bash
   curl -X POST https://brisco-gn4q2a8m8-logan-folses-projects.vercel.app/api/send-access-email \
     -H "Content-Type: application/json" \
     -d '{"email":"client@example.com"}'
   ```

2. **Check the response:**
   - Success: `{"success": true, "messageId": "..."}`
   - Error: Will show specific reason (domain not verified, sandbox mode, etc.)

## 🔍 Current Error Messages

The updated API now provides clear error messages:

- **Sandbox Mode:** "Email service is currently in testing mode. Please contact support to enable sending to all email addresses."
- **Domain Not Verified:** "Email service is being configured. Domain verification in progress."
- **Invalid Email:** "Please enter a valid email address"

## 📱 What Your Client Will See

**Before Fix (Current):**
- Client enters email → Gets error message about email service configuration

**After Fix:**
- Client enters email → Receives access code email immediately
- Works with ANY valid email address

## ⏰ Timeline

1. **Add DNS records:** 5-10 minutes
2. **DNS propagation:** 1-24 hours
3. **Resend verification:** Automatic after propagation
4. **Production mode upgrade:** Immediate to 24 hours

## 🆘 If You Need Immediate Help

**Temporary workaround:** You can manually send the access code to your client:
- Access Code: `light2025`
- Website: `https://brisclothing.com`
- Instructions: Enter the code on the website to access the collection

## 📞 Support Contacts

- **Resend Support:** support@resend.com
- **Vercel Support:** Through dashboard or support@vercel.com

---

**Next Steps:**
1. Add the DNS records above to your domain
2. Wait for verification (check Resend dashboard)
3. Request production mode upgrade if needed
4. Test with client's email address

The code is already deployed and ready - it just needs the domain verification to be completed!
