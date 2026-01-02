import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import { mainNavigation, ctaLinks } from '@/config/navigation';
import { ButtonLink } from '@/components/ui/button';
import { Logo } from './logo';
import { LocaleSwitcher } from './locale-switcher';
import { ThemeToggle } from './theme-toggle';
import { MobileNav } from './mobile-nav';

interface HeaderProps {
  locale: Locale;
}

export async function Header({ locale }: HeaderProps) {
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass">
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <LocaleSwitcher locale={locale} />
            <ThemeToggle />
            <div className="w-px h-6 bg-border mx-2" />
            <ButtonLink variant="ghost" size="sm" href={ctaLinks.login}>
              {tCommon('login')}
            </ButtonLink>
            <ButtonLink variant="primary" size="sm" href={ctaLinks.getStarted}>
              {tCommon('getStarted')}
            </ButtonLink>
          </div>

          {/* Mobile Navigation */}
          <MobileNav locale={locale} />
        </div>
      </div>
    </header>
  );
}
