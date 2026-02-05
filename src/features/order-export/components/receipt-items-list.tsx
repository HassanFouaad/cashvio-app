"use client";

import { useTranslations } from "next-intl";
import type { OrderExportItem } from "../types";

interface ReceiptItemsListProps {
  items: OrderExportItem[];
  currency: string;
}

export function ReceiptItemsList({ items, currency }: ReceiptItemsListProps) {
  const t = useTranslations("receipt");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">{t("items")}</h3>
        <span className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 pb-3 border-b border-border/50 last:border-0 last:pb-0"
          >
            {/* Product Name & Quantity */}
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {item.productName}
                </p>
                {item.variantName && (
                  <p className="text-xs text-muted-foreground">
                    {item.variantName}
                  </p>
                )}
                {item.productSku && (
                  <p className="text-xs text-muted-foreground">
                    SKU: {item.productSku}
                  </p>
                )}
              </div>
              <span className="text-sm text-muted-foreground shrink-0">
                ×{item.quantity}
              </span>
            </div>

            {/* Variant Attributes */}
            {item.variantAttributes &&
              Object.keys(item.variantAttributes).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {Object.entries(item.variantAttributes).map(([key, value]) => (
                    <span
                      key={key}
                      className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
                    >
                      {key}: {value}
                    </span>
                  ))}
                </div>
              )}

            {/* Price Details */}
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-muted-foreground">
                {formatCurrency(item.unitPrice)} × {item.quantity}
              </span>
              <span className="font-medium text-foreground">
                {formatCurrency(item.lineTotal)}
              </span>
            </div>

            {/* Line Discount (if any) */}
            {item.lineDiscount > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-600 dark:text-emerald-400">
                  {t("discount")}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  -{formatCurrency(item.lineDiscount)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
