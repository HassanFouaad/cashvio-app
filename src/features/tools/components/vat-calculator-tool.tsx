"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

type VatMode = "exclusive" | "inclusive";

/** Egypt standard VAT; editable in the UI for other rates. */
const DEFAULT_VAT_RATE = 14;

function parseNonNegativeNumber(raw: string): number | null {
  if (!raw.trim()) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

interface ResultLine {
  key: string;
  value: string;
  isTotal?: boolean;
}

/**
 * Egypt 14% VAT calculator.
 * - exclusive: amount without VAT → add VAT (net + VAT = gross)
 * - inclusive: amount with VAT → extract VAT
 *
 * Currency-agnostic plain numbers, English digits (site-wide convention).
 */
interface VatCalculatorToolProps {
  showAnswerBlock?: boolean;
}

export function VatCalculatorTool({
  showAnswerBlock = false,
}: VatCalculatorToolProps = {}) {
  const t = useTranslations("vatCalculator.tool");
  const tAnswer = useTranslations("vatCalculator.answerBlock");

  const [mode, setMode] = React.useState<VatMode>("exclusive");
  const [amount, setAmount] = React.useState("100");
  const [rate, setRate] = React.useState(String(DEFAULT_VAT_RATE));

  const amountValue = parseNonNegativeNumber(amount);
  const rateValue = parseNonNegativeNumber(rate);

  let results: ResultLine[] = [];
  let warning: string | null = null;

  if (amountValue !== null && rateValue !== null) {
    if (rateValue >= 100) {
      warning = t("rateTooHigh");
    } else {
      const factor = rateValue / 100;

      if (mode === "exclusive") {
        const net = amountValue;
        const vat = net * factor;
        const gross = net + vat;
        results = [
          { key: "net", value: formatNumber(net) },
          { key: "vat", value: formatNumber(vat) },
          { key: "gross", value: formatNumber(gross), isTotal: true },
        ];
      } else {
        const gross = amountValue;
        const net = gross / (1 + factor);
        const vat = gross - net;
        results = [
          { key: "net", value: formatNumber(net) },
          { key: "vat", value: formatNumber(vat) },
          { key: "gross", value: formatNumber(gross), isTotal: true },
        ];
      }
    }
  }

  return (
    <>
      {showAnswerBlock && (
        <div className="receipt-edge bg-card px-6 py-8 sm:px-8 max-w-3xl mx-auto mb-8">
          <p className="mono-label text-primary mb-3">{tAnswer("badge")}</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">
            {tAnswer("title")}
          </h2>
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {tAnswer("addVat.title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tAnswer("addVat.description")}
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {tAnswer("extractVat.title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tAnswer("extractVat.description")}
              </p>
            </div>
            <p className="font-receipt text-xs text-muted-foreground border-t border-dashed border-ledger-line pt-4">
              {tAnswer("defaultRate")}
            </p>
          </div>
        </div>
      )}
      <div className="receipt-edge bg-card px-6 py-8 sm:px-8 max-w-2xl mx-auto">
        <div
          className="grid grid-cols-2 gap-2 mb-6"
          role="tablist"
          aria-label={t("modeLabel")}
        >
          {(["exclusive", "inclusive"] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={mode === option}
              onClick={() => setMode(option)}
              className={cn(
                "h-11 px-3 rounded-lg text-sm font-medium transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary/30",
                mode === option
                  ? "bg-primary text-primary-foreground"
                  : "border border-dashed border-ledger-line text-muted-foreground hover:text-foreground",
              )}
            >
              {t(`modes.${option}`)}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="vat-amount"
              className="block mono-label text-muted-foreground"
            >
              {mode === "exclusive" ? t("netLabel") : t("grossLabel")}
            </label>
            <input
              id="vat-amount"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="paper-input"
              placeholder="0.00"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="vat-rate"
              className="block mono-label text-muted-foreground"
            >
              {t("rateLabel")}
            </label>
            <input
              id="vat-rate"
              type="text"
              inputMode="decimal"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="paper-input"
              placeholder={String(DEFAULT_VAT_RATE)}
              dir="ltr"
            />
            <p className="font-receipt text-xs text-muted-foreground">
              {t("rateHint")}
            </p>
          </div>

          {warning && (
            <p className="font-receipt text-xs text-destructive" role="alert">
              {warning}
            </p>
          )}

          <div className="border-t border-dashed border-ledger-line pt-5">
            {results.length > 0 ? (
              <dl className="space-y-2.5">
                {results.map((line) => (
                  <div
                    key={line.key}
                    className={cn(
                      "flex items-baseline gap-3 text-sm",
                      line.isTotal &&
                        "font-semibold border-t border-dashed border-ledger-line pt-3 mt-3",
                    )}
                  >
                    <dt
                      className={
                        line.isTotal
                          ? "text-foreground uppercase tracking-wide"
                          : "text-muted-foreground"
                      }
                    >
                      {t(`results.${line.key}`)}
                    </dt>
                    <span
                      className="tear-line flex-1 self-center"
                      aria-hidden="true"
                    />
                    <dd
                      className={cn(
                        "font-receipt",
                        line.isTotal
                          ? "text-primary text-base"
                          : "text-foreground",
                      )}
                      dir="ltr"
                    >
                      {line.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="font-receipt text-sm text-muted-foreground text-center">
                {t("emptyState")}
              </p>
            )}
          </div>

          <p className="font-receipt text-xs text-muted-foreground border-t border-dashed border-ledger-line pt-4">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </>
  );
}
