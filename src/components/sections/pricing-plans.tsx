import { ButtonLink } from '@/components/ui/button';
import { ReceiptStamp } from '@/components/marketing';
import { PricingPlanCard } from './pricing-plan-card';
import { ctaLinks } from '@/config/navigation';
import type { PlanPeriod, PublicPlan } from '@/lib/http';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

interface FallbackPlan {
  key: string;
  name: string;
  description: string;
  price: string;
  features: string[];
}

interface PricingPlansProps {
  /**
   * Plans fetched from API (SSR)
   */
  plans: PublicPlan[];
  /**
   * Fallback plans from translations (static)
   */
  fallbackPlans: FallbackPlan[];
  /**
   * Current locale
   */
  locale: string;
}

// Format period label
function getPeriodLabel(period: PlanPeriod, translations: Record<string, string>) {
  const periodLabels: Record<string, string> = {
    DAY: translations.perDay,
    WEEK: translations.perWeek,
    MONTH: translations.perMonth,
    YEAR: translations.perYear,
  };
  return periodLabels[period] || translations.perMonth;
}

// Compact plan slug carried to the register page as ?plan= (GA plan_type)
function getPlanSlug(plan: PublicPlan): string {
  return plan.enName.toLowerCase().trim().replace(/\s+/g, '-');
}

// Get localized plan data
function getLocalizedPlan(plan: PublicPlan, locale: string) {
  return {
    id: plan.id,
    name: locale === 'ar' ? plan.arName : plan.enName,
    details: locale === 'ar' ? plan.detailsAr : plan.detailsEn,
    price: plan.price,
    period: plan.period,
    isFreemium: plan.isFreemium,
  };
}

// Determine which plan should be highlighted as popular
function getPopularIndex(plans: PublicPlan[]): number {
  // If exactly 3 plans, middle one is popular
  if (plans.length === 3) return 1;
  // If more than 3, find the non-freemium, non-highest priced
  if (plans.length > 3) {
    const nonFreemium = plans.filter(p => !p.isFreemium);
    if (nonFreemium.length >= 2) return plans.indexOf(nonFreemium[1]);
  }
  return -1; // No popular plan
}

export async function PricingPlans({
  plans,
  fallbackPlans,
  locale,
}: PricingPlansProps) {
  const t = await getTranslations({ locale, namespace: 'pricing' });
  const tLedger = await getTranslations({ locale, namespace: 'ledger' });
  const isRtl = locale === 'ar';

  const translations = {
    perDay: t('perDay'),
    perWeek: t('perWeek'),
    perMonth: t('perMonth'),
    perYear: t('perYear'),
    free: t('free'),
    freeTrial: t('freeTrial'),
    freeForever: t('freeForever'),
    startFree: t('startFree'),
    popular: t('popular'),
    features: t('features'),
    getStarted: t('getStarted'),
    contactSales: t('contactSales'),
    noPlansAvailable: t('noPlansAvailable'),
    total: tLedger('total'),
  };

  // If no plans from API, use fallback plans
  if (!plans || plans.length === 0) {
    if (fallbackPlans && fallbackPlans.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {fallbackPlans.map((plan, index) => {
            const isPro = index === 1;

            return (
              <article
                key={plan.key}
                className={cn(
                  'receipt-edge relative flex flex-col px-6 sm:px-7 py-8',
                  isPro ? 'bg-card' : 'bg-card/80'
                )}
              >
                {isPro && (
                  <ReceiptStamp className="absolute top-6 end-4 rotate-6">
                    {translations.popular}
                  </ReceiptStamp>
                )}

                <p className="font-receipt text-xs text-muted-foreground tracking-[0.2em] uppercase select-none" aria-hidden="true">
                  * * * * * *
                </p>
                <h3 className="mt-3 text-lg sm:text-xl font-semibold text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {plan.description}
                </p>

                <div className="tear-line my-5" aria-hidden="true" />

                <div className="flex-1">
                  <p className="mono-label text-muted-foreground mb-3">
                    {translations.features}
                  </p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-baseline gap-2.5 text-sm">
                        <span className="font-receipt text-primary shrink-0" aria-hidden="true">
                          +
                        </span>
                        <span className="text-muted-foreground leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-dashed border-ledger-line mt-6 pt-4 flex items-baseline justify-between gap-3">
                  <span className="mono-label text-foreground">{translations.total}</span>
                  {plan.price === 'Custom' ? (
                    <span className="font-receipt text-3xl font-semibold text-foreground tracking-tight">
                      {plan.price}
                    </span>
                  ) : (
                    <span className="flex items-baseline gap-1.5">
                      <span className="font-receipt text-3xl font-semibold text-foreground tracking-tight">
                        EGP{plan.price}
                      </span>
                      <span className="font-receipt text-xs text-muted-foreground">
                        {translations.perMonth}
                      </span>
                    </span>
                  )}
                </div>

                <ButtonLink
                  variant={isPro ? 'primary' : 'outline'}
                  className="w-full justify-center mt-6"
                  href={
                    plan.key === 'enterprise'
                      ? `/${locale}/contact`
                      : `${ctaLinks.getStarted}?plan=${plan.key}`
                  }
                >
                  {plan.key === 'enterprise'
                    ? translations.contactSales
                    : translations.getStarted}
                </ButtonLink>

                <div className="barcode w-24 mx-auto mt-6 text-foreground/50" aria-hidden="true" />
              </article>
            );
          })}
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{translations.noPlansAvailable}</p>
      </div>
    );
  }

  // Sort plans by price (freemium first, then by price)
  const sortedPlans = [...plans].sort((a, b) => {
    if (a.isFreemium && !b.isFreemium) return -1;
    if (!a.isFreemium && b.isFreemium) return 1;
    return a.price - b.price;
  });

  // Determine the popular plan index
  const popularIndex = getPopularIndex(sortedPlans);

  return (
    <div
      className={cn(
        'grid gap-8 max-w-5xl mx-auto',
        sortedPlans.length === 1 && 'grid-cols-1 max-w-md',
        sortedPlans.length === 2 && 'grid-cols-1 md:grid-cols-2 max-w-3xl',
        sortedPlans.length >= 3 && 'grid-cols-1 md:grid-cols-3'
      )}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {sortedPlans.map((plan, index) => {
        const localizedPlan = getLocalizedPlan(plan, locale);
        const isPro = index === popularIndex && !plan.isFreemium;
        const isEnterprise = plan.price === 0 && !plan.isFreemium;
        const features = localizedPlan.details.length > 0 ? localizedPlan.details : [];
        const description = features[0] || '';
        const featureList = features.slice(1);

        return (
          <PricingPlanCard
            key={plan.id}
            name={localizedPlan.name}
            description={description}
            price={plan.isFreemium || plan.price === 0 ? null : localizedPlan.price}
            period={getPeriodLabel(localizedPlan.period, translations)}
            features={featureList}
            isPro={isPro}
            isFreemium={plan.isFreemium}
            isEnterprise={isEnterprise}
            href={
              isEnterprise
                ? `/${locale}/contact`
                : `/${locale}/register?plan=${getPlanSlug(plan)}`
            }
            translations={translations}
          />
        );
      })}
    </div>
  );
}
