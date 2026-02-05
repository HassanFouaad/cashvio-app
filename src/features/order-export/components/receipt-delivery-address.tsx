"use client";

import { useTranslations } from "next-intl";
import type { OrderExportDeliveryAddress } from "../types";

interface ReceiptDeliveryAddressProps {
  address: OrderExportDeliveryAddress;
}

export function ReceiptDeliveryAddress({ address }: ReceiptDeliveryAddressProps) {
  const t = useTranslations("receipt");

  const buildAddressString = () => {
    const parts: string[] = [];

    if (address.building) parts.push(`${t("building")} ${address.building}`);
    if (address.floor) parts.push(`${t("floor")} ${address.floor}`);
    if (address.apartment) parts.push(`${t("apartment")} ${address.apartment}`);
    if (address.street) parts.push(address.street);
    if (address.region) parts.push(address.region);
    if (address.cityName) parts.push(address.cityName);
    if (address.countryName) parts.push(address.countryName);
    if (address.zip) parts.push(address.zip);

    return parts.join(", ");
  };

  const addressString = buildAddressString();

  return (
    <div className="space-y-2">
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
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
        <h3 className="font-semibold text-foreground">{t("deliveryAddress")}</h3>
      </div>

      <div className="text-sm text-muted-foreground space-y-1 ps-6">
        {addressString && <p>{addressString}</p>}

        {address.contactPhone && (
          <p>
            <span className="font-medium">{t("contactPhone")}:</span>{" "}
            <a
              href={`tel:${address.contactPhone}`}
              className="hover:text-primary transition-colors"
              dir="ltr"
            >
              {address.contactPhone}
            </a>
          </p>
        )}

        {address.additionalDetails && (
          <p className="italic text-xs">
            <span className="font-medium">{t("notes")}:</span>{" "}
            {address.additionalDetails}
          </p>
        )}
      </div>
    </div>
  );
}
