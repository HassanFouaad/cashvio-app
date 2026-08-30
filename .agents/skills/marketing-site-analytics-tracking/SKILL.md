---
name: marketing-site-analytics-tracking
description: GA4 event tracking, Meta Pixel conversions, first-touch attribution, and TrackedButtonLink usage
---

# Analytics & Attribution Tracking

Capture conversion metrics, referral attribution, scroll milestones, and marketing campaign performance without hurting Core Web Vitals.

## When to Use

- Tracking user conversions (signups, contact form submissions, tool interactions).
- Adding tracked CTA links and external affiliate links.
- Reading first-touch UTM attribution parameters.

## Core Rules & Invariants

- **Zero Inline Script Tags**: Analytics scripts load through `AnalyticsProvider` (`@next/third-parties/google`) or deferred loaders.
- **Client-Side Event Helpers**: Import tracking methods from `@/lib/analytics/events` and `@/lib/analytics/attribution`.
- **First-Touch Preservation**: Attribution params (`utm_source`, `utm_medium`, `utm_campaign`, `ref`, `referrer`) are captured on initial landing and stored in `localStorage` / session cookies.
- **Tracked CTA Links**: Use `TrackedButtonLink` or `TrackedExternalLink` to automatically attach attribution payload to outgoing links.

## Step-by-Step Implementation Flow

### Step 1: Emitting Custom GA4 Events

```tsx
'use client';

import { trackEvent } from '@/lib/analytics/events';

export function DemoTriggerButton() {
  const handleClick = () => {
    trackEvent('cta_click', {
      cta_name: 'hero_get_started',
      page_location: window.location.pathname,
    });
  };

  return <button onClick={handleClick}>Get Started</button>;
}
```

### Step 2: Outbound Tracked Links

```tsx
import { TrackedButtonLink } from '@/components/marketing/tracked-button-link';

export function SignupHeroCta({ label }: { label: string }) {
  return (
    <TrackedButtonLink
      href="https://tenant.cash-vio.com/register"
      ctaName="hero_signup"
      className="bg-primary text-primary-foreground font-semibold"
    >
      {label}
    </TrackedButtonLink>
  );
}
```

## ❌ FORBIDDEN vs ✅ REQUIRED

```tsx
// ❌ FORBIDDEN — Raw window.gtag call without client check
window.gtag('event', 'signup');

// ✅ REQUIRED — Safe trackEvent helper from analytics module
import { trackEvent } from '@/lib/analytics/events';

trackEvent('signup_completed', { method: 'email' });
```
