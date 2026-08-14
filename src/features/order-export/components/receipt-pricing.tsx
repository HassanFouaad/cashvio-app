"use client";

import { useTranslations } from "next-intl";
import type { OrderExportPayment, PaymentMethod } from "../types";

interface ReceiptPricingProps {
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  serviceFees: number;
  deliveryFees: number;
  totalAmount: number;
  amountPaid?: number;
  amountDue?: number;
  changeGiven?: number;
  amountRefunded: number;
  currency: string;
  payments?: OrderExportPayment[];
  paymentMethod?: PaymentMethod;
  paymentOption?: string;
}

export function ReceiptPricing({
  subtotal,
  totalDiscount,
  totalTax,
  serviceFees,
  deliveryFees,
  totalAmount,
  amountPaid,
  amountDue,
  changeGiven,
  amountRefunded,
  currency,
  payments,
  paymentMethod,
  paymentOption,
}: ReceiptPricingProps) {
  const t = useTranslations("receipt");
  const tPaymentMethod = useTranslations("paymentMethod");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const netTotal = totalAmount - amountRefunded;

  return (
    <div className="space-y-2">
      {/* Subtotal */}
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{t("subtotal")}</span>
        <span className="text-foreground">{formatCurrency(subtotal)}</span>
      </div>

      {/* Discount */}
      {totalDiscount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-emerald-600 dark:text-emerald-400">
            {t("discount")}
          </span>
          <span className="text-emerald-600 dark:text-emerald-400">
            -{formatCurrency(totalDiscount)}
          </span>
        </div>
      )}

      {/* Tax */}
      {totalTax > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("tax")}</span>
          <span className="text-foreground">{formatCurrency(totalTax)}</span>
        </div>
      )}

      {/* Service Fees */}
      {serviceFees > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("serviceFees")}</span>
          <span className="text-foreground">{formatCurrency(serviceFees)}</span>
        </div>
      )}

      {/* Delivery Fees */}
      {deliveryFees > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("deliveryFees")}</span>
          <span className="text-foreground">{formatCurrency(deliveryFees)}</span>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between pt-2 border-t border-border">
        <span className="font-semibold text-foreground">{t("total")}</span>
        <span className="font-semibold text-foreground text-lg">
          {formatCurrency(totalAmount)}
        </span>
      </div>

      {/* Paid */}
      {amountPaid !== undefined && amountPaid > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("paid")}</span>
          <span className="text-foreground">{formatCurrency(amountPaid)}</span>
        </div>
      )}

      {/* Split payments if any */}
      {payments && payments.length > 1 && (
        <div className="space-y-1 ps-3 border-s-2 border-border text-xs text-muted-foreground">
          {payments.map((p, idx) => (
            <div key={idx} className="flex justify-between">
              <span>
                {tPaymentMethod(p.paymentMethod)}
                {p.paymentOption ? ` (${p.paymentOption})` : ""}
              </span>
              <span>{formatCurrency(p.amount)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Amount Due */}
      {amountDue !== undefined && amountDue > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("due")}</span>
          <span className="text-foreground">{formatCurrency(amountDue)}</span>
        </div>
      )}

      {/* Change */}
      {changeGiven !== undefined && changeGiven > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("change")}</span>
          <span className="text-foreground">{formatCurrency(changeGiven)}</span>
        </div>
      )}

      {/* Refunded Amount */}
      {amountRefunded > 0 && (
        <>
          <div className="flex justify-between text-sm">
            <span className="text-red-600 dark:text-red-400">{t("refunded")}</span>
            <span className="text-red-600 dark:text-red-400">
              -{formatCurrency(amountRefunded)}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-semibold text-foreground">{t("netTotal")}</span>
            <span className="font-semibold text-foreground text-lg">
              {formatCurrency(netTotal)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
