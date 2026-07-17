import { cn } from '@/lib/utils/cn';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: 'center' | 'start';
  className?: string;
}

/**
 * Uniform section heading: optional small primary eyebrow, title, subtitle.
 * One scale for every section on the site.
 */
export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'max-w-2xl mb-10 sm:mb-12',
        align === 'center' ? 'text-center mx-auto' : 'text-start',
        className
      )}
    >
      {eyebrow && (
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
