'use client';

/**
 * Client-side wrapper for pricing plan card with analytics tracking
 */

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
    // Track plan selection
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
      {isFreemium && !isPro && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">
            {translations.freeTrial}
          </Badge>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="mb-6">
          {isFreemium || price === 0 || price === null ? (
            <span className="text-4xl font-bold text-foreground">
              {translations.free}
            </span>
          ) : (
            <>
              <span className="text-4xl font-bold text-foreground">
                EGP{price}
              </span>
              <span className="text-muted-foreground">{period}</span>
            </>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">
            {translations.features}
          </p>
          <ul className="space-y-2">
            {features.map((feature, i) => (
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

