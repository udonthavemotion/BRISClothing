# BRISC Supabase Integration Setup

## 1. Create the Leads Table

Copy and paste this SQL into your Supabase SQL editor:

```sql
-- Create a simple leads table
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,                 -- optional
  source text,               -- optional (e.g. "homepage", "popup")
  ip inet,                   -- optional
  created_at timestamptz not null default now()
);

-- Turn on Row Level Security
alter table public.leads enable row level security;

-- Let the public (anon) key INSERT rows (front-end form)
create policy "anon_can_insert_leads"
on public.leads
for insert
to anon
with check (true);

-- Only the service role (server key) can READ (keeps emails private)
create policy "service_role_can_select_leads"
on public.leads
for select
to service_role
using (true);
```

## 2. Environment Variables

Add these to your environment variables (Vercel, Netlify, etc.):

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Existing Resend Configuration
RESEND_API_KEY=your_resend_api_key_here
```

## 3. How It Works

### Lead Capture Flow:
1. User enters email on homepage
2. **FIRST**: Email is saved to Supabase `leads` table
3. **THEN**: Access email is sent via Resend
4. Both steps are logged for debugging

### Security:
- **Frontend (anon key)**: Can only INSERT leads (RLS policy)
- **Backend (service role)**: Can SELECT leads for admin dashboard
- **Admin page**: `/admin/leads` - shows all captured leads

### Admin Dashboard:
- Visit `/admin/leads` to view captured leads
- Shows total count, today's count, this week's count
- Auto-refreshes every 30 seconds
- Mobile-responsive design matching BRISC aesthetic

## 4. Integration Status

✅ **Supabase client library installed**
✅ **Lead capture integrated into email API**
✅ **Admin dashboard created**
✅ **RLS policies for security**
✅ **Error handling for graceful degradation**

## 5. Rollback Plan

If you need to disable Supabase integration:
1. Remove environment variables
2. The system will gracefully fall back to email-only mode
3. All existing functionality remains intact
4. Console warnings will indicate Supabase is disabled

## 6. Testing

1. **Test lead capture**: Submit email on homepage
2. **Check logs**: Look for "Lead captured successfully" in console
3. **View admin**: Visit `/admin/leads` to see captured leads
4. **Test email**: Ensure access email still sends normally

The integration is designed to be **non-breaking** - if Supabase fails, email sending continues normally.
