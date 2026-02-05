"use client";

import { useTranslations } from "next-intl";
import type { OrderExportStore } from "../types";

interface ReceiptFooterProps {
  store: OrderExportStore;
}

export function ReceiptFooter({ store }: ReceiptFooterProps) {
  const t = useTranslations("receipt");

  const currentYear = new Date().getFullYear();

  return (
    <div className="text-center space-y-2 pt-4 border-t border-dashed border-border">
      {/* Footer Text from Receipt Config */}
      {store.footerText && (
        <p className="text-sm text-muted-foreground">{store.footerText}</p>
      )}

      {/* Thank You Message */}
      <p className="text-xs text-muted-foreground">{t("thankYou")}</p>

      {/* Copyright */}
      <p className="text-xs text-muted-foreground/60">
        © {currentYear} {store.name}
      </p>
    </div>
  );
}
