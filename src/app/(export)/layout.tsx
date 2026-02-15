/**
 * Export Route Group Layout
 *
 * Minimal layout for export/receipt pages that doesn't include the main
 * site header and footer, but still supports i18n and theming.
 * 
 * This layout handles locale from cookies/headers since the URL doesn't
 * contain a locale segment (e.g., /export/orders/[orderId] not /en/export/...)
 */

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { cookies, headers } from "next/headers";
import { setRequestLocale, getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Inter, Tajawal } from "next/font/google";

import { localeMetadata, type Locale, routing } from "@/i18n/routing";
import { ThemeToggle } from "@/components/layout";
import { ExportLocaleSwitcher } from "@/features/order-export";

import "../globals.css";
import { env } from "@/config/env";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  display: "swap",
  variable: "--font-arabic",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

/**
 * Get locale from cookies or Accept-Language header
 */
async function getLocaleFromRequest(): Promise<Locale> {
  const cookieStore = await cookies();
  const headersList = await headers();
  
  // 1. Try cv_language cookie first (cross-subdomain preference)
  const cvLanguage = cookieStore.get("cv_language")?.value;
  if (cvLanguage && (cvLanguage === "en" || cvLanguage === "ar")) {
    return cvLanguage;
  }
  
  // 2. Try NEXT_LOCALE cookie
  const nextLocale = cookieStore.get("NEXT_LOCALE")?.value;
  if (nextLocale && (nextLocale === "en" || nextLocale === "ar")) {
    return nextLocale;
  }
  
  // 3. Parse Accept-Language header
  const acceptLanguage = headersList.get("accept-language");
  if (acceptLanguage) {
    if (acceptLanguage.includes("ar")) {
      return "ar";
    }
  }
  
  // 4. Default to English
  return routing.defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromRequest();
  const t = await getTranslations({ locale, namespace: "receipt" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    robots: {
      index: false, // Don't index receipt pages
      follow: false,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1a1f2e" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

interface ExportLayoutProps {
  children: ReactNode;
}

export default async function ExportLayout({
  children,
}: ExportLayoutProps) {
  const locale = await getLocaleFromRequest();

  // Set the request locale for server components
  setRequestLocale(locale);

  // Get messages for client components - will use the locale from request config
  const messages = await getMessages();

  const { direction } = localeMetadata[locale];
  const isRTL = direction === "rtl";

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className={`dark ${inter.variable} ${tajawal.variable}`}
    >
      <head>
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Format detection - disable auto-formatting of phone numbers on iOS */}
        <meta name="format-detection" content="telephone=no" />

        {/* Theme script - must run before body renders */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=document.cookie.match(/(?:^|;\\s*)cv_theme=([^;]*)/);var t=c?decodeURIComponent(c[1]):localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}}catch(e){/* Keep default dark */}})();`,
          }}
        />
      </head>
      <body
        className={`min-h-screen flex flex-col bg-background text-foreground antialiased ${
          isRTL ? "font-arabic" : "font-sans"
        }`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Minimal Header with Settings */}
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
              {/* Spacer */}
              <div />

              {/* Settings Controls */}
              <div className="flex items-center gap-2">
                <ExportLocaleSwitcher currentLocale={locale} />
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex items-center justify-center py-8 px-4">
            {children}
          </main>

          {/* Minimal Footer */}
          <footer className="py-2">
            <div className="container flex justify-center">
              <p className="text-xs text-muted-foreground cursor-pointer hover:underline">
                Powered by <Link href={env.site.url} target="_blank">Cashvio</Link>
              </p>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
