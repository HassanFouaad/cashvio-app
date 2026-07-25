'use client';

import { trackPlanSelect, trackCTAClick } from '@/lib/analytics';
import { ButtonLink } from '@/components/ui/button';
import { ReceiptStamp } from '@/components/marketing';
import { cn } from '@/lib/utils';

interface PricingPlanCardProps {
  name: string;
  description: string;
  price: number | null;
  /** ISO 4217 code from the API. Omitted renders the amount on its own. */
  currency?: string;
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
    total: string;
  };
}

/**
 * A plan printed as a literal receipt: perforated paper, mono feature
 * lines, a TOTAL row for the price and a stamp for the highlighted plan.
 */
export function PricingPlanCard({
  name,
  description,
  price,
  currency,
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
    <article
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
      {isFreemium && !isPro && (
        <ReceiptStamp className="absolute top-6 end-4 rotate-6">
          {translations.freeForever}
        </ReceiptStamp>
      )}

      <p className="font-receipt text-xs text-muted-foreground tracking-[0.2em] uppercase select-none" aria-hidden="true">
        * * * * * *
      </p>
      <h3 className="mt-3 text-lg sm:text-xl font-semibold text-foreground">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</p>

      <div className="tear-line my-5" aria-hidden="true" />

      <div className="flex-1">
        <p className="mono-label text-muted-foreground mb-3">{translations.features}</p>
        <ul className="space-y-2.5">
          {features.map((feature, i) => (
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
        {isFreemium || price === 0 || price === null ? (
          <span className="font-receipt text-3xl font-semibold text-foreground tracking-tight">
            {translations.free}
          </span>
        ) : (
          <span className="flex items-baseline gap-1.5">
            <span className="font-receipt text-3xl font-semibold text-foreground tracking-tight">
              {currency ? `${currency} ${price}` : price}
            </span>
            <span className="font-receipt text-xs text-muted-foreground">{period}</span>
          </span>
        )}
      </div>

      <ButtonLink
        variant={isPro ? 'primary' : 'outline'}
        className="w-full justify-center mt-6"
        href={href}
        onClick={handleClick}
      >
        {isEnterprise
          ? translations.contactSales
          : isFreemium
            ? translations.startFree
            : translations.getStarted}
      </ButtonLink>

      <div className="barcode w-24 mx-auto mt-6 text-foreground/50" aria-hidden="true" />
    </article>
  );
}
