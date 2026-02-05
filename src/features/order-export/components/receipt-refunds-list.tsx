"use client";

import { useTranslations } from "next-intl";
import type { OrderExportRefund } from "../types";

interface ReceiptRefundsListProps {
  refunds: OrderExportRefund[];
  currency: string;
}

export function ReceiptRefundsList({ refunds, currency }: ReceiptRefundsListProps) {
  const t = useTranslations("receipt");
  const tRefundStatus = useTranslations("refundStatus");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRefundStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "APPROVED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  if (!refunds.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        <h3 className="font-semibold text-foreground">{t("refunds")}</h3>
      </div>

      <div className="space-y-2">
        {refunds.map((refund, index) => (
          <div
            key={index}
            className="p-3 bg-muted/50 rounded-lg space-y-2 text-sm"
          >
            <div className="flex justify-between items-center">
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRefundStatusColor(refund.status)}`}
              >
                {tRefundStatus(refund.status)}
              </span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(refund.refundedAmount)}
              </span>
            </div>

            {refund.reason && (
              <p className="text-muted-foreground">
                <span className="font-medium">{t("reason")}:</span> {refund.reason}
              </p>
            )}

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {t("createdAt")}: {formatDate(refund.createdAt)}
              </span>
              {refund.processedAt && (
                <span>
                  {t("processedAt")}: {formatDate(refund.processedAt)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
