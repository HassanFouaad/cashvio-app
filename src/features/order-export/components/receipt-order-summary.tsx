"use client";

import { useTranslations } from "next-intl";
import type {
  FulfillmentMethod,
  FulfillmentStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "../types";

interface ReceiptOrderSummaryProps {
  orderNumber: string;
  orderDate: string;
  status: OrderStatus;
  fulfillmentMethod: FulfillmentMethod;
  fulfillmentStatus: FulfillmentStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentOption?: string;
  customerName?: string;
  customerPhone?: string;
  completedAt?: string;
}

export function ReceiptOrderSummary({
  orderNumber,
  orderDate,
  status,
  fulfillmentMethod,
  fulfillmentStatus,
  paymentStatus,
  paymentMethod,
  paymentOption,
  customerName,
  customerPhone,
  completedAt,
}: ReceiptOrderSummaryProps) {
  const t = useTranslations("receipt");
  const tOrderStatus = useTranslations("orderStatus");
  const tPaymentStatus = useTranslations("paymentStatus");
  const tPaymentMethod = useTranslations("paymentMethod");
  const tFulfillmentMethod = useTranslations("fulfillmentMethod");
  const tFulfillmentStatus = useTranslations("fulfillmentStatus");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Order Number & Date */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <div>
          <p className="text-sm text-muted-foreground">{t("orderNumber")}</p>
          <p className="text-lg font-semibold text-foreground">#{orderNumber}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-sm text-muted-foreground">{t("orderDate")}</p>
          <p className="text-sm text-foreground">{formatDate(orderDate)}</p>
        </div>
      </div>

   

      {/* Payment Status */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{t("paymentStatus")}:</span>
        <span className="font-medium text-foreground">
          {tPaymentStatus(paymentStatus)}
        </span>
      </div>

      {/* Payment Method */}
      {paymentMethod && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{t("paymentMethod")}:</span>
          <span className="font-medium text-foreground">
            {tPaymentMethod(paymentMethod)}
            {paymentOption ? ` (${paymentOption})` : ""}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{t("orderStatus")}:</span>
        <span className="font-medium text-foreground">
          {tOrderStatus(status)}
        </span>
      </div>

      {/* Fulfillment Method */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{t("fulfillmentMethod")}:</span>
        <span className="font-medium text-foreground">
          {tFulfillmentMethod(fulfillmentMethod)}
        </span>
      </div>

      {/* Fulfillment Status */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{t("fulfillmentStatus")}:</span>
        <span className="font-medium text-foreground">
          {tFulfillmentStatus(fulfillmentStatus)}
        </span>
      </div>

      {/* Customer Information */}
      {(customerName || customerPhone) && (
        <div className="pt-2 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-1">{t("customer")}</p>
          <div className="text-sm text-foreground">
            {customerName && <p className="font-medium">{customerName}</p>}
            {customerPhone && (
              <p className="text-muted-foreground" dir="ltr">
                {customerPhone}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Completed At */}
      {completedAt && (
        <div className="text-sm">
          <span className="text-muted-foreground">{t("completedAt")}:</span>{" "}
          <span className="text-foreground">{formatDate(completedAt)}</span>
        </div>
      )}
    </div>
  );
}
