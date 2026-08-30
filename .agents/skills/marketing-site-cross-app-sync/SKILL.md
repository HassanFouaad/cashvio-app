---
name: marketing-site-cross-app-sync
description: Cross-subdomain cookie synchronization for theme, language, and portal navigation state across cash-vio.com
---

# Cross-App State & Cookie Synchronization

Manage seamless user transitions and preference sharing between the marketing site (`cash-vio.com`), merchant portal (`tenant.cash-vio.com`), and admin portal (`admin.cash-vio.com`).

## When to Use

- Persisting theme (`light`/`dark`) or language (`en`/`ar`) when users switch preferences.
- Redirecting users to the login/register portal while maintaining their selected theme and language.
- Reading or setting shared cross-domain cookies.

## Core Rules & Invariants

- **Standard Cookie Keys**:
  - `cv_theme`: User theme preference (`'light'` | `'dark'`).
  - `cv_language`: User language preference (`'en'` | `'ar'`).
  - `NEXT_LOCALE`: next-intl server routing locale.
  - `cv_auth_status`: Session indicator.
- **Root Domain Cookie Scope**: In production, cookies MUST be set with `domain=.cash-vio.com` to share across subdomains. On `localhost`, domain is omitted.
- **Dedicated Utility**: ALWAYS use functions from `@/lib/utils/cross-app-sync`. Do NOT write raw `document.cookie` manipulations.

## Step-by-Step Implementation Flow

### Step 1: Saving Preferences

```tsx
import { saveThemePreference, saveLanguagePreference } from '@/lib/utils/cross-app-sync';

export function ThemeToggle({ currentTheme }: { currentTheme: 'light' | 'dark' }) {
  const toggle = () => {
    const next = currentTheme === 'light' ? 'dark' : 'light';
    saveThemePreference(next);
  };

  return <button onClick={toggle}>Toggle Theme</button>;
}
```

### Step 2: Seamless Redirect to Portal

```tsx
import { redirectToPortalWithState } from '@/lib/utils/cross-app-sync';
import { env } from '@/config/env';

export function LoginRedirectButton({ label }: { label: string }) {
  const handleLogin = () => {
    redirectToPortalWithState(env.PORTAL_URL, '/login', {
      theme: 'dark',
      language: 'ar',
    });
  };

  return <button onClick={handleLogin}>{label}</button>;
}
```

## ❌ FORBIDDEN vs ✅ REQUIRED

```tsx
// ❌ FORBIDDEN — Hardcoded document.cookie without root domain
document.cookie = 'theme=dark; path=/';

// ✅ REQUIRED — saveThemePreference utility handling domain scope and localStorage
import { saveThemePreference } from '@/lib/utils/cross-app-sync';

saveThemePreference('dark');
```
