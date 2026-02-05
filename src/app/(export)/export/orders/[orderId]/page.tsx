/**
 * Digital Receipt Page
 *
 * Server component that fetches and displays a digital order receipt.
 * Supports i18n and dark/light mode.
 * 
 * URL: /export/orders/[orderId]?storeId=[storeId]
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { setRequestLocale } from "next-intl/server";

import {
  DigitalReceipt,
  ReceiptError,
  ReceiptLoading,
  getOrderExportWithErrorHandling,
} from "@/features/order-export";
import { routing, type Locale } from "@/i18n/routing";

interface PageProps {
  params: Promise<{
    orderId: string;
  }>;
  searchParams: Promise<{
    storeId?: string;
  }>;
}

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

export default async function OrderExportPage({
  params,
  searchParams,
}: PageProps) {
  const { orderId } = await params;
  const { storeId } = await searchParams;
  const locale = await getLocaleFromRequest();

  setRequestLocale(locale);

  // Validate UUID format for orderId
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(orderId)) {
    notFound();
  }

  return (
    <Suspense fallback={<ReceiptLoading />}>
      <OrderReceiptContent orderId={orderId} storeId={storeId} locale={locale} />
    </Suspense>
  );
}

/**
 * Async component that fetches and renders the receipt content
 */
async function OrderReceiptContent({
  orderId,
  storeId,
  locale,
}: {
  orderId: string;
  storeId?: string;
  locale: string;
}) {
  const { order, error, errorCode } = await getOrderExportWithErrorHandling(
    orderId,
    locale,
    storeId
  );

  if (error || !order) {
    return <ReceiptError errorCode={errorCode} message={error || undefined} />;
  }

  return <DigitalReceipt order={order} />;
}
