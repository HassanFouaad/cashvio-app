import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/routing';

interface StatsProps {
  locale: Locale;
}

const statKeys = ['businesses', 'transactions', 'countries', 'uptime'] as const;

export async function Stats({ locale }: StatsProps) {
  const t = await getTranslations({ locale, namespace: 'home.stats' });

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {statKeys.map((key) => (
            <div key={key}>
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                {t(key)}
              </div>
              <div className="text-primary-foreground/80 text-sm md:text-base">
                {t(`${key}Label`)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

