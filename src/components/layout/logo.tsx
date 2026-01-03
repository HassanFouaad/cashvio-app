import { cn } from '@/lib/utils/cn';
import { Montserrat } from 'next/font/google';

// Montserrat Black - similar to Lovelo bold geometric style
const logoFont = Montserrat({
  subsets: ['latin'],
  weight: ['900'],
  display: 'swap',
});

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Logo Component
 * 
 * Text-based logo: "cash" + "vio" (in primary color)
 * Matches tenant-portal Logo style with Lovelo-like bold font
 */
export function Logo({ className, size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <span
      className={cn(
        logoFont.className,
        'font-black tracking-normal',
        sizes[size],
        className
      )}
    >
      <span className="text-foreground">cash</span>
      <span className="text-primary">vio</span>
    </span>
  );
}
