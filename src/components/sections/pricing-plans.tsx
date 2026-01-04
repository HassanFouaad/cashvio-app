import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  const isRtl = locale === 'ar';

  const translations = {
    perDay: t('perDay'),
    perWeek: t('perWeek'),
    perMonth: t('perMonth'),
    perYear: t('perYear'),
    free: t('free'),
    freeTrial: t('freeTrial'),
    startFree: t('startFree'),
    popular: t('popular'),
    features: t('features'),
    getStarted: t('getStarted'),
    contactSales: t('contactSales'),
    noPlansAvailable: t('noPlansAvailable'),
  };

  // If no plans from API, use fallback plans
  if (!plans || plans.length === 0) {
    if (fallbackPlans && fallbackPlans.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {fallbackPlans.map((plan, index) => {
            const isPro = index === 1;

            return (
              <Card
                key={plan.key}
                className={cn(
                  'relative flex flex-col',
                  isPro && 'border-primary shadow-lg scale-105 z-10'
                )}
              >
                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      {translations.popular}
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="mb-6">
                    {plan.price === 'Custom' ? (
                      <span className="text-4xl font-bold text-foreground">
                        {plan.price}
                      </span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-foreground">
                          EGP{plan.price}
                        </span>
                        <span className="text-muted-foreground">
                          {translations.perMonth}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">
                      {translations.features}
                    </p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <svg
                            className="w-5 h-5 text-primary shrink-0 mt-0.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter>
                  <ButtonLink
                    variant={isPro ? 'primary' : 'outline'}
                    className="w-full justify-center"
                    href={
                      plan.key === 'enterprise'
                        ? `/${locale}/contact`
                        : ctaLinks.getStarted
                    }
                  >
                    {plan.key === 'enterprise'
                      ? translations.contactSales
                      : translations.getStarted}
                  </ButtonLink>
                </CardFooter>
              </Card>
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
          <Card
            key={plan.id}
            className={cn(
              'relative flex flex-col',
              isPro && 'border-primary shadow-lg scale-105 z-10'
            )}
          >
            {/* Popular badge */}
            {isPro && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  {translations.popular}
                </Badge>
              </div>
            )}

            {/* Freemium badge */}
            {plan.isFreemium && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  {translations.freeTrial}
                </Badge>
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-xl">{localizedPlan.name}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="mb-6">
                {plan.isFreemium || plan.price === 0 ? (
                  <span className="text-4xl font-bold text-foreground">
                    {translations.free}
                  </span>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-foreground">
                      EGP{localizedPlan.price}
                    </span>
                    <span className="text-muted-foreground">
                      {getPeriodLabel(localizedPlan.period, translations)}
                    </span>
                  </>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  {translations.features}
                </p>
                <ul className="space-y-2">
                  {featureList.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <svg
                        className="w-5 h-5 text-primary shrink-0 mt-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>

            <CardFooter>
              <ButtonLink
                variant={isPro ? 'primary' : 'outline'}
                className="w-full justify-center"
                href={
                  isEnterprise ? `/${locale}/contact` : `/${locale}/register`
                }
              >
                {isEnterprise
                  ? translations.contactSales
                  : plan.isFreemium
                    ? translations.startFree
                    : translations.getStarted}
              </ButtonLink>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
