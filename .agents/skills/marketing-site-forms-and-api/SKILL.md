---
name: marketing-site-forms-and-api
description: Lead and contact form implementation, validation patterns, httpClient integration, and backend API submission
---

# Forms & API Integration Standards

Capture lead, contact, and registration inquiries and submit securely to the Cashvio backend API.

## When to Use

- Creating or modifying contact forms, newsletter signups, or demo request dialogs.
- Integrating external API calls via `httpClient`.
- Validating phone numbers, emails, and merchant business names.

## Core Rules & Invariants

- **External Backend Target**: Marketing form submissions target the external backend API (`/public/contact`, `/public/leads`), NOT internal Next.js API routes.
- **Client-Side Validation**: Validate inputs with clear, bilingual feedback before network requests.
- **Error Handling**: Use `HttpError` from `@/lib/http/errors` to extract user-facing error messages safely.
- **Phone Formatting**: Validate regional phone numbers (Egypt `+20`, Saudi `+966`) using phone utilities.

## Step-by-Step Implementation Flow

### Step 1: Form Component with Validation

```tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { contactService } from '@/lib/http/services/contact.service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function ContactForm() {
  const t = useTranslations('contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await contactService.submit({ name, email });
      setSuccess(true);
    } catch (err) {
      setError(t('errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <div className="p-4 bg-primary/10 text-primary rounded-lg">{t('success')}</div>;
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">{t('labels.name')}</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('labels.email')}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2.5 border rounded-md"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? t('submitting') : t('submit')}
        </Button>
      </form>
    </Card>
  );
}
```

## ❌ FORBIDDEN vs ✅ REQUIRED

```tsx
// ❌ FORBIDDEN — Direct fetch bypassing configured httpClient and error wrapper
await fetch('https://api.cash-vio.com/v1/public/contact', {
  method: 'POST',
  body: JSON.stringify(data),
});

// ✅ REQUIRED — Typed service class method
import { contactService } from '@/lib/http/services/contact.service';

await contactService.submit(data);
```
