import { ButtonLink } from '@/components/ui/button';

interface CtaAction {
  label: string;
  href: string;
}

interface CtaSectionProps {
  title: string;
  subtitle?: string;
  primaryAction: CtaAction;
  secondaryAction?: CtaAction;
  note?: string;
}

/**
 * The single closing CTA treatment: one flat emerald band,
 * identical on every page, same in light and dark mode.
 */
export function CtaSection({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  note,
}: CtaSectionProps) {
  return (
    <section aria-label={title} className="section-padding-sm">
      <div className="container-wide">
        <div className="rounded-2xl bg-[#047857] p-8 sm:p-12 md:p-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-base sm:text-lg text-white/80 mb-8 max-w-xl mx-auto">
                {subtitle}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <ButtonLink
                size="lg"
                href={primaryAction.href}
                className="bg-white text-[#065f46] hover:bg-white/90"
              >
                {primaryAction.label}
              </ButtonLink>
              {secondaryAction && (
                <ButtonLink
                  variant="outline"
                  size="lg"
                  href={secondaryAction.href}
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                >
                  {secondaryAction.label}
                </ButtonLink>
              )}
            </div>
            {note && <p className="mt-6 text-sm text-white/70">{note}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
