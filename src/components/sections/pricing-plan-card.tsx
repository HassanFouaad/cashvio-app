'use client';

import { trackPlanSelect, trackCTAClick } from '@/lib/analytics';
import { ButtonLink } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PricingPlanCardProps {
  name: string;
  description: string;
  price: number | null;
  period: string;
  features: string[];
  isPro: boolean;
  isFreemium: boolean;
  isEnterprise: boolean;
  href: string;
  translations: {
    free: string;
    freeTrial: string;
    freeForever: string;
    popular: string;
    features: string;
    getStarted: string;
    startFree: string;
    contactSales: string;
  };
}

export function PricingPlanCard({
  name,
  description,
  price,
  period,
  features,
  isPro,
  isFreemium,
  isEnterprise,
  href,
  translations,
}: PricingPlanCardProps) {
  const handleClick = () => {
    trackPlanSelect(name, price ?? 0, period);
    trackCTAClick(
      isEnterprise ? 'contact_sales' : isFreemium ? 'start_free' : 'get_started',
      'pricing_page',
      href
    );
  };

  return (
    <Card
      className={cn(
        'relative flex flex-col',
        isPro && 'border-primary'
      )}
    >
      {isPro && (
        <div className="absolute -top-3.5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-4 py-1 text-xs font-semibold">
            {translations.popular}
          </Badge>
        </div>
      )}

      {isFreemium && !isPro && (
        <div className="absolute -top-3.5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-4 py-1 text-xs font-semibold">
            {translations.freeForever}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl">{name}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="mb-6 pt-2">
          {isFreemium || price === 0 || price === null ? (
            <span className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              {translations.free}
            </span>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                EGP{price}
              </span>
              <span className="text-sm text-muted-foreground">{period}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {translations.features}
          </p>
          <ul className="space-y-2.5">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <svg
                  className="w-4 h-4 text-primary shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
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

      <CardFooter className="pt-4">
        <ButtonLink
          variant={isPro ? 'primary' : 'outline'}
          className="w-full justify-center"
          href={href}
          onClick={handleClick}
        >
          {isEnterprise
            ? translations.contactSales
            : isFreemium
              ? translations.startFree
              : translations.getStarted}
        </ButtonLink>
      </CardFooter>
    </Card>
  );
}
