import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/routing';
import { CtaSection } from '@/components/marketing';

interface CTAProps {
  locale: Locale;
}

export async function CTA({ locale }: CTAProps) {
  const t = await getTranslations({ locale, namespace: 'home.cta' });
  const registerLink = locale === 'en' ? '/register' : '/ar/register';
  const pricingLink = locale === 'en' ? '/pricing' : '/ar/pricing';

  return (
    <CtaSection
      title={t('title')}
      subtitle={t('subtitle')}
      primaryAction={{ label: t('button'), href: registerLink }}
      secondaryAction={{ label: t('viewPricing'), href: pricingLink }}
      note={t('noCreditCard')}
    />
  );
}
