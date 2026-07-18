import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

interface ThemedShotProps {
  /** Asset base path without the locale/theme suffix, e.g. "/assets/dashboard". */
  base: string;
  /** Active locale — selects the matching localized screenshot. */
  locale: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  /** next/image quality (1-100). Defaults to 90. */
  quality?: number;
  /** Eager-load the theme-default (dark) variant — use for above-the-fold shots. */
  priority?: boolean;
}

/**
 * Renders a portal screenshot that follows both the active locale and the
 * site theme. Light and dark variants are both emitted; visibility is driven
 * by the `.dark` class on <html> via the `.shot-light` / `.shot-dark` rules in
 * globals.css (the site toggles theme by class, not OS preference).
 */
export function ThemedShot({
  base,
  locale,
  alt,
  width,
  height,
  className,
  sizes,
  quality = 90,
  priority,
}: ThemedShotProps) {
  return (
    <>
      <Image
        src={`${base}-${locale}-light.png`}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        quality={quality}
        loading={priority ? 'eager' : undefined}
        className={cn('block dark:hidden w-full h-auto', className)}
      />
      <Image
        src={`${base}-${locale}-dark.png`}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        quality={quality}
        priority={priority}
        className={cn('hidden dark:block w-full h-auto', className)}
      />
    </>
  );
}
