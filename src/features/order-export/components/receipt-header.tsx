"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import type { OrderExportStore } from "../types";

interface ReceiptHeaderProps {
  store: OrderExportStore;
}

export function ReceiptHeader({ store }: ReceiptHeaderProps) {
  const t = useTranslations("receipt");

  return (
    <div className="text-center space-y-3">
      {/* Store Logo */}
      {store.showLogo && store.receiptLogoUrl && (
        <div className="flex justify-center">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted">
            <Image
              src={store.receiptLogoUrl}
              alt={store.name}
              fill
              className="object-contain p-2"
              sizes="80px"
            />
          </div>
        </div>
      )}

      {/* Store Name */}
      <h1 className="text-xl font-bold text-foreground">{store.name}</h1>

      {/* Header Text */}
      {store.showHeader && store.headerText && (
        <p className="text-sm text-muted-foreground">{store.headerText}</p>
      )}

      {/* Contact Information */}
      <div className="text-sm text-muted-foreground space-y-1">
        {store.showStorePhone && store.contactPhone && (
          <p>
            <span className="font-medium">{t("phone")}:</span>{" "}
            <a
              href={`tel:${store.contactPhone}`}
              className="hover:text-primary transition-colors"
              dir="ltr"
            >
              {store.contactPhone}
            </a>
          </p>
        )}
        {store.contactEmail && (
          <p>
            <span className="font-medium">{t("email")}:</span>{" "}
            <a
              href={`mailto:${store.contactEmail}`}
              className="hover:text-primary transition-colors"
            >
              {store.contactEmail}
            </a>
          </p>
        )}
        {store.showStoreAddress && store.addressLine1 && (
          <p className="text-xs">
            {store.addressLine1}
            {store.addressLine2 && `, ${store.addressLine2}`}
          </p>
        )}
      </div>
    </div>
  );
}
