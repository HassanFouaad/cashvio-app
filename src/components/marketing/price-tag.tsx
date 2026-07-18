import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface PriceTagProps {
  children: ReactNode;
  className?: string;
}

/**
 * Small mono label shaped like a physical price tag — pointed end with
 * a punched hole. Replaces generic pill badges.
 */
export function PriceTag({ children, className }: PriceTagProps) {
  return <span className={cn('price-tag', className)}>{children}</span>;
}
