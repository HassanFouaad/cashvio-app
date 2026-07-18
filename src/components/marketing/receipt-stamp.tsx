import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface ReceiptStampProps {
  children: ReactNode;
  tone?: 'primary' | 'muted';
  className?: string;
}

/**
 * Tilted rubber-stamp seal ("FREE FOREVER", "PAID", "NO CARD").
 * Color comes from currentColor so tones stay theme-driven.
 */
export function ReceiptStamp({ children, tone = 'primary', className }: ReceiptStampProps) {
  return (
    <span
      className={cn(
        'stamp',
        tone === 'primary' ? 'text-primary' : 'text-muted-foreground',
        className
      )}
    >
      {children}
    </span>
  );
}
