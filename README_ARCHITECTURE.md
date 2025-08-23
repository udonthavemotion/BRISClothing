# 🚨 CRITICAL: API Route Architecture

This project uses **native Vercel API routes** for external integrations, NOT Astro serverless functions.

## Why This Architecture?

**Problem:** Astro's `@astrojs/vercel/serverless` adapter fails with `FUNCTION_INVOCATION_FAILED` errors on Vercel.

**Solution:** Use native Vercel API routes for critical integrations.

## Architecture Pattern

```
✅ External APIs: api/ghl-webhook.js (native Vercel)
✅ Static pages: src/pages/*.astro (Astro)
❌ Never: src/pages/api/*.js for critical integrations
```

## File Structure

```
project-root/
├── api/                           # ✅ Native Vercel API routes
│   ├── ghl-webhook.js            # ✅ GHL integration (WORKING)
│   ├── simple-test.js            # ✅ Diagnostic endpoint
│   └── env-check.js              # ✅ Environment verification
├── src/pages/api/                # ❌ Astro functions (BROKEN on Vercel)
│   └── send-access-email.js      # ❌ Causes FUNCTION_INVOCATION_FAILED
└── docs/
    ├── ASTRO-VERCEL-GHL-BIBLE.md # 📖 Complete explanation
    ├── CURSOR-SNIPPETS.md        # 🔧 Code templates
    └── DEBUGGING-CHECKLIST.md    # 🚨 Troubleshooting guide
```

## Quick Reference

**Working GHL Integration:**
- File: `api/ghl-webhook.js`
- Environment: `process.env.GHL_WEBHOOK_URL`
- Frontend: Uses `/api/ghl-webhook` in production
- Status: ✅ WORKING

**Broken Astro Integration:**
- File: `src/pages/api/send-access-email.js`
- Error: `FUNCTION_INVOCATION_FAILED`
- Status: ❌ BROKEN on Vercel

## For New Developers

1. **Read First:** `docs/ASTRO-VERCEL-GHL-BIBLE.md`
2. **Follow Rules:** `.cursorrules` file
3. **Use Templates:** `docs/CURSOR-SNIPPETS.md`
4. **When Stuck:** `docs/DEBUGGING-CHECKLIST.md`

## Testing Commands

```bash
# Test working API
curl -X POST https://www.brisclothing.com/api/ghl-webhook \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com"}'

# Expected success:
# {
#   "success": true,
#   "message": "Access email triggered successfully",
#   "provider": "GoHighLevel",
#   "ghlStatus": 200
# }
```

**Remember:** When in doubt, use native Vercel API routes!

See `docs/ASTRO-VERCEL-GHL-BIBLE.md` for the complete story of how we solved this.
