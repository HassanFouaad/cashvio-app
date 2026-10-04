import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { getPortalRegisterUrl, type RegisterQuery } from '@/lib/utils/portal-register-url';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<RegisterQuery>;
};

/**
 * Sign-up moved to the portal. This route keeps every existing /register
 * link working (CTAs, pricing plans, digital receipts) with a temporary
 * redirect, so it can be undone without browsers caching it.
 */
export default async function RegisterPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  redirect(getPortalRegisterUrl(locale, await searchParams));
}
