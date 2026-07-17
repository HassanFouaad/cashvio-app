import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface IconTileProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'primary' | 'muted' | 'destructive';
  className?: string;
}

const sizeClasses: Record<NonNullable<IconTileProps['size']>, string> = {
  sm: 'w-8 h-8 [&_svg]:w-4 [&_svg]:h-4',
  md: 'w-10 h-10 [&_svg]:w-5 [&_svg]:h-5',
  lg: 'w-12 h-12 [&_svg]:w-6 [&_svg]:h-6',
};

const toneClasses: Record<NonNullable<IconTileProps['tone']>, string> = {
  primary: 'bg-primary/10 text-primary',
  muted: 'bg-muted text-muted-foreground',
  destructive: 'bg-destructive/10 text-destructive',
};

/**
 * The single icon treatment used across the marketing site:
 * a low-alpha tinted rounded square with a full-color icon.
 */
export function IconTile({ children, size = 'md', tone = 'primary', className }: IconTileProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex items-center justify-center rounded-lg flex-shrink-0',
        sizeClasses[size],
        toneClasses[tone],
        className
      )}
    >
      {children}
    </div>
  );
}
