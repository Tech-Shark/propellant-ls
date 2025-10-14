# 🔴 CRITICAL: Backend Role Validation Required

## Security Vulnerability Status

**Issue:** Client-Side Role Validation (Privilege Escalation Risk)
**Severity:** 🔴 CRITICAL
**Status:** ⚠️ REQUIRES BACKEND IMPLEMENTATION

---

## ⚠️ URGENT: What This Means

**ANY USER CAN BECOME AN ADMIN** by opening the browser console and running:

```javascript
const userData = JSON.parse(localStorage.getItem('user'));
userData.role = 'ADMIN';
localStorage.setItem('user', JSON.stringify(userData));
location.reload();
```

**This gives them access to:**
- Admin dashboard
- User management (view/edit/delete all users)
- Credential verification approval
- System configuration
- Email management
- Referral management
- ALL organizational data

---

## Why Frontend Cannot Fix This

The frontend controls what's **displayed**, not what's **accessible**.

Even with perfect frontend security:
- Attackers can call API endpoints directly using curl/Postman
- They can bypass all client-side checks
- They can forge requests with admin privileges

**The real problem:** Your backend API endpoints do not verify user roles before executing privileged operations.

---

## ✅ What's Been Done (Frontend)

1. ✅ Created Zod validation schemas for all forms
2. ✅ Integrated input validation in Login, Register, ForgotPassword, ResetPassword
3. ✅ Added security warnings in ProtectedRoute component
4. ✅ Fixed XSS vulnerabilities (innerHTML, console logging, HTML sanitization)
5. ✅ Created secure logging utility

These improve security but **DO NOT FIX** the privilege escalation vulnerability.

---

## 🔧 REQUIRED Backend Implementation

### Step 1: Create Separate user_roles Table

**CRITICAL:** Do NOT store roles on the users or profiles table. This leads to privilege escalation.

```sql
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('ADMIN', 'ORGANIZATION', 'TALENT');

-- Create user_roles table (separate from users table)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
```

### Step 2: Create Security Definer Function

This prevents RLS recursion issues:

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

### Step 3: Add RLS Policies

```sql
-- Users can only see their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only admins can modify roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'ADMIN'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'ADMIN'::app_role));
```

### Step 4: Backend API Middleware

**Every protected endpoint must verify roles server-side:**

```typescript
// Example for Node.js/Express
const requireRole = (allowedRoles: string[]) => {
  return async (req, res, next) => {
    try {
      // Get user ID from verified JWT token
      const userId = req.user.id; // From JWT verification middleware
      
      // Query database for actual role
      const { data: userRole, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (error || !userRole || !allowedRoles.includes(userRole.role)) {
        return res.status(403).json({ 
          message: 'Forbidden: Insufficient permissions' 
        });
      }
      
      // Store verified role in request for use in handlers
      req.userRole = userRole.role;
      next();
    } catch (error) {
      console.error('Authorization check failed:', error);
      return res.status(500).json({ 
        message: 'Authorization check failed' 
      });
    }
  };
};

// Protect ALL admin endpoints
app.get('/api/admin/users', requireRole(['ADMIN']), getUsersHandler);
app.post('/api/admin/verify', requireRole(['ADMIN']), verifyCredentialHandler);
app.get('/api/admin/emails', requireRole(['ADMIN']), getEmailsHandler);
app.post('/api/admin/settings', requireRole(['ADMIN']), updateSettingsHandler);

// Protect organization endpoints
app.get('/api/organization/applicants', 
  requireRole(['ORGANIZATION', 'ADMIN']), 
  getApplicantsHandler
);

// Protect talent endpoints
app.post('/api/credentials/upload', 
  requireRole(['TALENT', 'ADMIN']), 
  uploadCredentialHandler
);
```

### Step 5: Update JWT Token Creation

Include role from database (not user input):

```typescript
// When creating JWT on login/registration
const getUserRole = async (userId: string) => {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();
  
  return data?.role || null;
};

const createToken = async (userId: string) => {
  const role = await getUserRole(userId);
  
  if (!role) {
    throw new Error('User role not found');
  }
  
  return jwt.sign(
    { 
      userId,
      role, // From database, not from request body
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
    },
    JWT_SECRET
  );
};
```

### Step 6: Audit ALL Protected Endpoints

**These endpoints MUST verify roles:**

- ❌ `/api/admin/*` - Must verify ADMIN role
- ❌ `/api/organization/jobs` - Must verify ORGANIZATION or ADMIN role
- ❌ `/api/organization/applicants` - Must verify ORGANIZATION or ADMIN role
- ❌ `/api/verification/approve` - Must verify ADMIN role
- ❌ `/api/users/:id` - Must verify ownership or ADMIN role
- ❌ `/api/credentials/upload` - Must verify TALENT role
- ❌ `/api/settings/*` - Must verify appropriate role
- ❌ `/api/referrals/manage` - Must verify appropriate role

**Go through EVERY endpoint and add role verification.**

---

## 🧪 Testing After Implementation

### Test 1: Try to access admin endpoint as regular user

```bash
# Get a TALENT user's token
TALENT_TOKEN="<talent_user_jwt_token>"

# Try to access admin endpoint
curl -H "Authorization: Bearer ${TALENT_TOKEN}" \
  http://your-api.com/api/admin/users

# Expected: 403 Forbidden
```

### Test 2: Modify localStorage and try API call

```javascript
// In browser console
const userData = JSON.parse(localStorage.getItem('user'));
userData.role = 'ADMIN';
localStorage.setItem('user', JSON.stringify(userData));

// Try to call admin API through the app
// Expected: 403 Forbidden (because JWT token still has TALENT role)
```

### Test 3: Try to forge JWT with admin role

```bash
# If JWT secret is secure, this should fail
# Attacker shouldn't be able to create valid tokens
```

### Test 4: Verify RLS policies

```sql
-- Set session as a TALENT user
SELECT set_config('request.jwt.claims', '{"sub": "talent_user_id"}', false);

-- Try to query admin data
SELECT * FROM public.user_roles WHERE role = 'ADMIN';
-- Expected: Only returns user's own role, not others
```

---

## 📋 Implementation Checklist

### Database Setup
- [ ] Create `app_role` enum
- [ ] Create `user_roles` table
- [ ] Enable RLS on `user_roles`
- [ ] Create `has_role()` security definer function
- [ ] Add RLS policies for user_roles
- [ ] Migrate existing user roles to new table

### Backend API
- [ ] Create `requireRole()` middleware
- [ ] Add middleware to ALL admin endpoints
- [ ] Add middleware to ALL organization endpoints
- [ ] Add middleware to ALL talent-specific endpoints
- [ ] Update JWT token creation to include role from database
- [ ] Add role verification to existing API routes
- [ ] Remove any role acceptance from request body (must come from database)

### Testing
- [ ] Test admin endpoint access as regular user (should fail)
- [ ] Test localStorage manipulation (should not grant access)
- [ ] Test RLS policies with different user roles
- [ ] Test all protected endpoints with correct and incorrect roles
- [ ] Penetration test with security tools
- [ ] Verify JWT tokens can't be forged

### Documentation
- [ ] Document role assignment process
- [ ] Update API documentation with role requirements
- [ ] Create admin guide for role management
- [ ] Document emergency role revocation procedure

---

## 🚨 Until This Is Fixed

**Assume that:**
- Any user can access any role-protected functionality
- All sensitive operations are vulnerable
- Data integrity cannot be guaranteed
- Your application has a critical security vulnerability

**DO NOT:**
- Deploy to production without fixing this
- Add new admin features
- Store sensitive data
- Process payments or financial transactions
- Allow credential verification

**DO:**
- Fix this immediately
- Audit all API endpoints
- Review access logs for suspicious activity
- Consider if any unauthorized access has already occurred
- Plan for potential data breach notification if needed

---

## 📞 Need Help?

If you need assistance implementing these fixes:

1. **Backend Team:** Share this document with your backend developers
2. **Database Admin:** Provide access to create tables and functions
3. **Security Review:** Consider hiring a security consultant for penetration testing
4. **Compliance:** Consult with legal team about disclosure requirements

---

## 📚 References

- [OWASP Top 10 - Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Security Definer Functions](https://www.postgresql.org/docs/current/sql-createfunction.html)

---

**Last Updated:** 2025-10-14
**Security Level:** 🔴 CRITICAL
**Status:** REQUIRES IMMEDIATE BACKEND IMPLEMENTATION
