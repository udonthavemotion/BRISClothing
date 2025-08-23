# BRISC Go High Level Email Integration

## 🚀 **Why Go High Level?**

**PROBLEM SOLVED**: No more email restrictions! Unlike Resend's sandbox mode that only sends to your personal email, GHL can send to **any client email address** immediately.

**Benefits:**
- ✅ Send to any email address (no sandbox restrictions)
- ✅ Use your agency domain (`zeromotionmarketing.com`)
- ✅ Full marketing automation capabilities
- ✅ Better deliverability and tracking
- ✅ No additional monthly costs (you already have GHL)

## 🛠️ **Setup Options**

### **Option 1: Webhook Automation (EASIEST - RECOMMENDED)**

#### Step 1: Create GHL Automation
1. Go to your GHL account → **Automations**
2. Create new automation: **"BRISC Access Email"**
3. Trigger: **Webhook**
4. Copy the webhook URL (you'll need this)

#### Step 2: Add Email Action
1. Add action: **Send Email**
2. **From**: `BRISC Access <access@zeromotionmarketing.com>`
3. **Subject**: `🔥 Your BRISC Exclusive Access Code - Be Your Own Light`
4. **Template**: Use the HTML template below
5. **To**: `{{webhook.email}}` (dynamic from webhook data)

#### Step 3: Configure Environment Variable
Add to your Vercel environment variables:
```
GHL_WEBHOOK_URL=https://hooks.gohighlevel.com/your-webhook-url-here
```

#### Step 4: Test
```bash
# Test the integration
node test-ghl-integration.js
```

### **Option 2: Direct API Integration**

#### Step 1: Get GHL API Key
1. Go to GHL → **Settings** → **Integrations** → **API**
2. Create new API key with email permissions
3. Copy the API key

#### Step 2: Configure Environment Variables
Add to your Vercel environment variables:
```
GHL_API_KEY=your-ghl-api-key-here
```

## 📧 **Email Template for GHL**

Use this HTML template in your GHL automation:

```html
<div style="max-width: 580px; margin: 0 auto; background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%); color: #ffffff; padding: 60px 30px; border: 1px solid #1a1a1a;">
  
  <div style="text-align: center; margin-bottom: 50px;">
    <img src="https://www.brisclothing.com/images/Product%20Assets/brevisidsg1.png" 
         alt="BRISC" 
         style="width: 120px; height: auto; margin-bottom: 25px;" />
    
    <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 15px 0; font-weight: 300; letter-spacing: 8px; text-transform: uppercase;">
      EXCLUSIVE
    </h1>
    <h2 style="color: #ffffff; font-size: 36px; margin: 0 0 20px 0; font-weight: 600; letter-spacing: 2px;">
      ACCESS GRANTED
    </h2>
  </div>
  
  <div style="text-align: center; margin-bottom: 50px;">
    <p style="color: #cccccc; font-size: 16px; line-height: 1.8; margin: 0; font-weight: 300;">
      You have been selected for exclusive access.<br>
      <span style="color: #ffffff; font-weight: 500; font-size: 18px;">Be Your Own Light.</span>
    </p>
  </div>
  
  <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%); border: 1px solid #333333; padding: 40px 30px; text-align: center; margin: 50px 0; border-radius: 2px;">
    <p style="color: #888888; font-size: 11px; margin: 0 0 25px 0; text-transform: uppercase; letter-spacing: 2px;">
      Access Code
    </p>
    <div style="font-size: 28px; font-weight: 600; color: #ffffff; letter-spacing: 6px; margin: 25px 0; font-family: 'Inter', monospace;">
      {{webhook.accessCode}}
    </div>
    <p style="color: #666666; font-size: 11px; margin: 25px 0 0 0; font-weight: 300;">
      Enter exactly as shown
    </p>
  </div>
  
  <div style="text-align: center; margin: 50px 0;">
    <a href="https://brisclothing.com?access=direct" 
       style="display: inline-block; background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%); color: #000000; padding: 18px 45px; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 2px; letter-spacing: 2px; text-transform: uppercase;">
      Enter Site
    </a>
  </div>
  
  <div style="text-align: center; margin-top: 60px; padding-top: 40px;">
    <p style="color: #555555; font-size: 11px; margin: 0 0 8px 0; font-weight: 300;">
      BRISC
    </p>
    <p style="color: #444444; font-size: 10px; margin: 0; font-weight: 300;">
      Born in Thibodaux • Built for Leaders • Worn by Legends
    </p>
    <p style="color: #333333; font-size: 9px; margin: 10px 0 0 0;">
      Sent via Zero Motion Marketing
    </p>
  </div>
  
</div>
```

## 🧪 **Testing**

### Test Webhook Integration
```bash
# Test webhook directly
curl -X POST "YOUR_GHL_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "accessCode": "light2025",
    "source": "brisc_website"
  }'
```

### Test Full Integration
```bash
# Test via your API
curl -X POST "https://www.brisclothing.com/api/send-access-email" \
  -H "Content-Type: application/json" \
  -d '{"email": "client@example.com"}'
```

## 🔧 **Webhook Data Structure**

Your GHL automation will receive this data:
```json
{
  "email": "client@example.com",
  "accessCode": "light2025",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "source": "brisc_website",
  "campaign": "access_code_delivery"
}
```

## 📊 **Migration Plan**

1. **Phase 1**: Set up GHL webhook automation
2. **Phase 2**: Add environment variable to Vercel
3. **Phase 3**: Test with a few client emails
4. **Phase 4**: Full deployment (GHL primary, Resend fallback)
5. **Phase 5**: Remove Resend dependency entirely

## 🎯 **Immediate Benefits**

- **No more sandbox restrictions** - emails go to clients immediately
- **Professional sender domain** - `access@zeromotionmarketing.com`
- **Better deliverability** - GHL has excellent email reputation
- **Marketing automation** - Can trigger follow-up sequences
- **Cost savings** - No need for paid Resend account

## 🚨 **Action Items**

1. **Set up GHL webhook automation** (15 minutes)
2. **Add webhook URL to Vercel environment** (2 minutes)
3. **Test with client email** (5 minutes)
4. **Deploy and celebrate** 🎉

**Result**: Clients will receive emails at their own addresses from your professional domain!
