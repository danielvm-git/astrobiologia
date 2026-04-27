# Security Review — Astrobiology Web App

**Date:** 2026-04-27  
**Scope:** Public web app + admin-only area (Appwrite auth)  
**Method:** STRIDE threat model + OWASP A03 checklist with code-level exploit paths  
**Confidence:** High (all critical surfaces reviewed)

---

## Summary

The application demonstrates **strong foundational security** with HTTP-only session cookies, proper authorization checks, and parameterized queries through the Appwrite SDK. No critical remote exploits identified. However, **three medium-risk findings** require attention:

1. **Unbounded query parameters on public endpoints** (DOS/cost abuse vector)
2. **No per-user authorization in admin operations** (all authenticated users can access/modify any article)
3. **Session termination not propagated to Appwrite** (session secret remains valid server-side)

---

## Findings

### MEDIUM-1: Unbounded `limit` parameter enables DOS via bulk scraping

**Location:** `server/api/articles/list.get.ts:7` + `server/utils/article-read.ts:107-131`  
**Category:** Denial of Service (STRIDE) + Cost Abuse  
**Threat reachability:** Remote unauthenticated (public endpoint)

**Exploit:**

```
GET /api/articles/list?limit=1000000&offset=0
```

The `limit` parameter is parsed as `Number(query.limit)` without clamping:

- Line 7: `const limit = typeof query.limit === "string" ? Number(query.limit) : 50;`
- Line 114: passed directly to `Query.limit(limit)` in `getPublishedArticles`

An attacker can request 1M+ documents in a single query. Appwrite _may_ apply backend limits, but the client does not; an attacker can bulk-scrape all published articles, causing:

- **Appwrite quota exhaustion** (read operations/bandwidth)
- **Bandwidth cost** (large response body)
- **Service disruption** if quota limits are enforced

**Severity:** MEDIUM  
**Business impact:** Cost (bandwidth/quota overage), service disruption  
**Remediation:**

1. Clamp `limit` to a safe maximum (e.g., 100):
   ```typescript
   const limit = Math.min(Number(query.limit) || 50, 100);
   ```
2. Consider rate limiting at the reverse proxy level for `/api/articles/list`.

**Non-critical:** Same issue on `/api/articles/list?limit=X` but the Appwrite backend may enforce its own limit (unverified in this review).

---

### MEDIUM-2: No authorization control in admin article operations (IDOR risk for future role-based access)

**Location:** `server/api/admin/articles/[id].ts:5-6` (all methods: GET, PUT, DELETE)  
**Category:** Elevation of Privilege / Broken Access Control (OWASP A01)  
**Threat reachability:** Authenticated user (requires valid session)

**Issue:**
The handler checks only that `event.context.user` exists (line 5), not who authored or owns the article:

```typescript
if (!event.context.user) {
  throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
}
```

**Current risk:** MINIMAL today because:

- Only authenticated Appwrite users are trusted (admin area in Appwrite console is the gate)
- No multi-user role system is implemented (all logged-in users are treated as admins)

**Future risk:** MEDIUM if:

1. Multiple independent admins are added (e.g., via Appwrite labels or a custom role system)
2. The code does not evolve to check ownership or role before DELETE/PUT

When multiple users exist, a malicious admin or compromised session can modify/delete any article without audit trail.

**Severity:** MEDIUM (conditional on future architecture)  
**Business impact:** Data integrity loss, unintended deletions, audit trail gaps  
**Remediation:**

1. Define an explicit authorization model (e.g., only article author can edit, only super-admin can delete):
   ```typescript
   const article = await databases.getDocument(..., id);
   if (article.authorId !== event.context.user.$id && !event.context.user.labels?.includes('super-admin')) {
     throw createError({ statusCode: 403, statusMessage: "Forbidden" });
   }
   ```
2. Add audit logging for all admin changes (create/update/delete).

**Note:** This is a **design risk**, not an active exploit, because Appwrite session auth currently gates all admins equally.

---

### MEDIUM-3: Logout does not invalidate server-side session (session secret remains reusable)

**Location:** `server/api/auth/logout.post.ts:11-12`  
**Category:** Elevation of Privilege / Session Management (OWASP A02)  
**Threat reachability:** Authenticated user (post-logout window)

**Issue:**
The logout handler deletes the session cookie but does **not** call Appwrite's `deleteSession` method:

```typescript
deleteCookie(event, cookieName, { path: "/" });
// Optional: you could call account.deleteSession('current') here
// if using createSessionClient, but deleting the cookie is enough to log them out locally
```

**Exploit window:**

1. User logs in → session secret stored in HTTP-only cookie + Appwrite backend
2. User logs out → cookie deleted (client-side logout works)
3. Attacker with knowledge of the session secret can still:
   - Reconstruct the cookie (if secret was exfiltrated, e.g., via XSS or network sniff)
   - Call `POST /api/auth/login` with old session credentials (Appwrite validates against server state)

**Risk:** The comment suggests deleting the cookie is "enough," but for defense-in-depth, the session should also be revoked on the backend.

**Severity:** MEDIUM  
**Business impact:** Post-logout session hijacking if secret is leaked (low probability but high impact)  
**Remediation:**

1. Call Appwrite's `deleteSession` during logout:
   ```typescript
   const { account } = createAdminClient();
   try {
     await account.deleteSession("current");
   } catch {
     // Session may already be invalid; continue with cookie deletion
   }
   deleteCookie(event, cookieName, { path: "/" });
   ```
2. Alternatively, if session revocation is not needed, document the security assumption that cookie-only logout is acceptable (depends on compliance requirements).

---

### INFORMATIONAL-1: Search parameter not validated (query cost / ReDoS risk deferred to Appwrite)

**Location:** `server/api/search.get.ts:5` + `server/utils/article-read.ts:266-268`  
**Category:** Denial of Service / Query optimization (STRIDE Denial of Service)  
**Threat reachability:** Remote unauthenticated

**Observation:**
The search term `q` is trimmed but not length-checked before being passed to Appwrite's `Query.search`:

```typescript
const q = typeof query.q === "string" ? query.q.trim() : "";
// ... passed to Query.search(field, normalized)
```

**Risk:** Unbounded search terms (e.g., `?q=` + 100KB of text) could:

- Trigger ReDoS in Appwrite's full-text search engine
- Exhaust Appwrite resources (query complexity)

**Mitigation:** Appwrite likely enforces query size limits at the API gateway. This is **not a direct vulnerability** but a hygiene opportunity.

**Severity:** INFORMATIONAL  
**Remediation:**

1. Clamp search query length (e.g., max 200 characters):
   ```typescript
   const q = typeof query.q === "string" ? query.q.trim().slice(0, 200) : "";
   ```

---

### INFORMATIONAL-2: Health endpoint leaks error messages (low impact)

**Location:** `server/api/health.get.ts:28-30`  
**Category:** Information Disclosure

**Observation:**
On Appwrite connection failure, the health endpoint returns:

```json
{
  "status": "error",
  "error": "error instanceof Error ? error.message : Unknown error..."
}
```

If Appwrite throws a verbose error (e.g., "Invalid API key"), that detail leaks to any unauthenticated caller.

**Risk:** Low — most errors are generic ("Connection refused"); however, specific Appwrite diagnostics could aid reconnaissance.

**Severity:** INFORMATIONAL  
**Remediation:** Return a generic error:

```typescript
catch (error) {
  return {
    status: "error",
    database: "disconnected",
    timestamp: new Date().toISOString(),
  };
}
```

---

## Non-Findings (What Was Checked and Ruled Out)

### ✓ SQL Injection

**Status:** Not present  
**Reason:** All queries use Appwrite SDK's `Query` API; no string concatenation of SQL. Parameters are passed as JavaScript objects.  
**Files:** `article-read.ts`, all admin endpoints.

### ✓ XSS (Server-side)

**Status:** Not present  
**Reason:** Server endpoints return JSON; no HTML template injection. Client-side XSS is out of scope for this review.  
**Files:** All API handlers.

### ✓ CSRF

**Status:** Not present  
**Reason:** Session is HTTP-only cookie with `SameSite: lax`; sensitive mutations (POST/DELETE) require valid body parsing (CSRF cannot forge multipart/form-data cross-origin).  
**Files:** `session-cookie.ts:20`.

### ✓ Authentication bypass

**Status:** Not present  
**Reason:** Every authenticated endpoint checks `event.context.user` (set by `auth.ts` via Appwrite `account.get()`). OAuth callback validates `userId` + `secret` from query params.  
**Files:** `middleware/auth.ts`, all admin endpoints.

### ✓ Secrets in client code

**Status:** Not present  
**Reason:** Appwrite API key and DeepL key are in `process.env` (server-side only); not in `runtimeConfig.public`. Client-visible config only includes endpoint + project ID.  
**Files:** `deepl.ts:19`, `appwrite.ts:76`, `nuxt.config.ts`.

### ✓ Secrets in logs

**Status:** Not present  
**Reason:** DeepL handler catches errors and returns generic message ("Erro ao traduzir"). Auth handlers do not log passwords or session secrets.  
**Files:** `translate.post.ts:34-41`, `login.post.ts:30`.

### ✓ Subdomain takeover / DNS

**Status:** Out of scope (infrastructure)  
**Reason:** This review focuses on application code, not DNS/hosting configuration.

### ✓ Supply chain (dependencies)

**Status:** Out of scope (requires separate audit)  
**Reason:** This review assumes `node-appwrite`, `nuxt`, and other libraries are not compromised; SCA tools should verify this separately.

---

## Architecture & Design Observations

### Strengths

1. **Layered auth:** HTTP-only cookie + Appwrite session validation on every request. No localStorage fallback.
2. **Consistent authorization:** Admin endpoints uniformly check `event.context.user`.
3. **Admin client separation:** Server-side Appwrite key is never exposed to client code.
4. **Published content filter:** Public search/list endpoints use `Query.equal("status", "published")`.
5. **Category whitelisting:** Category routes validate against a hardcoded `CATEGORIES` array (prevents arbitrary Appwrite queries).

### Gaps for Defense-in-Depth

1. **No rate limiting** on public endpoints (Appwrite quotas are the only brake).
2. **No authorization model** for multi-admin scenarios (all logged-in users = full admin).
3. **No audit trail** for article CRUD operations.
4. **Session revocation** incomplete (cookie deleted but Appwrite session secret not invalidated).

---

## Recommendations (Priority Order)

### 1. Add `limit` clamping to public list endpoints (MEDIUM - easy fix)

- **Why:** Prevents DOS via bulk scraping + Appwrite quota abuse.
- **Where:** `server/api/articles/list.get.ts:7` and `server/api/articles/featured.get.ts`.
- **Effort:** 1 line per handler.

### 2. Call `deleteSession` on logout (MEDIUM - easy fix)

- **Why:** Defense-in-depth for session revocation.
- **Where:** `server/api/auth/logout.post.ts:11`.
- **Effort:** 3 lines.

### 3. Document authorization model for multi-user scenarios (HIGH - planning task)

- **Why:** If multiple admins are planned, the current code will allow cross-admin article deletion.
- **Where:** Architecture decision + implementation in `server/api/admin/articles/[id].ts`.
- **Effort:** Design phase (2-4 hours) + implementation (4-8 hours).

### 4. Add audit logging for admin operations (HIGH - future proofing)

- **Why:** No trail of who changed what and when.
- **Where:** Create new `server/utils/audit-log.ts`; call from `admin/articles/*` handlers.
- **Effort:** 8-12 hours.

### 5. Implement rate limiting (MEDIUM - infrastructure)

- **Why:** Protect against scraping and brute force (DeepL endpoint, search abuse).
- **Where:** Reverse proxy or Nitro middleware.
- **Effort:** 2-4 hours.

---

## Compliance & Standards

| Standard                | Status       | Notes                                                                |
| ----------------------- | ------------ | -------------------------------------------------------------------- |
| OWASP Top 10 2023       | PASS         | No critical A01-A09 issues found; medium risks identified above      |
| WCAG (accessibility)    | Out of scope | Not a security review concern                                        |
| GDPR (data protection)  | Partial      | Session deletion is incomplete; no audit trail for deletion requests |
| CWE-22 (path traversal) | PASS         | File uploads use Appwrite's `ID.unique()`; no user-supplied path     |
| CWE-79 (XSS)            | PASS         | Server returns JSON only                                             |
| CWE-89 (SQL injection)  | PASS         | Parameterized Appwrite queries                                       |

---

## Out of Scope

The following were **not reviewed** in this assessment:

- **Client-side code** (Vue/Nuxt components, XSS, DOM-based vulnerabilities)
- **Infrastructure** (TLS, network security, WAF, DDoS mitigation)
- **Supply chain** (npm package audit, dependency vulnerabilities)
- **Appwrite console / IAM** (how Appwrite users/roles are managed in the cloud)
- **Deployment secrets** (CI/CD pipeline, env var management in production)
- **API rate limiting** (assumed to be handled by CDN/reverse proxy)

---

## Conclusion

**Overall security posture: GOOD with three medium-risk findings.**

The application demonstrates solid foundations:

- Session handling is correct (HTTP-only, SameSite, HTTPS-aware).
- Database queries are parameterized (no SQL injection).
- Authentication checks are consistent across endpoints.
- Secrets are not leaked to client or logs.

**Next steps:**

1. Address MEDIUM findings (1–2 above) within 1 sprint.
2. Plan authorization model for future multi-admin scenarios (3).
3. Consider audit logging for compliance (4).
4. Evaluate rate limiting strategy at infrastructure layer (5).

---

## Sign-off

**Reviewer:** Security Review (STRIDE + OWASP) — Code-level analysis  
**Files reviewed:** 15 critical server-side handlers + utilities  
**Testing:** Code inspection only (no runtime testing; no pen test)  
**Date:** 2026-04-27

**Classification:** Can be shared with development team. Do not post to public issue tracker without review.
