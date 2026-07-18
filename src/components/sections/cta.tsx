import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/routing';
import { LedgerCta } from '@/components/marketing';

interface CTAProps {
  locale: Locale;
}

interface CtaReceiptLine {
  label: string;
  value: string;
}

export async function CTA({ locale }: CTAProps) {
  const t = await getTranslations({ locale, namespace: 'home.cta' });
  const registerLink = locale === 'en' ? '/register' : '/ar/register';
  const pricingLink = locale === 'en' ? '/pricing' : '/ar/pricing';
  const lines = t.raw('receipt.lines') as CtaReceiptLine[];

  return (
    <LedgerCta
      title={t('title')}
      subtitle={t('subtitle')}
      lines={lines}
      total={{ label: t('receipt.totalLabel'), value: t('receipt.totalValue') }}
      stamp={t('freeForever')}
      primaryAction={{ label: t('button'), href: registerLink }}
      secondaryAction={{ label: t('viewPricing'), href: pricingLink }}
      note={t('noCreditCard')}
    />
  );
}
