import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

/**
 * Cross-link strip pointing sibling pages at the free-POS and free-online-store
 * landings with keyword anchors for internal-link density.
 */
export async function AlsoFreeStrip({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'alsoFree' });

  return (
    <section
      aria-label={t('title')}
      className="section-padding-sm ledger-rules border-y border-border"
    >
      <div className="container-wide">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="mono-label text-muted-foreground mb-2">{t('title')}</p>
            <p className="text-sm sm:text-base text-muted-foreground">{t('subtitle')}</p>
          </div>
          <nav className="flex flex-wrap gap-3">
            <Link
              href="/features/free-pos"
              className="mono-label px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {t('freePos')}
            </Link>
            <Link
              href="/features/free-online-store"
              className="mono-label px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {t('freeOnlineStore')}
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
