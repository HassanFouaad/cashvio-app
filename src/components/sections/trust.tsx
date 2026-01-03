import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';

interface TrustProps {
  locale: Locale;
}

// Security badges configuration
const securityBadges = ['PCI DSS', 'GDPR', 'SOC 2', 'ISO 27001'];
const securityFeatures = ['ssl', 'twoFactor', 'backups'];

// Payment partners with their logos (using text for now, can be replaced with actual logos)
const paymentPartners = [
  { name: 'Visa', color: 'bg-blue-600' },
  { name: 'Mastercard', color: 'bg-orange-500' },
  { name: 'Apple Pay', color: 'bg-gray-900 dark:bg-gray-100 dark:text-gray-900' },
  { name: 'Google Pay', color: 'bg-white text-gray-900 border border-gray-200' },
];

// Platform icons
const platforms = [
  {
    name: 'Web',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
  },
  {
    name: 'iOS',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    name: 'Android',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.463 11.463 0 00-8.94 0L5.65 5.67c-.19-.29-.54-.38-.84-.22-.29.16-.42.54-.26.85L6.4 9.48A10.78 10.78 0 002 18h20a10.78 10.78 0 00-4.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
      </svg>
    ),
  },
  {
    name: 'Offline',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
        />
      </svg>
    ),
  },
];

export async function Trust({ locale }: TrustProps) {
  const t = await getTranslations({ locale, namespace: 'home.trust' });

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Security & Compliance */}
          <div className="bg-card rounded-2xl p-8 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              {t('security.title')}
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {securityBadges.map((badge) => (
                <Badge
                  key={badge}
                  variant="secondary"
                  className="px-3 py-1 text-xs font-medium"
                >
                  {badge}
                </Badge>
              ))}
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <svg
                  className="w-5 h-5 text-green-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                256-bit SSL Encryption
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <svg
                  className="w-5 h-5 text-green-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Two-Factor Authentication
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <svg
                  className="w-5 h-5 text-green-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Daily Automated Backups
              </li>
            </ul>
          </div>

          {/* Payment Partners */}
          <div className="bg-card rounded-2xl p-8 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t('integrations.title')}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t('integrations.description')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {paymentPartners.map((partner) => (
                <div
                  key={partner.name}
                  className={`flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium text-white ${partner.color}`}
                >
                  {partner.name}
                </div>
              ))}
            </div>
          </div>

          {/* Platform Support */}
          <div className="bg-card rounded-2xl p-8 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t('platforms.title')}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t('platforms.description')}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <div
                  key={platform.name}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50"
                >
                  <div className="text-foreground">{platform.icon}</div>
                  <span className="text-sm font-medium text-foreground">
                    {platform.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

