"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { OrderExportData } from "../types";
import { ReceiptDeliveryAddress } from "./receipt-delivery-address";
import { ReceiptFooter } from "./receipt-footer";
import { ReceiptHeader } from "./receipt-header";
import { ReceiptItemsList } from "./receipt-items-list";
import { ReceiptNotes } from "./receipt-notes";
import { ReceiptOrderSummary } from "./receipt-order-summary";
import { ReceiptPricing } from "./receipt-pricing";
import { ReceiptRefundsList } from "./receipt-refunds-list";

interface DigitalReceiptProps {
  order: OrderExportData;
}

export function DigitalReceipt({ order }: DigitalReceiptProps) {
  const t = useTranslations("receipt");
  const locale = useLocale();

  // Customers land here from receipt QR codes — the platform's most visited
  // public surface. Route them to the marketing home with attribution.
  const poweredByHref = `${locale === "ar" ? "/ar" : "/"}?utm_source=digital_receipt&utm_medium=referral&utm_campaign=powered_by`;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Receipt Card */}
      <div className="bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="p-6 bg-muted/30">
          <ReceiptHeader store={order.store} />
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-ledger-line" />

        {/* Order Summary Section */}
        <div className="p-6">
          <ReceiptOrderSummary
            orderNumber={order.orderNumber}
            orderDate={order.orderDate}
            status={order.status}
            fulfillmentMethod={order.fulfillmentMethod}
            fulfillmentStatus={order.fulfillmentStatus}
            paymentStatus={order.paymentStatus}
            customerName={order.customerName}
            customerPhone={order.customerPhone}
            completedAt={order.completedAt}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-border mx-6" />
        {/* Delivery Address (if applicable) */}
        {order.deliveryAddress && order.fulfillmentMethod === "DELIVERY" && (
          <>
            <div className="border-t border-border mx-6" />
            <div className="p-6">
              <ReceiptDeliveryAddress address={order.deliveryAddress} />
            </div>
          </>
        )}

        {/* Items Section */}
        <div className="p-6">
          <ReceiptItemsList items={order.items} currency={order.store.currency} />
        </div>

        {/* Divider */}
        <div className="border-t border-border mx-6" />

        {/* Pricing Section */}
        <div className="p-6">
          <ReceiptPricing
            subtotal={order.subtotal}
            totalDiscount={order.totalDiscount}
            totalTax={order.totalTax}
            serviceFees={order.serviceFees}
            deliveryFees={order.deliveryFees}
            totalAmount={order.totalAmount}
            amountRefunded={order.amountRefunded}
            currency={order.store.currency}
          />
        </div>



        {/* Order Notes (if any) */}
        {order.notes && (
          <>
            <div className="border-t border-border mx-6" />
            <div className="p-6">
              <ReceiptNotes notes={order.notes} />
            </div>
          </>
        )}

        {/* Refunds Section (if any) */}
        {order.refunds && order.refunds.length > 0 && (
          <>
            <div className="border-t border-border mx-6" />
            <div className="p-6">
              <ReceiptRefundsList
                refunds={order.refunds}
                currency={order.store.currency}
              />
            </div>
          </>
        )}

        {/* Footer Section */}
        <div className="p-6 bg-muted/30">
          <ReceiptFooter store={order.store} />
        </div>
      </div>

      {/* Powered by Cashvio — platform attribution + acquisition CTA */}
      <div className="mt-6 text-center">
        <Link
          href={poweredByHref}
          className="inline-flex flex-col items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>
            {t("poweredBy")} <span className="font-semibold">Cashvio</span>
          </span>
          <span className="underline underline-offset-2">
            {t("poweredByCta")}
          </span>
        </Link>
      </div>
    </div>
  );
}
