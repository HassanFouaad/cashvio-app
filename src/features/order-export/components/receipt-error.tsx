"use client";

import { useTranslations } from "next-intl";

interface ReceiptErrorProps {
  errorCode?: string;
  message?: string;
}

export function ReceiptError({
  errorCode = "UNKNOWN_ERROR",
  message,
}: ReceiptErrorProps) {
  const t = useTranslations("receipt");

  const getErrorMessage = () => {
    if (message) return message;

    switch (errorCode) {
      case "ORDER_NOT_FOUND":
        return t("errors.orderNotFound");
      case "INVALID_STORE":
        return t("errors.invalidStore");
      case "FETCH_ERROR":
        return t("errors.fetchError");
      default:
        return t("errors.unknown");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card text-card-foreground rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-foreground mb-2">
          {t("errors.title")}
        </h2>

        <p className="text-sm text-muted-foreground mb-6">{getErrorMessage()}</p>

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          {t("errors.goBack")}
        </button>
      </div>
    </div>
  );
}
