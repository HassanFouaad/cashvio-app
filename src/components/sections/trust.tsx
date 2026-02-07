import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';

interface TrustProps {
  locale: Locale;
}

// Security badges configuration
const securityBadges = ['PCI DSS', 'GDPR', 'SOC 2', 'ISO 27001'];

// Business integrations (no payment references)
const businessIntegrations = [
  { 
    name: 'QuickBooks', 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    )
  },
  { 
    name: 'Xero', 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
    )
  },
  { 
    name: 'Shopify', 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.337 4.078l.71-.258c.103-.037.203-.056.303-.056.327 0 .605.23.674.55l.376 1.744.827-.303-.426-1.964c-.208-.96-1.04-1.639-2.016-1.639-.3 0-.597.058-.88.172l-.71.258c-.103.037-.203.056-.303.056-.327 0-.605-.23-.674-.55l-.376-1.744-.827.303.426 1.964c.208.96 1.04 1.639 2.016 1.639.3 0 .597-.058.88-.172zM18 8.5l-3.5 11.5H9l-3-10h3l2 7 2-7h5z"/>
      </svg>
    )
  },
  { 
    name: 'WooCommerce', 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 4v12c0 1.1.9 2 2 2h6v2H8v2h8v-2h-2v-2h6c1.1 0 2-.9 2-2V4H2zm18 12H4V6h16v10z"/>
      </svg>
    )
  },
];

// Platform icons
const platforms = [
  {
    name: 'Web',
    description: 'Browser',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
  },
  {
    name: 'iOS',
    description: 'iPhone & iPad',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    name: 'Android',
    description: 'Phones & Tablets',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.463 11.463 0 00-8.94 0L5.65 5.67c-.19-.29-.54-.38-.84-.22-.29.16-.42.54-.26.85L6.4 9.48A10.78 10.78 0 002 18h20a10.78 10.78 0 00-4.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
      </svg>
    ),
  },
  {
    name: 'Offline',
    description: 'No Internet',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
        />
      </svg>
    ),
  },
];

export async function Trust({ locale }: TrustProps) {
  const t = await getTranslations({ locale, namespace: 'home.trust' });

  return (
    <section aria-label="Trust and security" className="py-16 md:py-20 bg-muted/30">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t('title')}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Security & Compliance */}
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-foreground">
                {t('security.title')}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              {securityBadges.map((badge) => (
                <Badge
                  key={badge}
                  variant="secondary"
                  className="px-2.5 py-1 text-xs font-medium bg-muted/80"
                >
                  {badge}
                </Badge>
              ))}
            </div>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <svg
                  className="w-4 h-4 text-success shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                256-bit SSL Encryption
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <svg
                  className="w-4 h-4 text-success shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Two-Factor Authentication
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <svg
                  className="w-4 h-4 text-success shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Daily Automated Backups
              </li>
            </ul>
          </div>

          {/* Business Integrations */}
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-foreground">
                {t('integrations.title')}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              {t('integrations.description')}
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {businessIntegrations.map((integration) => (
                <div
                  key={integration.name}
                  className="flex items-center gap-2 py-2.5 px-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <span className="text-muted-foreground">{integration.icon}</span>
                  <span className="text-sm font-medium text-foreground">{integration.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Support */}
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-foreground">
                {t('platforms.title')}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              {t('platforms.description')}
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {platforms.map((platform) => (
                <div
                  key={platform.name}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="text-foreground opacity-80">{platform.icon}</div>
                  <span className="text-sm font-medium text-foreground">{platform.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
