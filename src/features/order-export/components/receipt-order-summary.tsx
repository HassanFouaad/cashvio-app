"use client";

import { useTranslations } from "next-intl";
import type {
  FulfillmentMethod,
  FulfillmentStatus,
  OrderStatus,
  PaymentStatus,
} from "../types";

interface ReceiptOrderSummaryProps {
  orderNumber: string;
  orderDate: string;
  status: OrderStatus;
  fulfillmentMethod: FulfillmentMethod;
  fulfillmentStatus: FulfillmentStatus;
  paymentStatus: PaymentStatus;
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
  customerName,
  customerPhone,
  completedAt,
}: ReceiptOrderSummaryProps) {
  const t = useTranslations("receipt");
  const tOrderStatus = useTranslations("orderStatus");
  const tPaymentStatus = useTranslations("paymentStatus");
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

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "REFUNDED":
      case "PARTIALLY_REFUNDED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
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
