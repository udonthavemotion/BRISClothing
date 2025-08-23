# 🚨 BRISC Lead Capture Debug Guide - Vercel Deployment

## 🔍 **Issue Identified**
Your lead capture is failing on Vercel because environment variables are not properly configured. The API returns `400 - Failed to send email`.

## ✅ **Immediate Fixes Required**

### 1. **Configure Vercel Environment Variables**

Go to your Vercel dashboard → Project Settings → Environment Variables and add:

```bash
# Supabase Configuration (REQUIRED)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend Email Configuration (REQUIRED)
RESEND_API_KEY=your_resend_api_key
```

**Important**: Set these for **Production**, **Preview**, and **Development** environments.

### 2. **Verify Supabase Setup**

Ensure your Supabase `leads` table exists with this structure:
```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  source VARCHAR(100),
  ip VARCHAR(45),
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. **Check Row Level Security (RLS)**

Your Supabase table needs proper RLS policies:
```sql
-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow INSERT for service role
CREATE POLICY "Allow service role to insert leads" ON leads
FOR INSERT TO service_role
WITH CHECK (true);

-- Allow INSERT for authenticated users (if using anon key)
CREATE POLICY "Allow public to insert leads" ON leads
FOR INSERT TO anon
WITH CHECK (true);
```

## 🔧 **Enhanced API Endpoint**

I'll create an improved version of your API endpoint with better error handling:
