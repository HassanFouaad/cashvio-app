'use client';

import * as React from 'react';
import JsBarcode from 'jsbarcode';
import { useTranslations } from 'next-intl';

import { trackButtonClick } from '@/lib/analytics';
import { cn } from '@/lib/utils';

type BarcodeFormat = 'CODE128' | 'EAN13';

const BARCODE_FORMATS: BarcodeFormat[] = ['CODE128', 'EAN13'];
const DEFAULT_VALUE = 'CASHVIO-001';

/** EAN-13 check digit for a 12-digit payload */
function computeEan13CheckDigit(digits: string): number {
  const sum = digits
    .split('')
    .reduce((acc, digit, index) => acc + Number(digit) * (index % 2 === 0 ? 1 : 3), 0);
  return (10 - (sum % 10)) % 10;
}

/**
 * Normalize user input for EAN-13: accept 12 digits (check digit computed)
 * or 13 digits with a valid check digit. Returns null when invalid.
 */
function normalizeEan13(value: string): string | null {
  if (!/^\d{12,13}$/.test(value)) return null;

  const payload = value.slice(0, 12);
  const checkDigit = computeEan13CheckDigit(payload);

  if (value.length === 13 && Number(value[12]) !== checkDigit) return null;
  return `${payload}${checkDigit}`;
}

/**
 * Free barcode generator: live SVG preview + PNG download.
 * Barcodes are always rendered black-on-white so they print and scan
 * correctly regardless of the site theme.
 */
export function BarcodeGeneratorTool() {
  const t = useTranslations('barcodeGenerator.tool');

  const [value, setValue] = React.useState(DEFAULT_VALUE);
  const [format, setFormat] = React.useState<BarcodeFormat>('CODE128');
  const [error, setError] = React.useState(false);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const barcodeValue = React.useMemo(() => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (format === 'EAN13') return normalizeEan13(trimmed);
    return trimmed;
  }, [value, format]);

  React.useEffect(() => {
    if (!svgRef.current) return;

    if (!barcodeValue) {
      setError(value.trim().length > 0);
      svgRef.current.innerHTML = '';
      return;
    }

    try {
      JsBarcode(svgRef.current, barcodeValue, {
        format,
        lineColor: '#000000',
        background: '#ffffff',
        width: 2,
        height: 90,
        displayValue: true,
        font: 'monospace',
        fontSize: 16,
        margin: 12,
      });
      setError(false);
    } catch {
      setError(true);
      svgRef.current.innerHTML = '';
    }
  }, [barcodeValue, format, value]);

  const handleDownload = () => {
    if (!barcodeValue) return;

    const canvas = document.createElement('canvas');
    try {
      JsBarcode(canvas, barcodeValue, {
        format,
        lineColor: '#000000',
        background: '#ffffff',
        width: 4,
        height: 180,
        displayValue: true,
        font: 'monospace',
        fontSize: 32,
        margin: 24,
      });
    } catch {
      return;
    }

    const link = document.createElement('a');
    link.download = `barcode-${barcodeValue}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    trackButtonClick('barcode_download', 'barcode_generator_tool');
  };

  return (
    <div className="receipt-edge bg-card px-6 py-8 sm:px-8 max-w-2xl mx-auto">
      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="barcode-value" className="block mono-label text-muted-foreground">
            {t('valueLabel')}
          </label>
          <input
            id="barcode-value"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={64}
            className="paper-input"
            placeholder={t('valuePlaceholder')}
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="barcode-format" className="block mono-label text-muted-foreground">
            {t('formatLabel')}
          </label>
          <div className="relative">
            <select
              id="barcode-format"
              value={format}
              onChange={(e) => setFormat(e.target.value as BarcodeFormat)}
              className="paper-input appearance-none cursor-pointer pe-8"
            >
              {BARCODE_FORMATS.map((option) => (
                <option key={option} value={option}>
                  {t(`formats.${option}`)}
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
          {format === 'EAN13' && (
            <p className="font-receipt text-xs text-muted-foreground">{t('ean13Hint')}</p>
          )}
        </div>

        {/* Preview — forced white so the barcode is always scannable */}
        <div className="rounded-lg bg-white border border-dashed border-ledger-line p-4 min-h-36 flex items-center justify-center overflow-x-auto">
          {error ? (
            <p className="font-receipt text-sm text-destructive" role="alert">
              {t('invalidValue')}
            </p>
          ) : (
            <svg ref={svgRef} role="img" aria-label={t('previewAlt')} />
          )}
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={!barcodeValue}
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
