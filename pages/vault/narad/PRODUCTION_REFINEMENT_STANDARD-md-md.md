---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/_root/PRODUCTION_REFINEMENT_STANDARD-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [cloudflare-workers, docker, vite]
lines: 746
size: 21394 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, cloudflare-workers, docker, documentation, markdown, project/narad, vite]
---

# PRODUCTION_REFINEMENT_STANDARD-md.md

> Authentication / authorization module using **cloudflare-workers, docker, vite** (746 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/_root/PRODUCTION_REFINEMENT_STANDARD-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers, docker, vite |
| **Lines** | 746 |
| **Size** | 21394 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/deepak/Work/PRODUCTION_REFINEMENT_STANDARD.md"
project: "_root"
role: auth
language: markdown
frameworks: [cloudflare-workers, docker, vite]
lines: 708
size: 20558 bytes
last_modified: "2026-03-28 20:48"
scanned: "2026-04-06 21:37"
tags: [auth, cloudflare-workers, docker, documentation, markdown, project/_root, vite]
---

# PRODUCTION_REFINEMENT_STANDARD.md

> Authentication / authorization module using **cloudflare-workers, docker, vite** (708 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `PRODUCTION_REFINEMENT_STANDARD.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers, docker, vite |
| **Lines** | 708 |
| **Size** | 20558 bytes |
| **Modified** | 2026-03-28 20:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# 🚀 Production Refinement Standard

A universal checklist for refining **ANY project** to production-ready standards. This guide covers security, performance, UI/UX, APIs, deployment, monitoring, and documentation.

---

## 📋 Quick Start

**Use this guide when:**
- Building new features
- Refactoring existing code
- Preparing for user-facing launch
- Hardening infrastructure
- Migrating between environments

**How to use:**
1. Copy this file to your project root
2. Customize sections for your tech stack
3. Check items as you complete them
4. Track blockers in a `REFINEMENT.md` file per sprint

---

## 1. 🔒 SECURITY HARDENING

### 1.1 Authentication & Authorization

- [ ] **API Key / Token Management**
  - Use environment variables (never hardcode secrets)
  - Rotate keys on a schedule (quarterly minimum)
  - Use short-lived tokens where possible (JWT with expiry ≤ 24h)
  - Implement token blacklist on logout
  - Use separate tokens for different environments (dev, staging, prod)

- [ ] **OAuth / Social Login**
  - Validate redirect URIs strictly (no wildcards, exact match)
  - Use PKCE flow for public clients (mobile, SPA)
  - Store only `access_token`, never user passwords
  - Implement `state` parameter to prevent CSRF
  - Handle token refresh securely (refresh in httpOnly cookie)

- [ ] **Session Management**
  - Use HTTP-only cookies (prevent XSS token theft)
  - Set `SameSite=Strict` on cookies
  - Implement session timeout (30min idle default)
  - Clear session data on logout
  - Store session tokens in secure backend store (Redis/DB, not memory)

- [ ] **Password Security** (if applicable)
  - Enforce minimum 12 characters, mixed case, numbers, symbols
  - Hash with bcrypt/argon2 (never plain SHA)
  - Cost factor: bcrypt rounds=12, argon2 time=2 iterations
  - Rate limit login attempts (5 attempts → 15min lock)
  - Implement forgot-password with time-limited tokens (10min expiry)
  - Never email raw passwords, always reset links

### 1.2 API Security

- [ ] **Input Validation**
  - Validate ALL inputs on server-side (never trust client)
  - Use schema validation (Zod, Joi, Pydantic)
  - Whitelist allowed characters (regex patterns)
  - Check length limits (max 500 chars for text fields)
  - Reject unexpected content types

- [ ] **SQL Injection Prevention**
  - Use parameterized queries / ORMs ALWAYS
  - Never concatenate SQL strings
  - Test with: `' OR '1'='1`, `'; DROP TABLE users; --`

- [ ] **XSS (Cross-Site Scripting) Prevention**
  - Sanitize HTML output (DOMPurify for rich text)
  - Use framework's built-in escaping (React auto-escapes by default)
  - Set Content-Security-Policy headers
  - Avoid `dangerouslySetInnerHTML` unless necessary

- [ ] **CSRF (Cross-Site Request Forgery) Protection**
  - Use CSRF tokens on forms
  - Validate Origin/Referer headers
  - Use SameSite cookies
  - For APIs: require custom header (e.g., `X-Requested-With: XMLHttpRequest`)

- [ ] **Rate Limiting**
  - Standard endpoint: 100 requests per 10 seconds per IP
  - Auth endpoint: 5 requests per minute per IP
  - File upload: 1 request per second per user
  - Return 429 (Too Many Requests) with Retry-After header

- [ ] **API Versioning**
  - Use `/v1/`, `/v2/` in routes
  - Never break existing versions
  - Document deprecation timeline (sunset 12+ months before removal)
  - Support old versions for at least 12 months

- [ ] **CORS Configuration**
  - Explicitly list allowed origins (never `*` in production)
  - Only allow necessary methods (GET, POST, DELETE, etc.)
  - Only expose necessary headers
  - Disable credentials if not needed (`credentials: false`)

### 1.3 Data Protection

- [ ] **Encryption at Rest**
  - Use TLS/SSL for database (client → server communication)
  - Encrypt sensitive fields (SSN, payment info, API keys) with AES-256
  - Use a key management service (AWS KMS, Hashicorp Vault, Cloudflare)
  - Store encryption keys separately from data

- [ ] **Encryption in Transit**
  - Always HTTPS (TLS 1.3 minimum, not TLS 1.0/1.1)
  - Redirect HTTP → HTTPS
  - HSTS header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - Valid SSL certificates (not self-signed in prod, use Let's Encrypt)

- [ ] **PII / Sensitive Data**
  - Mask in logs (last 4 digits only for cards/SSN)
  - Don't log passwords, API keys, or tokens
  - Implement data retention policies (delete old data automatically)
  - Comply with GDPR/CCPA (right to be forgotten, data export)
  - Audit access logs (who accessed what, when)

### 1.4 Infrastructure Security

- [ ] **Database**
  - Use strong passwords (16+ chars, random mix of symbols)
  - Restrict access to application servers only (firewall rules)
  - Enable query logging and review logs weekly
  - Regular backups (daily minimum, tested monthly)
  - Disable dangerous commands (DROP, TRUNCATE) where possible
  - Use connection pooling (reduce open connections)

- [ ] **Secrets Management**
  - Never commit `.env` files to git
  - Use `.env.example` with placeholder values
  - Store secrets in platform vault (Cloudflare, GitHub, AWS Secrets Manager, OCI)
  - Rotate secrets on employee departure
  - Audit secret access (who, when, which secret)

- [ ] **File Uploads**
  - Validate file type (magic bytes, not just extension)
  - Limit file size (10 MB default, adjust per use case)
  - Scan with antivirus (VirusTotal API, ClamAV)
  - Store outside web root (not in `/public`)
  - Rename files randomly (prevent path traversal)
  - Set Content-Disposition: attachment (prevent inline execution)

- [ ] **Security Headers**
  - Add to `_headers` (Cloudflare Pages) or middleware
  - Content-Security-Policy header configured
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: SAMEORIGIN
  - X-XSS-Protection: 1; mode=block
  - Referrer-Policy: strict-origin-when-cross-origin

- [ ] **Dependency Security**
  - Run `npm audit` / `pip audit` weekly
  - Update dependencies monthly (patch immediately if critical CVE)
  - Use lock files (`package-lock.json`, `yarn.lock`, `requirements.txt`)
  - Monitor CVE databases (Snyk, Dependabot, GitHub Security alerts)

---

## 2. 🎨 UI/UX ENHANCEMENTS

### 2.1 Visual Design

- [ ] **Color Palette**
  - Define 5-7 primary colors (brand, accent, success, error, warning, info, neutral)
  - Ensure WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text)
  - Test with colorblind simulators (Color Oracle, Sim Daltonism)
  - Dark mode support (use CSS variables or prefers-color-scheme)

- [ ] **Typography**
  - Use 2-3 font families maximum (1 serif + 1 sans-serif)
  - Define heading sizes (H1: 32px, H2: 24px, H3: 20px, H4: 16px)
  - Body text: 16px
  - Line height: 1.5 for body, 1.2 for headings
  - Max line length: 60-80 characters (prevents eye strain)

- [ ] **Spacing & Layout**
  - Use 8px grid system (8px, 16px, 24px, 32px, 40px, 48px)
  - Consistent padding/margins throughout
  - Mobile-first responsive design
  - Test on 320px (mobile), 768px (tablet), 1024px (laptop), 1920px (desktop)

- [ ] **Visual Hierarchy**
  - Larger/bolder for important elements
  - Use whitespace effectively (don't crowd screen)
  - Limit elements per screen (5-7 main elements)
  - Progressive disclosure (hide advanced options by default)

### 2.2 Accessibility (A11y)

- [ ] **WCAG 2.1 Level AA Compliance**
  - Alt text for ALL images (descriptive, not "image.jpg")
  - Descriptive button labels (not "Click here")
  - Keyboard navigation (Tab, Enter, Escape work)
  - Focus visible on interactive elements (not hidden)
  - Skip to main content link (for screen readers)

- [ ] **Screen Reader Friendly**
  - Semantic HTML (use `button`, `nav`, `section`, `article`, `form`)
  - ARIA labels where needed (`aria-label`, `aria-describedby`)
  - Test with NVDA (Windows), JAWS (Windows), VoiceOver (Mac)
  - Form labels associated with inputs (`<label for="email">`)

- [ ] **Color & Vision**
  - Don't use color alone to convey info (add icon or text)
  - Red + green error/success requires additional indicator
  - Minimum 16px font for readability
  - 2:1 contrast for icons

### 2.3 Performance & Loading

- [ ] **Page Load Time**
  - Aim for <3 seconds on 4G (measure with Lighthouse)
  - Lazy load images below fold (`loading="lazy"`)
  - Code splitting by route (React.lazy)
  - Compress images (WebP with JPEG fallback)
  - Minify CSS/JS (Vite does this automatically)

- [ ] **Animations**
  - Use `prefers-reduced-motion` media query (respect user preference)
  - Keep frame rate 60fps (16ms per frame, avoid janky animations)
  - Test on low-end devices
  - Provide option to disable animations

- [ ] **Resource Optimization**
  - Fonts: Load only used weights/variants
  - Images: Responsive images with srcset
  - Bundle: Tree-shake unused code
  - Cache: Set Cache-Control headers (1 year for assets, 5 min for HTML)

### 2.4 Mobile Experience

- [ ] **Responsive Design**
  - Breakpoints: 320px, 480px, 768px, 1024px, 1440px
  - Test on actual devices (not just browser zoom)
  - Touch targets: 48px minimum
  - Font size: 16px minimum (prevent auto-zoom on iOS)
  - Avoid horizontal scroll

- [ ] **Mobile Navigation**
  - Hamburger menu or bottom navigation
  - Deep linking works (can share URLs)
  - Sticky header only when useful

### 2.5 Error Handling & Feedback

- [ ] **Error Messages**
  - User-friendly language (not stack traces)
  - Suggest fixes ("Enter email like: user@example.com")
  - Highlight error fields with red border
  - Allow retry without re-entering data

- [ ] **Loading States**
  - Show spinner or skeleton while loading
  - Disable submit button during request
  - Display estimated wait time if >2 seconds
  - Allow cancellation

- [ ] **Success Feedback**
  - Toast notification (top-right, auto-dismiss after 3s)
  - Success message color: green (#28a745)
  - Confirm data was saved
  - Show next action

---

## 3. ✅ API DESIGN & VALIDATION

### 3.1 REST API Design

- [ ] **Consistent Naming Conventions**
  - Resources: plural nouns (`/users`, `/posts`, `/comments`)
  - Actions: use HTTP methods (GET, POST, PUT, DELETE, PATCH)
  - Avoid verbs in URLs
  - Use hyphens for multi-word names (`/user-settings`)

- [ ] **HTTP Status Codes**
  - 200 OK - Successful GET, PUT, PATCH
  - 201 Created - Successful POST
  - 204 No Content - Successful DELETE
  - 400 Bad Request - Invalid input
  - 401 Unauthorized - Missing/invalid auth
  - 403 Forbidden - No permission
  - 404 Not Found - Resource doesn't exist
  - 429 Too Many Requests - Rate limited
  - 500 Internal Server Error

- [ ] **Request/Response Format**
  - Consistent JSON structure
  - Use `data` field for resources, `error` for errors
  - Include metadata (pagination, timestamp)
  - Document all fields

- [ ] **Pagination**
  - Default limit: 20, max 100
  - Include total count
  - Support cursor or offset pagination
  - Include hasMore flag

- [ ] **Filtering & Sorting**
  - Support common filters (status, type, date range)
  - Default sort by creation date (newest first)
  - Use query parameters: `?status=active&sort=name:asc`
  - Document all supported filters

### 3.2 Authentication & Authorization

- [ ] **Token-Based Auth**
  - Use Bearer tokens: `Authorization: Bearer <token>`
  - Token format: JWT with expiry
  - Refresh tokens for session extension

- [ ] **Scopes & Permissions**
  - Define scopes (read, write, delete)
  - Return 403 if user lacks permission
  - Document required scopes per endpoint

### 3.3 Documentation

- [ ] **API Documentation**
  - Generate from code (Swagger/OpenAPI)
  - Include examples for every endpoint
  - Document authentication requirements
  - Document rate limits
  - Document error codes

- [ ] **Changelog**
  - Document all API changes
  - Deprecation warnings
  - Migration guides

---

## 4. 📦 DEPLOYMENT & INFRASTRUCTURE

### 4.1 Environment Management

- [ ] **Environment Variables**
  - `.env.example` (committed, with placeholders)
  - `.env` (local, never committed)
  - Use platform-specific vaults for production
  - Different configs for dev, staging, prod

- [ ] **Build Configuration**
  - Development build: faster, source maps, hot reload
  - Production build: minified, tree-shaken, optimized
  - Staging build: like prod, but with staging API URLs

- [ ] **CI/CD Pipeline**
  - Automated testing on every push
  - Linting and type checking
  - Build verification
  - Deploy to staging on PR
  - Deploy to prod on merge to main

### 4.2 Deployment Process

- [ ] **Pre-Deployment Checklist**
  - All tests passing
  - No console errors/warnings
  - Security audit passed
  - Database migrations tested
  - Performance benchmarks acceptable
  - Documentation updated

- [ ] **Deployment Strategies**
  - Blue-green deployment
  - Canary releases (roll out to 5%, 25%, 100%)
  - Feature flags
  - Rollback plan

- [ ] **Post-Deployment Verification**
  - Health check endpoint (`GET /health`)
  - Smoke tests (critical user flows)
  - Error monitoring (Sentry, Rollbar)
  - Performance monitoring
  - User feedback

### 4.3 Backup & Disaster Recovery

- [ ] **Database Backups**
  - Daily automated backups
  - Test restore monthly
  - Keep backups for 30+ days
  - Store in separate location

- [ ] **Disaster Recovery Plan**
  - RTO (Recovery Time Objective): target time to restore
  - RPO (Recovery Point Objective): acceptable data loss
  - Test recovery quarterly
  - Document all steps

---

## 5. 📊 MONITORING & LOGGING

### 5.1 Error Monitoring

- [ ] **Error Tracking Service**
  - Sentry, Rollbar, or similar
  - Capture all unhandled errors
  - Include user context
  - Set up alerts for critical errors
  - Group similar errors

- [ ] **Logging**
  - Use structured logging (JSON, not text)
  - Log levels: DEBUG, INFO, WARN, ERROR
  - Include context (request ID, user ID, timestamp)
  - Rotate logs regularly

### 5.2 Performance Monitoring

- [ ] **Page Load Performance**
  - Measure Core Web Vitals (LCP, FID, CLS)
  - LCP: <2.5s, FID: <100ms, CLS: <0.1
  - Use Web Vitals library

- [ ] **API Performance**
  - Track response times (p50, p95, p99)
  - Track error rates
  - Track throughput
  - Alert if response time exceeds threshold

- [ ] **Database Performance**
  - Track query performance
  - Alert on slow queries (>1 second)
  - Monitor connection pool
  - Monitor disk space

### 5.3 Uptime Monitoring

- [ ] **Health Checks**
  - `/health` endpoint returning 200
  - Check database connectivity
  - Check external service connectivity

- [ ] **Uptime Monitoring Service**
  - Monitor `/health` endpoint every minute
  - Alert if down for >5 minutes
  - Check from multiple locations

---

## 6. 📚 DOCUMENTATION

### 6.1 Code Documentation

- [ ] **README.md**
  - Project description (1-2 sentences)
  - Features list
  - Tech stack
  - Quick start (copy-paste runnable)
  - Project structure
  - Contributing guidelines
  - License

- [ ] **Comments in Code**
  - WHY, not WHAT
  - Complex algorithms need explanation
  - Business logic needs comments

- [ ] **ARCHITECTURE.md**
  - System diagram
  - Component responsibilities
  - Data flow
  - External dependencies

### 6.2 User Documentation

- [ ] **GUIDE.md or Deployment Guide**
  - Step-by-step setup instructions
  - Prerequisites
  - Environment configuration
  - Troubleshooting section

- [ ] **CHANGELOG.md**
  - Version history
  - Breaking changes highlighted
  - Migration guides
  - Follow Semantic Versioning

### 6.3 API Documentation

- [ ] **OpenAPI/Swagger**
  - Generate from code annotations
  - Include examples
  - Interactive playground

---

## 7. 🧪 TESTING

### 7.1 Test Types

- [ ] **Unit Tests**
  - Test functions/components in isolation
  - Coverage: >80% of critical paths
  - Use Jest, Vitest, Pytest

- [ ] **Integration Tests**
  - Test components working together
  - Test API endpoints

- [ ] **E2E Tests**
  - Test complete user flows
  - Use Cypress, Playwright, Selenium
  - Run in CI/CD pipeline

### 7.2 Testing Best Practices

- [ ] **Test Data**
  - Use fixtures for consistent test data
  - Mock external APIs
  - Test with edge cases

- [ ] **Avoid Common Pitfalls**
  - Don't test implementation details
  - Don't use real external APIs in tests
  - Do test user-visible behavior

---

## 8. 🔄 QUALITY ASSURANCE

### 8.1 Code Quality

- [ ] **Linting**
  - ESLint for JavaScript/TypeScript
  - Consistent code style
  - Catch common errors

- [ ] **Type Checking**
  - TypeScript in strict mode
  - `noImplicitAny: true`
  - Catch type errors before runtime

- [ ] **Code Formatting**
  - Prettier for consistent formatting
  - Run on save

### 8.2 Testing Coverage

- [ ] **Coverage Targets**
  - Statements: >80%
  - Branches: >75%
  - Functions: >80%
  - Lines: >80%

### 8.3 Code Review

- [ ] **PR Requirements**
  - At least 1 approval required
  - All tests passing
  - No new console errors
  - No security issues
  - Code coverage maintained or improved

---

## 9. 📱 BROWSER & DEVICE TESTING

### 9.1 Browser Compatibility

- [ ] **Desktop Browsers**
  - Chrome/Chromium (latest 2 versions)
  - Firefox (latest 2 versions)
  - Safari (latest 2 versions)
  - Edge (latest version)

- [ ] **Mobile Browsers**
  - iOS Safari (latest 2 versions)
  - Chrome Android (latest 2 versions)

### 9.2 Device Testing

- [ ] **Screen Sizes**
  - iPhone SE (375px)
  - iPhone 14 (390px)
  - iPad (768px)
  - Desktop (1024px+)

- [ ] **Network Conditions**
  - 4G (simulated in browser DevTools)
  - 3G (slow network)
  - Offline (test offline support)

---

## 10. 🚀 LAUNCH CHECKLIST

- [ ] Security audit completed
- [ ] All tests passing (unit, integration, E2E)
- [ ] Linting and type checking passing
- [ ] Performance benchmarks acceptable
- [ ] Accessibility audit passed (WCAG AA)
- [ ] Documentation complete
- [ ] API documentation generated
- [ ] Database backups configured
- [ ] Error monitoring setup (Sentry)
- [ ] Uptime monitoring setup
- [ ] DNS configured
- [ ] SSL certificate valid
- [ ] CORS configured correctly
- [ ] Rate limiting configured
- [ ] Secrets in vault (not .env)
- [ ] CI/CD pipeline working
- [ ] Rollback plan documented
- [ ] Disaster recovery tested
- [ ] User feedback mechanism setup
- [ ] Legal/Privacy: Terms of Service, Privacy Policy
- [ ] Support contact available

---

## 📝 Project-Specific Refinement Log

Create this file in your project to track refinements:

```markdown
# REFINEMENT_PROGRESS.md

## Current Sprint: [Date]

### Security
- [x] Fixed CORS wildcard
- [ ] Implement rate limiting
- [ ] Add HSTS headers

### UI/UX
- [x] Accessibility audit
- [ ] Mobile responsive testing
- [ ] Dark mode support

### API
- [x] Pagination implemented
- [x] Input validation with Zod
- [ ] API documentation (OpenAPI)

### Deployment
- [x] CI/CD setup
- [ ] Backup strategy
- [ ] Monitoring setup

### Blockers
- Issue: Database connection pooling not configured
  Status: In Progress
  Owner: @username
```

---

## 🔗 Tool Recommendations by Category

### Security
- **Secrets Management**: Cloudflare Wrangler, GitHub Actions, AWS Secrets Manager
- **Code Scanning**: GitHub Dependabot, Snyk, SonarQube
- **API Security**: Zod, Joi, Helmet.js
- **Encryption**: TweetNaCl.js, libsodium

### UI/UX
- **Design System**: Storybook, Panda CSS, Tailwind UI
- **A11y Testing**: axe DevTools, Lighthouse, WAVE
- **Performance**: Lighthouse, WebPageTest, GTmetrix

### Testing
- **Unit Tests**: Jest, Vitest, Pytest
- **E2E Tests**: Playwright, Cypress
- **Load Testing**: k6, Apache JMeter

### Monitoring
- **Error Tracking**: Sentry, Rollbar, Datadog
- **Performance**: New Relic, DataDog, Grafana
- **Uptime**: UptimeRobot, Pingdom

### Deployment
- **CI/CD**: GitHub Actions, GitLab CI, CircleCI
- **Hosting**: Cloudflare Pages, Vercel, Netlify, OCI
- **Containers**: Docker, Kubernetes

---

## 📞 Quick Reference: When to Use Each Section

| Scenario | Sections to Review |
|----------|------------------|
| Launching new feature | 1, 2, 3, 7, 8 |
| Hardening security | 1, 4.2, 5.1 |
| Improving performance | 2.3, 5.2, 9 |
| Fixing bugs | 7, 8 |
| Onboarding new dev | 6, ARCHITECTURE.md |
| Pre-launch | All sections + Launch Checklist |

---

## 📄 Version History

- **v1.0** (2024-03-28): Initial comprehensive standard created from SocialBlueprintAI and Vishwakarma project analysis
- Last Updated: 2024-03-28

---

**Made for:** Teams building projects that scale from MVP to production.  
**Adapt to:** Your tech stack, team size, and business requirements.  
**Maintain:** Update quarterly as technologies and best practices evolve.

```

```
