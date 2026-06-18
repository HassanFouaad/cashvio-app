import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import { mainNavigation } from '@/config/navigation';
import { Logo } from './logo';
import { LocaleSwitcher } from './locale-switcher';
import { ThemeToggle } from './theme-toggle';
import { MobileNav } from './mobile-nav';
import { AuthAwareActions } from './auth-aware-actions';

interface HeaderProps {
  locale: Locale;
}

export async function Header({ locale }: HeaderProps) {
  const t = await getTranslations({ locale, namespace: 'navigation' });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/60">
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5 p-1 rounded-full bg-muted/40 border border-border/30">
            {mainNavigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-full hover:bg-background/80"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <LocaleSwitcher locale={locale} />
            <ThemeToggle />
            <AuthAwareActions className="flex items-center gap-2" />
          </div>

          <MobileNav locale={locale} />
        </div>
      </div>
    </header>
  );
}
