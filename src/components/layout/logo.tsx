'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Logo Component
 *
 * Theme-aware logo that switches between light and dark variants
 * - Light mode: uses logo-dark.png (dark text for light backgrounds)
 * - Dark mode: uses logo-light.png (light text for dark backgrounds)
 */
export function Logo({ className, size = 'md' }: LogoProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial dark mode
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for class changes on html element
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const sizes = {
    sm: { width: 100, height: 32 },
    md: { width: 120, height: 40 },
    lg: { width: 140, height: 48 },
    xl: { width: 180, height: 60 },
  };

  const { width, height } = sizes[size];

  return (
    <div className={cn('flex-shrink-0 overflow-hidden', className)}>
      <Image
        src={isDark ? '/assets/logo-dark.png' : '/assets/logo-light.png'}
        alt="Cashvio"
        width={width}
        height={height}
        className="h-auto w-auto max-h-10 object-contain"
        priority
      />
    </div>
  );
}
