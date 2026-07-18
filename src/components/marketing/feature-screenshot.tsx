import { ThemedShot } from '@/components/ui/themed-shot';

interface FeatureScreenshotProps {
  /** Asset base path without locale/theme suffix, e.g. "/assets/orders". */
  base: string;
  locale: string;
  alt: string;
  /** Optional mono caption shown above the frame, e.g. "Live view — orders". */
  caption?: string;
  /** Desktop (default) or phone frame. */
  variant?: 'desktop' | 'mobile';
}

/**
 * Framed portal screenshot for feature pages. Matches the home-page
 * "product on the counter" treatment: dashed ledger caption + card border.
 */
export function FeatureScreenshot({
  base,
  locale,
  alt,
  caption,
  variant = 'desktop',
}: FeatureScreenshotProps) {
  const isMobile = variant === 'mobile';

  return (
    <section aria-label={caption || alt} className="section-padding-sm">
      <div className="container-wide">
        <div
          className={
            isMobile
              ? 'mx-auto w-full max-w-[300px]'
              : 'mx-auto w-full max-w-5xl'
          }
        >
          {isMobile ? (
            <div className="rounded-[2rem] bg-foreground p-2.5">
              <div className="rounded-[1.4rem] overflow-hidden bg-card border border-border">
                {caption && (
                  <div className="flex items-center justify-between gap-4 px-4 py-2 border-b border-dashed border-ledger-line">
                    <span className="mono-label text-muted-foreground">
                      {caption}
                    </span>
                    <span className="flex items-center gap-1.5" aria-hidden="true">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="mono-label text-primary">LIVE</span>
                    </span>
                  </div>
                )}
                <ThemedShot
                  base={base}
                  locale={locale}
                  alt={alt}
                  width={402}
                  height={874}
                  quality={92}
                  sizes="300px"
                />
              </div>
              <div
                className="w-16 h-1 rounded-full bg-background/40 mx-auto mt-2"
                aria-hidden="true"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              {caption && (
                <div className="flex items-center justify-between gap-4 px-4 py-2.5 border-b border-dashed border-ledger-line">
                  <span className="mono-label text-muted-foreground">
                    {caption}
                  </span>
                  <span className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="mono-label text-primary">LIVE</span>
                  </span>
                </div>
              )}
              <ThemedShot
                base={base}
                locale={locale}
                alt={alt}
                width={2880}
                height={1800}
                quality={95}
                sizes="(max-width: 1024px) 100vw, 1200px"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
