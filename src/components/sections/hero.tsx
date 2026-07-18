import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { ButtonLink } from "@/components/ui/button";
import { ReceiptStamp, SalesTicker } from "@/components/marketing";

interface HeroProps {
  locale: Locale;
}

interface HeroReceiptItem {
  name: string;
  value: string;
}

export async function Hero({ locale }: HeroProps) {
  const t = await getTranslations({ locale, namespace: "home.hero" });
  const featuresLink = locale === "en" ? "/features" : "/ar/features";
  const registerLink = locale === "en" ? "/register" : "/ar/register";
  const receiptItems = t.raw("receipt.items") as HeroReceiptItem[];

  return (
    <section aria-label="Hero" className="overflow-hidden">
      <div className="ledger-rules">
        <div className="container-wide pt-14 sm:pt-16 md:pt-20 pb-12 sm:pb-16">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
            {/* Headline column */}
            <div>
              <div className="animate-fade-up flex items-center gap-4 mb-5">
                <span className="mono-label text-primary shrink-0">
                  {t("eyebrow")}
                </span>
                <span className="tear-line flex-1" aria-hidden="true" />
              </div>

              <h1 className="animate-fade-up text-4xl sm:text-5xl md:text-[3.5rem] font-semibold tracking-tight text-foreground mb-5 leading-[1.08]">
                {t("title")}{" "}
                <span className="text-primary">{t("titleHighlight")}</span>
              </h1>

              <p className="animate-fade-up animate-delay-100 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
                {t("subtitle")}
              </p>

              <div className="animate-fade-up animate-delay-200 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <ButtonLink
                    size="lg"
                    href={registerLink}
                    className="w-full sm:w-auto"
                  >
                    {t("cta")}
                  </ButtonLink>
                  <ButtonLink
                    variant="outline"
                    size="lg"
                    href={featuresLink}
                    className="w-full sm:w-auto"
                  >
                    {t("secondaryCta")}
                  </ButtonLink>
                </div>
                <ReceiptStamp className="self-center sm:ms-2">
                  {t("freeBadge")}
                </ReceiptStamp>
              </div>

              <p className="animate-fade-up animate-delay-300 mt-6 font-receipt text-xs sm:text-sm text-muted-foreground">
                {t("freeNote")}
              </p>
            </div>

            {/* Receipt printing out of the counter printer */}
            <div
              className="relative mx-auto w-full max-w-[340px]"
              aria-hidden="true"
            >
              <div className="relative z-10 h-7 rounded-lg bg-foreground flex items-center justify-center">
                <div className="w-3/4 h-1 rounded-full bg-background/50" />
              </div>
              <div className="overflow-hidden px-4">
                <div className="animate-print-out receipt-edge-bottom bg-card px-5 pt-6 pb-7 font-receipt text-[13px] leading-relaxed">
                  <p className="text-center text-foreground font-semibold tracking-[0.18em] text-xs uppercase">
                    {t("receipt.title")}
                  </p>
                  <p className="text-center text-muted-foreground text-[11px] mt-1">
                    {t("receipt.number")}
                  </p>

                  <div className="tear-line my-4" />

                  <ul className="space-y-2">
                    {Array.isArray(receiptItems) &&
                      receiptItems?.map((item) => (
                        <li
                          key={item.name}
                          className="flex items-baseline gap-2"
                        >
                          <span className="text-foreground">{item.name}</span>
                          <span className="tear-line flex-1 self-center" />
                          <span className="text-muted-foreground">
                            {item.value}
                          </span>
                        </li>
                      ))}
                  </ul>

                  <div className="border-t border-dashed border-ledger-line mt-4 pt-3 flex items-baseline justify-between font-semibold">
                    <span className="uppercase tracking-wide text-foreground">
                      {t("receipt.totalLabel")}
                    </span>
                    <span className="text-primary">
                      {t("receipt.totalValue")}
                    </span>
                  </div>

                  <div className="mt-5 flex justify-center">
                    <ReceiptStamp>{t("receipt.stamp")}</ReceiptStamp>
                  </div>

                  <p className="text-center text-[11px] text-muted-foreground mt-5">
                    {t("receipt.thanks")}
                  </p>
                  <div className="barcode w-32 mx-auto mt-4 text-foreground/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The real product on the counter */}
      <div className="container-wide">
        <div className="animate-fade-up animate-delay-300 max-w-5xl mx-auto">
          <div className="rounded-t-xl border border-b-0 border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-4 py-2.5 border-b border-dashed border-ledger-line">
              <span className="mono-label text-muted-foreground">
                {t("screenCaption")}
              </span>
              <span className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="mono-label text-primary">{t("live")}</span>
              </span>
            </div>
            <Image
              src="/assets/portal.png"
              alt={t("imageAlt")}
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
              quality={90}
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>
      </div>

      {/* Simulated register feed running across the seam */}
      <SalesTicker />
    </section>
  );
}
