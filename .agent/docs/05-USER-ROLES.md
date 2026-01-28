# 05 — User Roles & Permissions

---

## Role Hierarchy

```
superadmin (you)
    └── admin
        └── account_manager
        └── sales
        └── seo
        └── ops
        └── dev
            └── paid_user
                └── user (free)
```

---

## Role Definitions

### superadmin
- You (owner)
- Full system access
- Can manage team roles
- Can access all settings
- Can do everything

### admin
- Full admin panel access
- Can manage all content
- Can manage users
- Cannot change system settings
- Cannot manage team roles

### account_manager
- Can view sales data
- Can manage users
- Can view analytics
- Limited admin access

### sales
- Can view sales data
- Can view leads
- Can view user info
- Limited admin access

### seo
- Full SEO engine access
- Can manage articles
- Can manage silos
- Can view analytics
- Limited admin access

### ops
- Operations access
- Can view dashboards
- Can manage day-to-day
- Limited admin access

### dev
- Can manage products
- Can view technical settings
- Limited admin access

### paid_user
- Full dashboard access
- Can use paid tools
- Can access courses
- Can access support agent

### user (free)
- Basic dashboard access
- Can use free tools
- Can view courses (not access paid)
- Can use onboarding agent

---

## Permissions Matrix

| Permission | user | paid_user | ops | seo | dev | sales | account_manager | admin | superadmin |
|------------|------|-----------|-----|-----|-----|-------|-----------------|-------|------------|
| View public site | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Access dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Use free tools | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Use paid tools | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Access paid courses | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Use support agent | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Access admin panel | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage SEO/articles | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage products | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| View sales data | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| View leads | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Full admin access | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| System settings | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage team roles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Subscription Tiers

| Tier | Price | Features |
|------|-------|----------|
| **free** | $0 | Basic dashboard, free tools, onboarding agent |
| **starter** | TBD | Paid tools, some courses, support agent |
| **pro** | TBD | All tools, all courses, priority support |
| **enterprise** | Custom | Everything + custom features |

---

## Middleware Logic

```typescript
// middleware.ts pseudo-code

function checkAccess(user, route) {
  // Public routes - allow all
  if (isPublicRoute(route)) return allow;
  
  // Auth routes - redirect if logged in
  if (isAuthRoute(route) && user) return redirect('/dashboard');
  
  // Dashboard routes - require auth
  if (isDashboardRoute(route) && !user) return redirect('/login');
  
  // Paid features - check subscription
  if (isPaidFeature(route) && user.subscription_tier === 'free') {
    return redirect('/dashboard/billing');
  }
  
  // Admin routes - check role
  if (isAdminRoute(route)) {
    const adminRoles = ['ops', 'seo', 'dev', 'sales', 'account_manager', 'admin', 'superadmin'];
    if (!adminRoles.includes(user.role)) return redirect('/dashboard');
  }
  
  // Specific admin sections - check specific role
  if (route.startsWith('/admin/seo') && !canAccessSEO(user.role)) {
    return redirect('/admin');
  }
  
  return allow;
}
```

---

## RLS Policies

```sql
-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'superadmin', 'account_manager')
    )
  );

-- Similar policies for other tables...
```
