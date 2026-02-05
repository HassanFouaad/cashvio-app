"use client";

import { useTransition } from "react";
import { type Locale, localeMetadata } from "@/i18n/routing";

interface ExportLocaleSwitcherProps {
  currentLocale: Locale;
}

/**
 * Custom locale switcher for export pages
 * Since we're not using the [locale] route segment, we need a custom switcher
 * that sets cookies and reloads the page
 */
export function ExportLocaleSwitcher({ currentLocale }: ExportLocaleSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const targetLocale = currentLocale === "en" ? "ar" : "en";
  const targetMeta = localeMetadata[targetLocale];

  const handleSwitch = () => {
    startTransition(() => {
      // Set cookies for locale preference
      const maxAge = 365 * 24 * 60 * 60; // 1 year
      document.cookie = `cv_language=${targetLocale};path=/;max-age=${maxAge};samesite=lax`;
      document.cookie = `NEXT_LOCALE=${targetLocale};path=/;max-age=${maxAge};samesite=lax`;
      
      // Preserve theme before reload
      const isDark = document.documentElement.classList.contains("dark");
      const currentTheme = isDark ? "dark" : "light";
      localStorage.setItem("theme", currentTheme);
      document.cookie = `cv_theme=${currentTheme};path=/;max-age=${maxAge};samesite=lax`;
      
      // Reload page to apply new locale
      window.location.reload();
    });
  };

  return (
    <button
      onClick={handleSwitch}
      disabled={isPending}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 disabled:opacity-50"
      aria-label={`Switch to ${targetMeta.name}`}
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
      </svg>
      <span>{isPending ? "..." : targetMeta.nativeName}</span>
    </button>
  );
}
