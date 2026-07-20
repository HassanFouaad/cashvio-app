import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import { Logo } from './logo';
import { LocaleSwitcher } from './locale-switcher';
import { ThemeToggle } from './theme-toggle';
import { MobileNav } from './mobile-nav';
import { DesktopNav } from './desktop-nav';
import { AuthAwareActions } from './auth-aware-actions';

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur-lg">
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          <DesktopNav />

          <div className="hidden lg:flex items-center gap-2">
            <LocaleSwitcher locale={locale} />
            <ThemeToggle />
            <AuthAwareActions className="flex items-center gap-2" />
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <MobileNav locale={locale} />
          </div>
        </div>
      </div>
      <div className="tear-line" aria-hidden="true" />
    </header>
  );
}
