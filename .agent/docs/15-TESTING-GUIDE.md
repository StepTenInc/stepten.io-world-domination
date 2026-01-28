# 15 — Testing Guide

---

## Overview

Testing accounts, debugging procedures, and QA guidelines for StepTen development.

---

## Test Accounts

### Account Credentials

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| **Free User** | `test-user@stepten.io` | `TestUser123!` | Basic dashboard access |
| **Paid User** | `test-paid@stepten.io` | `TestPaid123!` | Full product access |
| **Admin** | `test-admin@stepten.io` | `TestAdmin123!` | Admin panel access |
| **Superadmin** | `test-super@stepten.io` | `TestSuper123!` | Full system access |

### Account Setup (Supabase)

```sql
-- Run in Supabase SQL Editor to create test accounts
-- These bypass email verification

-- 1. Create auth users (run in Supabase Dashboard > Authentication > Users > Add User)
-- Email: test-user@stepten.io, Password: TestUser123!
-- Email: test-paid@stepten.io, Password: TestPaid123!
-- Email: test-admin@stepten.io, Password: TestAdmin123!
-- Email: test-super@stepten.io, Password: TestSuper123!

-- 2. Update profiles with correct roles
UPDATE public.profiles SET role = 'user', subscription_tier = 'free' 
WHERE email = 'test-user@stepten.io';

UPDATE public.profiles SET role = 'paid_user', subscription_tier = 'pro' 
WHERE email = 'test-paid@stepten.io';

UPDATE public.profiles SET role = 'admin', subscription_tier = 'pro' 
WHERE email = 'test-admin@stepten.io';

UPDATE public.profiles SET role = 'superadmin', subscription_tier = 'enterprise' 
WHERE email = 'test-super@stepten.io';
```

### Disable Email Verification (Development)

In Supabase Dashboard:
1. Go to Authentication > Providers > Email
2. Turn OFF "Confirm email"
3. Turn OFF "Double confirm email changes"

**IMPORTANT:** Re-enable for production!

---

## Testing Environments

### Local Development

```bash
# Start Next.js dev server
npm run dev
# Runs on http://localhost:3000

# Start Python backend
cd apps/python
uvicorn app.main:app --reload --port 8000
# Runs on http://localhost:8000
```

### Environment Variables (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# AI APIs (for testing)
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
GOOGLE_API_KEY=your_key
XAI_API_KEY=your_key
PERPLEXITY_API_KEY=your_key

# Stripe (test mode)
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Python Backend
PYTHON_BACKEND_URL=http://localhost:8000
```

---

## Testing Checklist

### Before Testing

```
□ Dev server running (npm run dev)
□ Python backend running (if testing agents/MCP)
□ Supabase connected (check console for errors)
□ Correct .env.local file in place
□ Test accounts created
```

### Per-Feature Testing

#### Public Pages
```
□ Page loads without errors
□ Responsive on mobile (375px)
□ Responsive on tablet (768px)
□ Responsive on desktop (1280px+)
□ All links work
□ Images load
□ Animations play (check reduced-motion too)
□ Chat widget appears and works
```

#### Authentication
```
□ Login works with test accounts
□ Logout works
□ Protected routes redirect to login
□ Role-based access works (user can't access admin)
□ Session persists on refresh
```

#### Dashboard
```
□ Correct content shows per user role
□ Navigation works
□ Data loads correctly
□ Actions work (update profile, etc.)
```

#### Admin
```
□ Only admins can access
□ Data tables load
□ CRUD operations work
□ No unauthorized data exposed
```

#### AI Agents
```
□ Chat widget opens
□ Messages send and receive
□ Responses stream correctly
□ Memory persists in conversation
□ Voice input works (if implemented)
```

---

## Debugging Guide

### 1. TypeScript Errors

**Location:** Terminal running `npm run dev`

```bash
# Check for TS errors
npm run type-check

# Or watch mode
npm run type-check -- --watch
```

**Common fixes:**
- Missing types → Add interface/type
- Null checks → Add optional chaining (`?.`)
- Import errors → Check path aliases

### 2. Console Errors (Browser)

**Location:** Browser DevTools > Console (F12 or Cmd+Option+I)

**Common errors:**
| Error | Likely Cause | Fix |
|-------|--------------|-----|
| `Hydration mismatch` | Server/client HTML differs | Check for browser-only code, wrap in useEffect |
| `Cannot read property of undefined` | Null data | Add null checks, loading states |
| `Failed to fetch` | API error | Check network tab, CORS, API keys |
| `Unhandled runtime error` | Component crash | Check error boundary, add try/catch |

### 3. Network Errors

**Location:** Browser DevTools > Network tab

**Check:**
- Status codes (200 OK, 401 Unauthorized, 500 Server Error)
- Request/Response payloads
- CORS headers
- API endpoints

### 4. Supabase Errors

**Location:** 
- Browser console
- Supabase Dashboard > Logs

**Common issues:**
| Error | Fix |
|-------|-----|
| `JWT expired` | Refresh session, check auth flow |
| `Row level security` | Check RLS policies |
| `Permission denied` | Check user role, RLS |
| `Relation does not exist` | Run migrations |

### 5. Python Backend Errors

**Location:** Terminal running uvicorn

```bash
# Check Python logs
cd apps/python
uvicorn app.main:app --reload --port 8000

# Logs appear in terminal
```

### 6. Vercel Deployment Errors

**Location:** Vercel Dashboard > Deployments > [deployment] > Logs

**Common issues:**
- Build failures → Check build logs
- Runtime errors → Check function logs
- Environment variables → Check Vercel env settings

---

## Debug Commands

### Database

```bash
# Generate types from Supabase
npx supabase gen types typescript --project-id your-project-id > types/database.ts

# Reset local database (if using local Supabase)
npx supabase db reset

# Run migrations
npx supabase db push
```

### Next.js

```bash
# Clear Next.js cache
rm -rf .next

# Clean install
rm -rf node_modules
npm install

# Build for production (catches more errors)
npm run build
```

### Python

```bash
# Install dependencies
pip install -r requirements.txt

# Run with debug logging
LOG_LEVEL=DEBUG uvicorn app.main:app --reload

# Test specific endpoint
curl http://localhost:8000/health
```

---

## Testing by Feature

### SEO Engine Testing

```
1. Log in as test-admin@stepten.io
2. Go to /admin/seo/articles/new
3. Test each stage:
   □ Voice input → transcription works
   □ Research → Perplexity returns results
   □ Framework → Claude generates structure
   □ Writing → Claude writes content
   □ Humanization → Grok processes
   □ Optimization → Gemini optimizes
   □ Preview → Article renders correctly
   □ Publish → Status updates, article accessible
```

### Chat Agent Testing

```
1. Public agent (no login):
   □ Widget appears on all public pages
   □ Can ask questions about products
   □ Lead capture works
   □ Session persists across pages

2. Authenticated agent:
   □ Log in as test-user@stepten.io
   □ Dashboard chat appears
   □ Memory persists across sessions
   □ User context is known

3. Paid support agent:
   □ Log in as test-paid@stepten.io
   □ Support chat available
   □ More capabilities than free tier
```

---

## Performance Testing

### Lighthouse

```bash
# Run in Chrome DevTools > Lighthouse
# Or command line:
npx lighthouse http://localhost:3000 --view
```

**Targets:**
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Load Testing (Optional)

```bash
# Using k6
k6 run loadtest.js
```

---

## Before Deploying

```
□ All TypeScript errors resolved
□ No console errors in browser
□ All test accounts work
□ All pages responsive
□ All features tested per checklist
□ Environment variables set in Vercel
□ Database migrations run on production
□ API keys valid for production
```

---

## Reporting Bugs

When reporting a bug, include:

1. **URL** where bug occurred
2. **Account** used (which test account)
3. **Steps to reproduce**
4. **Expected behavior**
5. **Actual behavior**
6. **Screenshots/videos**
7. **Console errors** (copy/paste)
8. **Network errors** (if applicable)
