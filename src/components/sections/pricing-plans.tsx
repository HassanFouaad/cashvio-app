import { PricingPlanCard } from './pricing-plan-card';
import type { PlanPeriod, PublicPlan } from '@/lib/http';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

interface PricingPlansProps {
  /**
   * Plans fetched from API (SSR)
   */
  plans: PublicPlan[];
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
    currency: plan.currency,
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

export async function PricingPlans({ plans, locale }: PricingPlansProps) {
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

  // Plans are the single source of truth. Never substitute placeholder prices:
  // showing a price the API did not return is a pricing misrepresentation.
  if (!plans || plans.length === 0) {
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
            currency={localizedPlan.currency}
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
