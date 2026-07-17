import { type ReactNode } from 'react';
import { ButtonLink } from '@/components/ui/button';

interface HeroAction {
  label: string;
  href: string;
}

interface PageHeroProps {
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  eyebrow?: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  note?: string;
  children?: ReactNode;
}

/**
 * Uniform sub-page hero: centered, faint emerald wash, single type scale.
 * No orbs, no gradients, no decorative shapes.
 */
export function PageHero({
  title,
  titleHighlight,
  subtitle,
  eyebrow,
  primaryAction,
  secondaryAction,
  note,
  children,
}: PageHeroProps) {
  return (
    <section aria-label={title} className="hero-wash section-padding-sm border-b border-border">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto">
          {eyebrow && (
            <p className="animate-fade-up text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary mb-4">
              {eyebrow}
            </p>
          )}
          <h1 className="animate-fade-up text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4 leading-[1.15]">
            {title}
            {titleHighlight && (
              <>
                {' '}
                <span className="text-primary">{titleHighlight}</span>
              </>
            )}
          </h1>
          {subtitle && (
            <p className="animate-fade-up animate-delay-100 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          {(primaryAction || secondaryAction) && (
            <div className="animate-fade-up animate-delay-200 flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              {primaryAction && (
                <ButtonLink size="lg" href={primaryAction.href} className="w-full sm:w-auto">
                  {primaryAction.label}
                </ButtonLink>
              )}
              {secondaryAction && (
                <ButtonLink
                  variant="outline"
                  size="lg"
                  href={secondaryAction.href}
                  className="w-full sm:w-auto"
                >
                  {secondaryAction.label}
                </ButtonLink>
              )}
            </div>
          )}
          {note && (
            <p className="animate-fade-up animate-delay-300 mt-5 text-sm text-muted-foreground">
              {note}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
