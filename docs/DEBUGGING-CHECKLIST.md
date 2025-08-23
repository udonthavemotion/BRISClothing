# DEBUGGING CHECKLIST - BRISCO PROJECT

## 🚨 When API Routes Fail

### Step 1: Identify the Problem
- [ ] Getting `FUNCTION_INVOCATION_FAILED`?
- [ ] API returns 404 or 500 errors?
- [ ] Frontend can't reach API endpoints?
- [ ] GHL webhook not receiving data?

### Step 2: Quick Diagnostic
```bash
# Test if basic API works
curl -s https://www.brisclothing.com/api/test

# If 404 or error: API route not deployed correctly
# If success: API infrastructure is working
```

### Step 3: Environment Variable Check
```bash
# Test environment variables
curl -s https://www.brisclothing.com/api/env-check

# Should show:
# {
#   "hasWebhook": true,
#   "webhookStart": "https://serv",
#   "runtime": "node"
# }
```

### Step 4: Isolate Astro vs Vercel Routes
- [ ] **Astro route failing?** → Switch to native Vercel route
- [ ] **Native Vercel route failing?** → Check environment variables
- [ ] **Both failing?** → Check Vercel project configuration

## 🔧 Common Fixes

### Fix 1: FUNCTION_INVOCATION_FAILED
**Problem:** Astro serverless functions not working on Vercel
**Solution:** Create native Vercel API route

```bash
# Create working API route
cp api/ghl-webhook.js api/your-new-endpoint.js
# Edit the new file for your needs
# Deploy: vercel --prod
```

### Fix 2: Environment Variables Missing
**Problem:** `process.env.GHL_WEBHOOK_URL` is undefined
**Solution:** Set in Vercel dashboard

1. Go to Vercel Dashboard → brisco project
2. Settings → Environment Variables
3. Add `GHL_WEBHOOK_URL` for Production
4. Redeploy: `vercel --prod`

### Fix 3: CORS Errors
**Problem:** Browser blocks API requests
**Solution:** Add proper CORS headers

```javascript
res.setHeader('Access-Control-Allow-Origin', 'https://www.brisclothing.com');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

### Fix 4: Wrong Vercel Project
**Problem:** Domain points to wrong project
**Solution:** Link to correct project

```bash
vercel link --project=brisco --yes
vercel --prod
```

## 🧪 Testing Protocol

### Before Every Deploy
```bash
# 1. Test locally (if possible)
npm run dev
curl -X POST http://localhost:4321/api/send-access-email \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com"}'

# 2. Deploy
vercel --prod

# 3. Test production immediately
curl -X POST https://www.brisclothing.com/api/ghl-webhook \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com"}'

# 4. Test frontend integration
# Visit https://www.brisclothing.com and try email form
```

### Success Criteria
- [ ] API returns 200 status
- [ ] Response includes `"success": true`
- [ ] GHL receives webhook payload
- [ ] Frontend shows success message
- [ ] User receives access email

## 🚨 Emergency Rollback

If something breaks in production:

```bash
# 1. Check what's deployed
vercel project ls | grep brisco

# 2. Revert to working version
git log --oneline | head -5
git checkout <working-commit-hash>
vercel --prod

# 3. Verify rollback worked
curl -s https://www.brisclothing.com/api/test
```

## 📋 Prevention Checklist

### Before Starting New Features
- [ ] Read `.cursorrules` file
- [ ] Review `docs/ASTRO-VERCEL-GHL-BIBLE.md`
- [ ] Use native Vercel routes for external APIs
- [ ] Create diagnostic endpoint first

### Before Deploying
- [ ] Test API routes with curl
- [ ] Verify environment variables set
- [ ] Check domain points to correct project
- [ ] Test one feature at a time

### After Deploying
- [ ] Test API endpoints immediately
- [ ] Verify GHL webhook activity
- [ ] Test frontend integration
- [ ] Monitor for errors

## 🎯 Quick Reference

**Working Pattern:**
```
api/ghl-webhook.js → process.env.GHL_WEBHOOK_URL → GHL receives data → Success
```

**Broken Pattern:**
```
src/pages/api/webhook.js → FUNCTION_INVOCATION_FAILED → Nothing works
```

**Remember:** When in doubt, use native Vercel API routes!
