import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

export default async function NotFound() {
  const t = await getTranslations('errors.notFound');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4">
      <div className="text-center max-w-md">
        {/* 404 Icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-muted flex items-center justify-center">
          <svg
            className="w-12 h-12 text-muted-foreground"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {t('title')}
        </h1>

        {/* Description */}
        <p className="text-lg text-muted-foreground mb-8">
          {t('description')}
        </p>

        {/* CTA */}
        <Link href="/" className={cn(buttonVariants({ size: 'lg' }))}>
          {t('backHome')}
        </Link>
      </div>
    </div>
  );
}
