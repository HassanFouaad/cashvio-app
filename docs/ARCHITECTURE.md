# Cashvio Landing Page & Registration - Architecture Document

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [High-Level Design (HLD)](#high-level-design-hld)
4. [Low-Level Design (LLD)](#low-level-design-lld)
5. [Task List](#task-list)

---

## 1. Executive Summary

This document outlines the architecture for implementing the following features:

### Backend (NestJS)
1. **Plan Module Enhancement** - Add `detailsAr`, `detailsEn` (string arrays) and `isFreemium` flag
2. **Public Plans API** - Public endpoint to fetch plan details without authentication
3. **Freemium Plan Logic** - Auto-renewal for freemium plans in subscription job
4. **Registration API** - User self-registration with automatic tenant creation
5. **Contact Module** - Store and manage contact form submissions (public API)

### Frontend (Next.js)
1. **Environment Configuration** - Centralized URL/link management via env variables
2. **HTTP Module** - World-class, SOLID-compliant HTTP client
3. **Registration Page** - Complete registration form with phone input (country code support)
4. **Contact Form Integration** - Connect existing contact form to backend API
5. **Dynamic Pricing Page** - Fetch plans from API instead of static content

---

## 2. System Overview

### Current Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │   Landing Page   │  │   Pricing Page   │  │   Contact Page   │   │
│  │   (Static)       │  │   (Static)       │  │   (Form)         │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ (No API calls currently)
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND (NestJS)                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │   Auth Module    │  │  Plans Module    │  │  Tenants Module  │   │
│  │   - Login        │  │  - CRUD (Admin)  │  │  - Create Tenant │   │
│  │   - Refresh      │  │  - No public API │  │  - Subscription  │   │
│  │   - Logout       │  │                  │  │                  │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Target Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │   Landing Page   │  │   Pricing Page   │  │  Register Page   │   │
│  │   (Static)       │  │   (Dynamic API)  │  │   (Form + API)   │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    HTTP Module (Centralized)                  │   │
│  │  - Axios/Fetch wrapper  - Error handling  - Type safety      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Environment Config                         │   │
│  │  - API URLs  - Portal Links  - External URLs                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ REST API Calls
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND (NestJS)                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │   Auth Module    │  │  Plans Module    │  │  Tenants Module  │   │
│  │   - Login        │  │  - CRUD (Admin)  │  │  - Create Tenant │   │
│  │   - Refresh      │  │  + Public API    │  │  - Subscription  │   │
│  │   - Logout       │  │  + detailsAr/En  │  │                  │   │
│  │   + Register     │  │  + isFreemium    │  │                  │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              Subscription Expiry Processor                    │   │
│  │              + Freemium Auto-Renewal Logic                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. High-Level Design (HLD)

### 3.1 Backend Components

#### 3.1.1 Plan Module Enhancement

**Objective:** Add multilingual details and freemium flag to plans

**Changes:**
- **Model:** Add `detailsAr`, `detailsEn` (TEXT[] / JSONB), `isFreemium` (BOOLEAN)
- **DTOs:** Update CreatePlanDto, UpdatePlanDto, PlanDto
- **Validation:** Ensure only ONE plan can have `isFreemium: true`
- **Migration:** Database migration for new columns

**Constraints:**
- Only one plan can be marked as freemium
- Freemium plan must be active
- detailsAr/En are arrays of bullet points

#### 3.1.2 Public Plans Controller

**Objective:** Public API for frontend to fetch available plans

**Endpoints:**
```
GET /api/v1/public/plans          - List all active plans
GET /api/v1/public/plans/:id      - Get specific plan details


#### 3.1.3 Freemium Auto-Renewal

**Objective:** Auto-renew freemium subscriptions without payment

**Logic Flow:**
```
Subscription Expiry Job (Hourly)
        │
        ▼
Check if subscription is expiring/expired
        │
        ▼
Is Plan Freemium?
        │
    ┌───┴───┐
    │       │
   Yes      No
    │       │
    ▼       ▼
Auto-Renew  Mark as Expired
(Extend)    (Deactivate Tenant)
```

#### 3.1.4 Registration API

**Objective:** Self-service user registration with tenant creation

**Endpoint:**
```
POST /api/v1/auth/register
```

**Flow:**
```
1. Validate registration data
2. Check if email/username already exists
3. Fetch freemium plan (throw if not found)
4. Generate unique slug from business name
5. Delegate to TenantsService.create()
   - Create tenant with auto-generated slug
   - Create admin user
   - Create subscription with freemium plan
   - Seed initial roles
   - Create initial store
6. Return success with login tokens
```

### 3.2 Frontend Components

#### 3.2.1 Environment Configuration

**Objective:** Centralize all external URLs and configuration

**Structure:**
```typescript
// Environment Variables
NEXT_PUBLIC_API_URL=https://console.cash-vio.com/api
NEXT_PUBLIC_PORTAL_URL=https://console.cash-vio.com
NEXT_PUBLIC_SITE_URL=https://cash-vio.com

// Config File (env.ts)
export const env = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
  },
  links: {
    portal: process.env.NEXT_PUBLIC_PORTAL_URL,
    login: `${process.env.NEXT_PUBLIC_PORTAL_URL}/login`,
    register: `${process.env.NEXT_PUBLIC_PORTAL_URL}/register`,
  }
}
```

#### 3.2.2 HTTP Module Architecture

**Objective:** World-class, SOLID-compliant HTTP client

**Design Principles:**
- **Single Responsibility:** Each module handles one concern
- **Open/Closed:** Extensible via interceptors
- **Liskov Substitution:** Swappable implementations
- **Interface Segregation:** Focused interfaces
- **Dependency Inversion:** Depend on abstractions

**Structure:**
```
src/lib/http/
├── index.ts                 # Public exports
├── client.ts                # Main HTTP client
├── types.ts                 # TypeScript interfaces
├── interceptors/
│   ├── request.ts           # Request interceptors
│   ├── response.ts          # Response interceptors
│   └── error.ts             # Error handling
├── services/
│   ├── auth.service.ts      # Auth API calls
│   ├── plans.service.ts     # Plans API calls
│   └── base.service.ts      # Base service class
└── hooks/
    ├── use-api.ts           # Generic API hook
    └── use-plans.ts         # Plans-specific hook
```

#### 3.2.3 Registration Page

**Objective:** User self-registration with professional UX

**Components:**
- **RegisterForm** - Main registration form
- **PhoneInput** - International phone input with country code
- **PlanSelector** - Plan selection (if multiple freemium options)

**Form Fields:**
```typescript
interface RegisterFormData {
  // Tenant Info
  businessName: string;       // Slug auto-generated from this
  contactPhone: string;       // With country code
  secondaryPhone?: string;    // Optional
  
  // Admin User Info
  firstName: string;
  lastName: string;
  username: string;
  email?: string;             // Optional
  password: string;
  confirmPassword: string;
}
```

**Domain Structure:**
```
cash-vio.com              → Next.js Landing Page
console.cash-vio.com      → Portal (Single portal for all tenants)
console.cash-vio.com/api  → NestJS API Server
```

**Tenant Slug Generation:**
- Auto-generated from business name
- Converted to lowercase, spaces to hyphens
- Random 4-digit suffix for uniqueness
- Example: "My Store" → "my-store-4829"

---

## 4. Low-Level Design (LLD)

See `LLD.md` for detailed implementation specifications.

---

## 5. Task List

See `TASKS.md` for complete task breakdown with priorities.

