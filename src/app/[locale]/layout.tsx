import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import {
  setRequestLocale,
  getTranslations,
  getMessages,
} from "next-intl/server";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";

import { routing, localeMetadata, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { getCanonicalUrl, getAlternateUrls, getAlternateLocales } from "@/config/seo";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnalyticsProvider } from "@/lib/analytics";

import "../globals.css";
import Chat from "@/components/layout/Chat";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-arabic",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const typedLocale = locale as Locale;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("siteName"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("siteDescription"),
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: getCanonicalUrl("", typedLocale),
      languages: getAlternateUrls(""),
    },
    openGraph: {
      type: "website",
      locale: typedLocale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: getAlternateLocales(typedLocale),
      url: siteConfig.url,
      siteName: t("siteName"),
      title: t("siteName"),
      description: t("siteDescription"),
      images: [
        {
          url: `${siteConfig.url}/assets/logo-light.png`,
          width: 512,
          height: 512,
          alt: t("siteName"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("siteName"),
      description: t("siteDescription"),
      images: [`${siteConfig.url}/assets/logo-light.png`],
      creator: siteConfig.social.twitter,
    },
    icons: {
      icon: [
        { url: "/assets/favicon.ico", sizes: "48x48", type: "image/x-icon" },
        { url: "/assets/favicon.svg", type: "image/svg+xml" },
        { url: "/assets/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
      shortcut: "/assets/favicon.ico",
      apple: [
        {
          url: "/assets/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      other: [
        {
          rel: "icon",
          url: "/assets/web-app-manifest-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          rel: "icon",
          url: "/assets/web-app-manifest-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
    { media: "(prefers-color-scheme: dark)", color: "#34d399" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Get messages for client components
  const messages = await getMessages();

  const { direction } = localeMetadata[locale as Locale];
  const isRTL = direction === "rtl";

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className={`${inter.variable} ${ibmPlexArabic.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
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
          <Header locale={locale as Locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale as Locale} />
          <Chat />
        </NextIntlClientProvider>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
