'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { useThemeSnapshot } from '@/lib/utils/client-snapshot';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBeta?: boolean;
}

/**
 * Logo Component
 *
 * Theme-aware logo that switches between light and dark variants
 * - Light mode: uses logo-dark.png (dark text for light backgrounds)
 * - Dark mode: uses logo-light.png (light text for dark backgrounds)
 */
export function Logo({ className, size = 'md' }: LogoProps) {
  const isDark = useThemeSnapshot();

  const sizes = {
    sm: { width: 100, height: 32 },
    md: { width: 120, height: 40 },
    lg: { width: 140, height: 48 },
    xl: { width: 180, height: 60 },
  };

  const { width, height } = sizes[size];

  return (
    <div className={cn('flex-shrink-0 flex flex-col items-start gap-0.5', className)}>
      <div className="flex items-center gap-1.5">
        <Image
          src={isDark ? '/assets/logo-dark.png' : '/assets/logo-light.png'}
          alt="Cashvio"
          width={width}
          height={height}
          className="h-auto w-auto max-h-10 object-contain"
          priority
        />
      {/*   {showBeta && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase tracking-wide bg-primary/15 text-primary border border-primary/30">
            Beta
          </span>
        )} */}
      </div>
    </div>
  );
}
