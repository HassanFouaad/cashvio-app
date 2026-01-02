import { cn } from '@/lib/utils/cn';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Logo Icon */}
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold',
          size === 'sm' && 'w-7 h-7 text-sm',
          size === 'md' && 'w-9 h-9 text-base',
          size === 'lg' && 'w-11 h-11 text-lg'
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            size === 'sm' && 'w-4 h-4',
            size === 'md' && 'w-5 h-5',
            size === 'lg' && 'w-6 h-6'
          )}
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
      {/* Logo Text */}
      <span
        className={cn(
          'font-bold tracking-tight text-foreground',
          sizes[size]
        )}
      >
        Cash<span className="text-primary">vio</span>
      </span>
    </div>
  );
}

