'use client';

import * as React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useTranslations } from 'next-intl';

import { trackButtonClick } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const SIZE_OPTIONS = [256, 512, 1024] as const;
const PREVIEW_SIZE = 220;
const MAX_CONTENT_LENGTH = 1000;
const DEFAULT_CONTENT = 'https://cash-vio.com';

/**
 * Free QR code generator: live preview + high-resolution PNG download.
 * Rendered black-on-white so codes stay scannable in print.
 */
export function QrGeneratorTool() {
  const t = useTranslations('qrCodeGenerator.tool');

  const [content, setContent] = React.useState(DEFAULT_CONTENT);
  const [size, setSize] = React.useState<number>(512);
  const downloadRef = React.useRef<HTMLDivElement>(null);

  const trimmed = content.trim();

  const handleDownload = () => {
    const canvas = downloadRef.current?.querySelector('canvas');
    if (!canvas || !trimmed) return;

    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    trackButtonClick('qr_download', 'qr_generator_tool');
  };

  return (
    <div className="receipt-edge bg-card px-6 py-8 sm:px-8 max-w-2xl mx-auto">
      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="qr-content" className="block mono-label text-muted-foreground">
            {t('contentLabel')}
          </label>
          <textarea
            id="qr-content"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={MAX_CONTENT_LENGTH}
            className="paper-input"
            placeholder={t('contentPlaceholder')}
            dir="ltr"
          />
          <p className="font-receipt text-xs text-muted-foreground">{t('contentHint')}</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="qr-size" className="block mono-label text-muted-foreground">
            {t('sizeLabel')}
          </label>
          <div className="relative">
            <select
              id="qr-size"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="paper-input appearance-none cursor-pointer pe-8"
            >
              {SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} × {option} px
                </option>
              ))}
            </select>
            <svg
              className="absolute end-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Preview — forced white so the code is always scannable */}
        <div className="rounded-lg bg-white border border-dashed border-ledger-line p-6 flex items-center justify-center">
          {trimmed ? (
            <QRCodeCanvas
              value={trimmed}
              size={PREVIEW_SIZE}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
              marginSize={2}
              aria-label={t('previewAlt')}
            />
          ) : (
            <p className="font-receipt text-sm text-muted-foreground">{t('emptyState')}</p>
          )}
        </div>

        {/* Hidden high-resolution canvas used for the PNG download */}
        <div ref={downloadRef} className="hidden" aria-hidden="true">
          {trimmed && (
            <QRCodeCanvas
              value={trimmed}
              size={size}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
              marginSize={2}
            />
          )}
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={!trimmed}
          className={cn(
            'w-full h-12 px-6 rounded-lg font-semibold text-primary-foreground',
            'bg-primary hover:bg-primary-dark transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2',
            'disabled:opacity-60 disabled:cursor-not-allowed'
          )}
        >
          {t('download')}
        </button>
      </div>
    </div>
  );
}
