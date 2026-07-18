import { cn } from '@/lib/utils/cn';

interface TearDividerProps {
  className?: string;
}

/**
 * Full-width receipt tear-off line between sections, with a small
 * scissors mark at the start. Purely decorative.
 */
export function TearDivider({ className }: TearDividerProps) {
  return (
    <div aria-hidden="true" className={cn('relative', className)}>
      <div className="tear-line" />
      <span className="absolute -top-[9px] start-6 sm:start-10 text-muted-foreground/70 text-xs leading-none select-none rtl:-scale-x-100">
        ✂
      </span>
    </div>
  );
}
