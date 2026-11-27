import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const widths = {
  sm: 'w-[120px]',
  md: 'w-[120px] sm:w-[144px]',
  lg: 'w-[160px]',
  xl: 'w-[180px]',
} as const;

export function Logo({ className, size = 'md' }: LogoProps) {
  return (
    <span className={cn('block shrink-0', widths[size], className)}>
      <Image
        src="/assets/cashvio-wordmark.svg"
        alt="Cashvio"
        width={446}
        height={83}
        className="h-auto w-full dark:hidden"
        loading="eager"
        unoptimized
      />
      <Image
        src="/assets/cashvio-wordmark-light.svg"
        alt="Cashvio"
        width={446}
        height={83}
        className="hidden h-auto w-full dark:block"
        loading="eager"
        unoptimized
      />
    </span>
  );
}
