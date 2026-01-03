# Implementation Summary

## Quick Reference

### What We're Building

| Component | Description | Priority |
|-----------|-------------|----------|
| **Plan Details** | Add `detailsAr`, `detailsEn` (string arrays) to Plan model | 🔴 P0 |
| **Freemium Flag** | Add `isFreemium` boolean (only one plan can have it) | 🔴 P0 |
| **Public Plans API** | `GET /public/plans` - No auth required | 🟠 P1 |
| **Auto-Renewal** | Freemium subscriptions renew automatically | 🟠 P1 |
| **Registration API** | `POST /auth/register` - Self-service signup | 🟠 P1 |
| **Contact Module** | Backend module for contact form submissions | 🟠 P1 |
| **Env Config** | All URLs via environment variables | 🔴 P0 |
| **HTTP Module** | Centralized API client | 🔴 P0 |
| **Phone Input** | International phone with country codes | 🟠 P1 |
| **Register Page** | Full registration form | 🟠 P1 |
| **Contact Form** | Connect contact form to backend API | 🟠 P1 |
| **Dynamic Pricing** | Fetch plans from API | 🟠 P1 |

---

## API Endpoints Summary

### New Public Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/public/plans` | ❌ Public | List all active plans |
| GET | `/api/v1/public/plans/:id` | ❌ Public | Get plan details |
| POST | `/api/v1/auth/register` | ❌ Public | Register user + tenant |
| POST | `/api/v1/public/contact` | ❌ Public | Submit contact form |

### New Admin Endpoints (Contact)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/system/contact` | ✅ CONTACT_VIEW | List contact inquiries |
| GET | `/api/v1/system/contact/:id` | ✅ CONTACT_VIEW | Get inquiry details |
| PATCH | `/api/v1/system/contact/:id` | ✅ CONTACT_EDIT | Update status/notes |

### Modified Endpoints (Plans)

| Method | Endpoint | Changes |
|--------|----------|---------|
| POST | `/api/v1/system/plans` | Add `detailsAr`, `detailsEn`, `isFreemium` |
| PATCH | `/api/v1/system/plans/:id` | Add `detailsAr`, `detailsEn`, `isFreemium` |
| GET | `/api/v1/system/plans` | Returns new fields |

---

## Database Changes

### Plans Table

```sql
ALTER TABLE plans ADD COLUMN "detailsAr" TEXT[] DEFAULT '{}';
ALTER TABLE plans ADD COLUMN "detailsEn" TEXT[] DEFAULT '{}';
ALTER TABLE plans ADD COLUMN "isFreemium" BOOLEAN NOT NULL DEFAULT false;

-- Ensure only one freemium plan
CREATE UNIQUE INDEX "plans_is_freemium_unique" 
ON "plans" ("isFreemium") 
WHERE "isFreemium" = true;
```

### Contact Inquiries Table (NEW)

```sql
CREATE TABLE contact_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'GENERAL',  -- GENERAL, DEMO, SUPPORT, SALES, PARTNERSHIP
  status VARCHAR(20) NOT NULL DEFAULT 'NEW',     -- NEW, IN_PROGRESS, RESOLVED, CLOSED
  "ipAddress" VARCHAR(45),
  "userAgent" VARCHAR(500),
  locale VARCHAR(10),
  notes TEXT,
  "resolvedAt" TIMESTAMP,
  "resolvedBy" UUID,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX idx_contact_inquiries_type ON contact_inquiries(type);
CREATE INDEX idx_contact_inquiries_email ON contact_inquiries(email);
CREATE INDEX idx_contact_inquiries_created ON contact_inquiries("createdAt");
```

---

## Domain Structure

```
cash-vio.com              → Next.js Landing Page
console.cash-vio.com      → Portal (Single portal for all tenants)
console.cash-vio.com/api  → NestJS API Server
```

## Environment Variables (Frontend)

```bash
# Required
NEXT_PUBLIC_API_URL=https://console.cash-vio.com/api/v1
NEXT_PUBLIC_PORTAL_URL=https://console.cash-vio.com
NEXT_PUBLIC_SITE_URL=https://cash-vio.com

# Optional
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_DEFAULT_COUNTRY_CODE=EG
```

---

## File Structure Changes

### Backend New Files
```
be/src/modules/
├── subscriptions/
│   ├── controllers/
│   │   └── public.plans.controller.ts     # NEW
│   └── dtos/
│       ├── public-plan.dto.ts             # NEW
│       └── list-public-plans.dto.ts       # NEW
├── auth/
│   └── dtos/
│       ├── register.dto.ts                # NEW
│       └── register-response.dto.ts       # NEW
├── contact/                               # NEW MODULE
│   ├── contact.module.ts
│   ├── controllers/
│   │   ├── public.contact.controller.ts
│   │   └── system.contact.controller.ts
│   ├── dtos/
│   │   ├── contact-inquiry.dto.ts
│   │   ├── create-contact-inquiry.dto.ts
│   │   ├── list-contact-inquiries.dto.ts
│   │   └── update-contact-inquiry.dto.ts
│   ├── models/
│   │   └── contact-inquiry.model.ts
│   ├── repositories/
│   │   └── contact.repository.ts
│   └── services/
│       └── contact.service.ts
└── database/
    └── migrations/
        ├── YYYYMMDDHHMMSS-add-plan-details.ts        # NEW
        └── YYYYMMDDHHMMSS-create-contact-inquiries.ts # NEW
```

### Frontend New Files
```
my-app/src/
├── config/
│   └── env.ts                             # NEW
├── lib/
│   └── http/
│       ├── index.ts                       # NEW
│       ├── client.ts                      # NEW
│       ├── types.ts                       # NEW
│       ├── services/
│       │   ├── index.ts                   # NEW
│       │   ├── plans.service.ts           # NEW
│       │   ├── auth.service.ts            # NEW
│       │   └── contact.service.ts         # NEW
│       └── hooks/
│           └── use-plans.ts               # NEW
├── components/
│   ├── ui/
│   │   ├── phone-input.tsx                # NEW
│   │   ├── form-field.tsx                 # NEW
│   │   └── form-error.tsx                 # NEW
│   └── forms/
│       ├── register-form.tsx              # NEW
│       └── contact-form.tsx               # NEW
└── app/
    └── [locale]/
        ├── register/
        │   └── page.tsx                   # NEW
        └── contact/
            └── page.tsx                   # MODIFIED
```

---

## Key Implementation Notes

### 1. Freemium Plan Validation
- Only ONE plan can have `isFreemium: true`
- Enforced at database level (partial unique index)
- Enforced at service level (validation before create/update)
- Freemium plan MUST exist for registration to work

### 2. Auto-Renewal Logic
```
IF subscription expired AND plan.isFreemium:
    - Extend subscription by plan.period
    - Keep tenant active
ELSE:
    - Mark subscription expired
    - Deactivate tenant
```

### 3. Registration Flow
```
1. Validate all input data
2. Check username/email uniqueness
3. Fetch freemium plan (error if not found)
4. Generate unique slug from business name (e.g., "my-store-4829")
5. Create tenant (delegates to TenantsService)
   - Creates tenant record with auto-generated slug
   - Creates admin user
   - Creates subscription with freemium plan
   - Seeds initial roles
   - Creates initial store
6. Generate JWT tokens
7. Return tokens + user + tenant
```

### 4. Phone Input Countries
Default supported countries (can be expanded):
- 🇪🇬 Egypt (+20) - **DEFAULT**
- 🇸🇦 Saudi Arabia (+966)
- 🇦🇪 UAE (+971)
- 🇺🇸 United States (+1)
- 🇬🇧 United Kingdom (+44)

---

## i18n Keys to Add

### Backend (Error Messages)
```json
{
  "subscriptions.errors.freemium_plan_already_exists": "A freemium plan already exists",
  "auth.errors.no_freemium_plan_available": "Registration is temporarily unavailable",
  "auth.errors.user_already_exists": "An account with this email or username already exists",
  "auth.errors.registration_failed": "Registration failed. Please try again",
  "contact.success.submitted": "Thank you! Your message has been submitted successfully",
  "contact.errors.inquiry_not_found": "Contact inquiry not found"
}
```

### Frontend (Form Labels & Errors)
See `TASKS.md` for complete translation keys.

---

## Testing Checklist

### Backend Tests
- [ ] Plan model accepts new fields
- [ ] Only one freemium plan allowed
- [ ] Public plans API returns only active plans
- [ ] Freemium subscriptions auto-renew
- [ ] Non-freemium subscriptions expire normally
- [ ] Registration creates user + tenant with auto-generated slug
- [ ] Registration fails without freemium plan
- [ ] Slug generation creates unique slugs
- [ ] Contact form submission stores inquiry
- [ ] Contact inquiry status updates work
- [ ] Contact permissions are enforced

### Frontend Tests
- [ ] Environment config loads correctly
- [ ] HTTP client handles errors properly
- [ ] Phone input validates format
- [ ] Registration form validates all fields
- [ ] Contact form submits successfully
- [ ] Contact form shows success/error states
- [ ] Pricing page displays API data
- [ ] Pricing page falls back to static on error

---

## Documents

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System overview, HLD |
| [LLD.md](./LLD.md) | Detailed implementation specs |
| [TASKS.md](./TASKS.md) | Complete task breakdown |
| [SUMMARY.md](./SUMMARY.md) | This document |

