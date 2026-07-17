import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { IconTile } from './icon-tile';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  tags?: string[];
  layout?: 'stacked' | 'row';
  className?: string;
}

/**
 * The single card treatment for feature/benefit content:
 * flat surface, 1px border, tinted icon tile — no accent rainbow,
 * no hover lift, no shadows.
 */
export function FeatureCard({
  title,
  description,
  icon,
  tags,
  layout = 'stacked',
  className,
}: FeatureCardProps) {
  const body = (
    <div className="flex-1 min-w-0">
      <h3 className="text-base font-semibold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-muted text-[11px] text-muted-foreground font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-5 sm:p-6',
        layout === 'row' && 'flex items-start gap-4',
        className
      )}
    >
      {icon && (
        <IconTile className={layout === 'stacked' ? 'mb-4' : undefined}>{icon}</IconTile>
      )}
      {body}
    </div>
  );
}
