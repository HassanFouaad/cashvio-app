# Cross-App State Synchronization Setup

This guide explains how to configure theme and language synchronization between the Next.js marketing site and the tenant portal across different subdomains.

## Overview

The solution uses:
1. **URL Parameters** - For immediate state transfer when redirecting
2. **Shared Cookies** - For persistent cross-subdomain state storage

## Configuration

### Step 1: Set Up Cookie Domain

Add to your `.env.local` file:

```env
# For production (e.g., www.cash-vio.com and portal.cash-vio.com)
NEXT_PUBLIC_COOKIE_DOMAIN=.cash-vio.com

# For local development (leave empty)
NEXT_PUBLIC_COOKIE_DOMAIN=
```

**Important**: The cookie domain must:
- Start with a dot (`.cash-vio.com`)
- Be the parent domain that covers both subdomains
- NOT include `www` or any subdomain prefix

### Step 2: Configure Portal

Add to the portal's `.env` file:

```env
# Must match the Next.js app cookie domain
VITE_COOKIE_DOMAIN=.cash-vio.com
```

## How It Works

### From Next.js App → Portal

1. User clicks "Login" or completes registration
2. Next.js app:
   - Reads current theme (light/dark) and language (en/ar)
   - Saves to shared cookie (domain: `.cash-vio.com`)
   - Redirects to portal with URL params: `?theme=dark&lang=ar`
3. Portal:
   - Reads theme/language from URL params or cookie
   - Applies preferences to Redux store and MUI theme
   - Cleans up URL parameters

### From Portal → Next.js App

The reverse works automatically because both apps save preferences to the same shared cookie.

## Components Updated

### Next.js App (`my-app`)

✅ **New Utilities**: `src/lib/utils/cross-app-sync.ts`
- `saveThemePreference(theme)` - Saves to localStorage + cookie
- `saveLanguagePreference(language)` - Saves to cookie
- `redirectToPortalWithState()` - Redirects with preferences

✅ **Updated Components**:
- `theme-toggle.tsx` - Saves theme to cookie
- `locale-switcher.tsx` - Saves language to cookie
- `registration-form.tsx` - Redirects with state
- `header.tsx` - Uses `PortalLink` component
- `mobile-nav.tsx` - Uses `PortalLink` component

✅ **New Component**: `portal-link.tsx`
- Button that redirects to portal with theme/language

### Portal (`tenant-portal`)

✅ **New Utilities**: `src/utils/cross-app-sync.ts`
- `initializeSharedPreferences()` - Reads preferences on mount
- Cookie management functions

✅ **Updated Files**:
- `App.tsx` - Initializes preferences on mount
- `store/slices/globalSlice.ts` - Saves to cookie on changes

## Testing

### Local Development

1. **Without Shared Domain**:
   ```bash
   # Preferences won't persist across apps
   # But URL parameters will still work
   ```

2. **With Hosts File** (Recommended):
   ```bash
   # Add to /etc/hosts (Mac/Linux) or C:\Windows\System32\drivers\etc\hosts (Windows)
   127.0.0.1 local.cashvio.com
   127.0.0.1 portal.local.cashvio.com
   
   # Then access:
   # http://local.cashvio.com:3005 (Next.js)
   # http://portal.local.cashvio.com:3002 (Portal)
   
   # Set cookie domain:
   NEXT_PUBLIC_COOKIE_DOMAIN=.local.cashvio.com
   VITE_COOKIE_DOMAIN=.local.cashvio.com
   ```

### Production

1. Configure DNS for your subdomains:
   - `www.cash-vio.com` → Next.js app
   - `portal.cash-vio.com` → Portal app

2. Set environment variables:
   ```env
   NEXT_PUBLIC_COOKIE_DOMAIN=.cash-vio.com
   VITE_COOKIE_DOMAIN=.cash-vio.com
   ```

3. Test the flow:
   - Set theme to dark on marketing site
   - Switch language to Arabic
   - Click "Login"
   - Verify portal opens with dark theme and Arabic language

## Cookie Details

**Cookie Names**:
- `app_theme` - Stores 'light' or 'dark'
- `app_language` - Stores 'en' or 'ar'

**Cookie Properties**:
- **Domain**: `.cash-vio.com` (shared across subdomains)
- **Path**: `/` (available on all paths)
- **Max-Age**: 1 year
- **SameSite**: `lax` (allows cross-site on navigation)
- **Secure**: `true` in production (HTTPS only)

## Troubleshooting

### Cookies Not Shared

❌ **Problem**: Preferences don't persist across apps

✅ **Solutions**:
1. Verify cookie domain starts with `.` (dot)
2. Check both apps are on subdomains of the same parent domain
3. Use browser dev tools to inspect cookies
4. Ensure HTTPS in production (required for secure cookies)

### URL Parameters Not Working

❌ **Problem**: Preferences not applied from URL

✅ **Solutions**:
1. Check portal's `App.tsx` initialization runs on mount
2. Verify `initializeSharedPreferences()` is called
3. Check browser console for errors

### Theme Not Applied

❌ **Problem**: Theme preference received but not visible

✅ **Solutions**:
1. Verify Redux store is updated
2. Check MUI ThemeProvider receives correct theme
3. Inspect `globalSlice.ts` darkMode state

## Security Considerations

1. **Cookie Security**:
   - Cookies are NOT encrypted by default
   - Don't store sensitive data (we only store theme/language)
   - `Secure` flag ensures HTTPS-only in production

2. **URL Parameters**:
   - Parameters are visible in browser history
   - Safe for theme/language (non-sensitive data)
   - Cleaned up after reading to avoid clutter

3. **Domain Validation**:
   - Ensure cookie domain matches your actual domain
   - Wildcard cookies (`.cash-vio.com`) only work on subdomains
   - Cannot set cookies for top-level domains (`.com`)

## API Reference

### Next.js App

```typescript
// Save preferences
saveThemePreference('dark' | 'light')
saveLanguagePreference('en' | 'ar')

// Redirect with state
redirectToPortalWithState(
  portalUrl: string,
  path: string,
  options?: { theme?: 'light' | 'dark', language?: string }
)

// Get current preferences
getThemePreference(): 'light' | 'dark' | null
getLanguagePreference(): string | null
```

### Portal

```typescript
// Initialize on app mount
const preferences = initializeSharedPreferences(
  defaultTheme?: 'light' | 'dark',
  defaultLanguage?: string
)
// Returns: { theme, language, hasSharedState }

// Get preferences
getThemePreference(): 'light' | 'dark' | null
getLanguagePreference(): string | null

// Save preferences (called automatically by Redux)
saveThemePreference(theme: 'light' | 'dark')
saveLanguagePreference(language: string)
```

## Support

For issues or questions, contact the development team.

