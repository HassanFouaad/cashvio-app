'use client';

import * as React from 'react';
import JsBarcode from 'jsbarcode';
import { useTranslations } from 'next-intl';

import { trackButtonClick } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const LABELS_PER_SHEET = 10;
const COLUMNS = 2;
const MAX_PRODUCT_NAME = 80;
const MAX_CURRENCY = 12;
const MAX_BARCODE = 64;

interface LabelItem {
  id: string;
  productName: string;
  price: string;
  currency: string;
  barcode: string;
  showBarcode: boolean;
}

function createLabelItem(overrides: Partial<LabelItem> = {}): LabelItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    productName: '',
    price: '',
    currency: 'EGP',
    barcode: '',
    showBarcode: true,
    ...overrides,
  };
}

function formatPriceDisplay(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  const value = Number(trimmed);
  if (!Number.isFinite(value)) return trimmed;
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

interface BarcodeSlotProps {
  value: string;
  previewAlt: string;
}

function BarcodeSlot({ value, previewAlt }: BarcodeSlotProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const trimmed = value.trim();

  React.useEffect(() => {
    if (!svgRef.current) return;
    if (!trimmed) {
      svgRef.current.innerHTML = '';
      return;
    }

    try {
      JsBarcode(svgRef.current, trimmed, {
        format: 'CODE128',
        lineColor: '#000000',
        background: '#ffffff',
        width: 1.2,
        height: 36,
        displayValue: true,
        font: 'monospace',
        fontSize: 10,
        margin: 4,
      });
    } catch {
      svgRef.current.innerHTML = '';
    }
  }, [trimmed]);

  if (!trimmed) return null;

  return <svg ref={svgRef} role="img" aria-label={previewAlt} className="max-w-full h-auto" />;
}

/**
 * Free printable A4 shelf-label sheet: product name, price, optional Code 128 barcode.
 * Form stays on screen; print CSS isolates `.price-tag-print-area`.
 */
export function PriceTagGeneratorTool() {
  const t = useTranslations('priceTagGenerator.tool');

  const [shopName, setShopName] = React.useState('');
  const [fillSheet, setFillSheet] = React.useState(true);
  const [labels, setLabels] = React.useState<LabelItem[]>([
    createLabelItem({
      productName: 'Sample product',
      price: '49.99',
      barcode: 'CASHVIO-001',
    }),
  ]);

  const sheetLabels = React.useMemo(() => {
    if (fillSheet) {
      const source = labels[0] ?? createLabelItem();
      return Array.from({ length: LABELS_PER_SHEET }, (_, index) => ({
        ...source,
        id: `${source.id}-copy-${index}`,
      }));
    }

    const padded = [...labels];
    while (padded.length < LABELS_PER_SHEET) {
      padded.push(createLabelItem({ id: `empty-${padded.length}`, productName: '', price: '' }));
    }
    return padded.slice(0, LABELS_PER_SHEET);
  }, [fillSheet, labels]);

  const updateLabel = (id: string, patch: Partial<LabelItem>) => {
    setLabels((prev) => prev.map((label) => (label.id === id ? { ...label, ...patch } : label)));
  };

  const addLabel = () => {
    if (labels.length >= LABELS_PER_SHEET) return;
    setLabels((prev) => [...prev, createLabelItem({ currency: prev[0]?.currency ?? 'EGP' })]);
  };

  const removeLabel = (id: string) => {
    setLabels((prev) => (prev.length <= 1 ? prev : prev.filter((label) => label.id !== id)));
  };

  const handlePrint = () => {
    trackButtonClick('price_tag_print', 'price_tag_generator_tool');
    window.print();
  };

  const editableLabels = fillSheet ? labels.slice(0, 1) : labels;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="receipt-edge bg-card px-6 py-8 sm:px-8 print:hidden">
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="price-tag-shop" className="block mono-label text-muted-foreground">
              {t('shopNameLabel')}
            </label>
            <input
              id="price-tag-shop"
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              maxLength={MAX_PRODUCT_NAME}
              className="paper-input"
              placeholder={t('shopNamePlaceholder')}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={fillSheet}
              onChange={(e) => setFillSheet(e.target.checked)}
              className="size-4 accent-primary"
            />
            <span className="font-receipt text-sm text-foreground">{t('fillSheet')}</span>
          </label>

          <div className="space-y-4">
            <p className="mono-label text-muted-foreground">{t('labelsHeading')}</p>
            {editableLabels.map((label, index) => (
              <div
                key={label.id}
                className="rounded-lg border border-dashed border-ledger-line p-4 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="mono-label text-muted-foreground">
                    {t('labelNumber', { number: String(index + 1).padStart(2, '0') })}
                  </p>
                  {!fillSheet && labels.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLabel(label.id)}
                      className="font-receipt text-xs text-destructive hover:underline"
                    >
                      {t('removeLabel')}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <label
                      htmlFor={`product-${label.id}`}
                      className="block mono-label text-muted-foreground"
                    >
                      {t('productNameLabel')}
                    </label>
                    <input
                      id={`product-${label.id}`}
                      type="text"
                      value={label.productName}
                      onChange={(e) => updateLabel(label.id, { productName: e.target.value })}
                      maxLength={MAX_PRODUCT_NAME}
                      className="paper-input"
                      placeholder={t('productNamePlaceholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor={`price-${label.id}`}
                      className="block mono-label text-muted-foreground"
                    >
                      {t('priceLabel')}
                    </label>
                    <input
                      id={`price-${label.id}`}
                      type="text"
                      inputMode="decimal"
                      value={label.price}
                      onChange={(e) => updateLabel(label.id, { price: e.target.value })}
                      className="paper-input"
                      placeholder="0.00"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor={`currency-${label.id}`}
                      className="block mono-label text-muted-foreground"
                    >
                      {t('currencyLabel')}
                    </label>
                    <input
                      id={`currency-${label.id}`}
                      type="text"
                      value={label.currency}
                      onChange={(e) => updateLabel(label.id, { currency: e.target.value })}
                      maxLength={MAX_CURRENCY}
                      className="paper-input"
                      placeholder="EGP"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer select-none mb-2">
                      <input
                        type="checkbox"
                        checked={label.showBarcode}
                        onChange={(e) =>
                          updateLabel(label.id, { showBarcode: e.target.checked })
                        }
                        className="size-4 accent-primary"
                      />
                      <span className="font-receipt text-sm text-foreground">
                        {t('showBarcode')}
                      </span>
                    </label>
                    {label.showBarcode && (
                      <>
                        <label
                          htmlFor={`barcode-${label.id}`}
                          className="block mono-label text-muted-foreground"
                        >
                          {t('barcodeLabel')}
                        </label>
                        <input
                          id={`barcode-${label.id}`}
                          type="text"
                          value={label.barcode}
                          onChange={(e) => updateLabel(label.id, { barcode: e.target.value })}
                          maxLength={MAX_BARCODE}
                          className="paper-input"
                          placeholder={t('barcodePlaceholder')}
                          dir="ltr"
                        />
                        <p className="font-receipt text-xs text-muted-foreground mt-1">
                          {t('barcodeHint')}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!fillSheet && labels.length < LABELS_PER_SHEET && (
            <button
              type="button"
              onClick={addLabel}
              className={cn(
                'w-full h-11 px-4 rounded-lg text-sm font-medium',
                'border border-dashed border-ledger-line text-muted-foreground',
                'hover:text-foreground transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary/30'
              )}
            >
              {t('addLabel')}
            </button>
          )}

          <p className="font-receipt text-xs text-muted-foreground">{t('sheetHint')}</p>

          <button
            type="button"
            onClick={handlePrint}
            className={cn(
              'w-full h-12 px-6 rounded-lg font-semibold text-primary-foreground',
              'bg-primary hover:bg-primary-dark transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2'
            )}
          >
            {t('print')}
          </button>
        </div>
      </div>

      <div className="price-tag-print-area bg-white text-black p-4 sm:p-6">
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}
        >
          {sheetLabels.map((label) => {
            const priceText = formatPriceDisplay(label.price);
            const currency = label.currency.trim();
            const name = label.productName.trim();
            const isEmpty = !name && !priceText;

            return (
              <div
                key={label.id}
                className="border border-dashed border-black rounded-md p-3 flex flex-col items-center justify-between min-h-40 text-center break-inside-avoid"
              >
                {shopName.trim() && (
                  <p className="mono-label text-black text-[10px] mb-1 truncate w-full">
                    {shopName.trim()}
                  </p>
                )}
                <p className="font-display text-sm sm:text-base text-black leading-snug line-clamp-2 w-full">
                  {isEmpty ? t('emptyLabel') : name || t('untitledProduct')}
                </p>
                <p className="font-receipt text-2xl sm:text-3xl font-semibold text-black mt-2" dir="ltr">
                  {priceText ? (
                    <>
                      {priceText}
                      {currency ? (
                        <span className="text-base ms-1 font-normal">{currency}</span>
                      ) : null}
                    </>
                  ) : (
                    '-'
                  )}
                </p>
                {label.showBarcode && label.barcode.trim() ? (
                  <div className="mt-2 w-full flex justify-center overflow-hidden">
                    <BarcodeSlot value={label.barcode} previewAlt={t('barcodePreviewAlt')} />
                  </div>
                ) : (
                  <div className="mt-2 h-2" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
