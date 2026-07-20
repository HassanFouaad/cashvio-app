'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { trackButtonClick } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const DEFAULT_VAT_RATE = 14;
const MAX_LINE_ITEMS = 20;

interface LineItem {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
}

function parseNonNegativeNumber(raw: string): number | null {
  if (!raw.trim()) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function formatNumber(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function createLineItem(): LineItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    description: '',
    quantity: '1',
    unitPrice: '',
  };
}

function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Free printable bilingual invoice / receipt maker.
 * Form stays on screen; print CSS isolates `.invoice-print-area`.
 */
export function InvoiceGeneratorTool() {
  const t = useTranslations('invoiceGenerator.tool');
  const locale = useLocale();

  const [businessName, setBusinessName] = React.useState('');
  const [businessPhone, setBusinessPhone] = React.useState('');
  const [businessAddress, setBusinessAddress] = React.useState('');
  const [customerName, setCustomerName] = React.useState('');
  const [invoiceNumber, setInvoiceNumber] = React.useState('INV-001');
  const [invoiceDate, setInvoiceDate] = React.useState(todayIsoDate);
  const [notes, setNotes] = React.useState('');
  const [includeVat, setIncludeVat] = React.useState(true);
  const [vatRate, setVatRate] = React.useState(String(DEFAULT_VAT_RATE));
  const [lines, setLines] = React.useState<LineItem[]>([createLineItem()]);

  const computedLines = lines.map((line) => {
    const quantity = parseNonNegativeNumber(line.quantity) ?? 0;
    const unitPrice = parseNonNegativeNumber(line.unitPrice) ?? 0;
    return {
      ...line,
      quantity,
      unitPrice,
      lineTotal: quantity * unitPrice,
    };
  });

  const vatRateValue = parseNonNegativeNumber(vatRate);
  const effectiveVatRate =
    vatRateValue !== null && vatRateValue < 100 ? vatRateValue : DEFAULT_VAT_RATE;

  const subtotal = computedLines.reduce((sum, line) => sum + line.lineTotal, 0);
  const vatAmount = includeVat ? subtotal * (effectiveVatRate / 100) : 0;
  const total = subtotal + vatAmount;
  const hasAnyLine = computedLines.some(
    (line) => line.description.trim() || line.unitPrice > 0
  );

  const updateLine = (id: string, patch: Partial<LineItem>) => {
    setLines((prev) => prev.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  };

  const addLine = () => {
    if (lines.length >= MAX_LINE_ITEMS) return;
    setLines((prev) => [...prev, createLineItem()]);
  };

  const removeLine = (id: string) => {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((line) => line.id !== id)));
  };

  const handlePrint = () => {
    trackButtonClick('invoice_print', 'invoice_generator_tool');
    window.print();
  };

  const formattedDate = (() => {
    const parsed = new Date(`${invoiceDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return invoiceDate;
    return parsed.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  })();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="receipt-edge bg-card px-6 py-8 sm:px-8 print:hidden">
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="inv-business" className="block mono-label text-muted-foreground">
                {t('businessNameLabel')}
              </label>
              <input
                id="inv-business"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="paper-input"
                placeholder={t('businessNamePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="inv-phone" className="block mono-label text-muted-foreground">
                {t('businessPhoneLabel')}
              </label>
              <input
                id="inv-phone"
                type="text"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                className="paper-input"
                placeholder={t('businessPhonePlaceholder')}
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="inv-address" className="block mono-label text-muted-foreground">
              {t('businessAddressLabel')}
            </label>
            <input
              id="inv-address"
              type="text"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              className="paper-input"
              placeholder={t('businessAddressPlaceholder')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label htmlFor="inv-customer" className="block mono-label text-muted-foreground">
                {t('customerNameLabel')}
              </label>
              <input
                id="inv-customer"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="paper-input"
                placeholder={t('customerNamePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="inv-number" className="block mono-label text-muted-foreground">
                {t('invoiceNumberLabel')}
              </label>
              <input
                id="inv-number"
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="paper-input"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="inv-date" className="block mono-label text-muted-foreground">
                {t('dateLabel')}
              </label>
              <input
                id="inv-date"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="paper-input"
                dir="ltr"
              />
            </div>
          </div>

          <div className="border-t border-dashed border-ledger-line pt-5 space-y-4">
            <p className="mono-label text-muted-foreground">{t('itemsLabel')}</p>
            {lines.map((line, index) => (
              <div
                key={line.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_5rem_7rem_auto] gap-3 items-end"
              >
                <div className="space-y-2">
                  <label
                    htmlFor={`inv-desc-${line.id}`}
                    className="block mono-label text-muted-foreground sm:sr-only"
                  >
                    {t('descriptionLabel')}
                  </label>
                  <input
                    id={`inv-desc-${line.id}`}
                    type="text"
                    value={line.description}
                    onChange={(e) => updateLine(line.id, { description: e.target.value })}
                    className="paper-input"
                    placeholder={`${t('descriptionPlaceholder')} ${index + 1}`}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor={`inv-qty-${line.id}`}
                    className="block mono-label text-muted-foreground"
                  >
                    {t('quantityLabel')}
                  </label>
                  <input
                    id={`inv-qty-${line.id}`}
                    type="text"
                    inputMode="decimal"
                    value={line.quantity}
                    onChange={(e) => updateLine(line.id, { quantity: e.target.value })}
                    className="paper-input"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor={`inv-price-${line.id}`}
                    className="block mono-label text-muted-foreground"
                  >
                    {t('unitPriceLabel')}
                  </label>
                  <input
                    id={`inv-price-${line.id}`}
                    type="text"
                    inputMode="decimal"
                    value={line.unitPrice}
                    onChange={(e) => updateLine(line.id, { unitPrice: e.target.value })}
                    className="paper-input"
                    placeholder="0.00"
                    dir="ltr"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  disabled={lines.length <= 1}
                  className={cn(
                    'h-11 px-3 rounded-lg text-sm border border-dashed border-ledger-line',
                    'text-muted-foreground hover:text-destructive disabled:opacity-40',
                    'focus:outline-none focus:ring-2 focus:ring-primary/30'
                  )}
                  aria-label={t('removeItem')}
                >
                  {t('removeItem')}
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addLine}
              disabled={lines.length >= MAX_LINE_ITEMS}
              className={cn(
                'h-11 px-4 rounded-lg text-sm font-medium border border-dashed border-ledger-line',
                'text-muted-foreground hover:text-foreground disabled:opacity-40',
                'focus:outline-none focus:ring-2 focus:ring-primary/30'
              )}
            >
              {t('addItem')}
            </button>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeVat}
                onChange={(e) => setIncludeVat(e.target.checked)}
                className="size-4 accent-primary"
              />
              <span className="font-receipt text-sm text-foreground">{t('includeVat')}</span>
            </label>

            {includeVat && (
              <div className="space-y-2">
                <label htmlFor="inv-vat-rate" className="block mono-label text-muted-foreground">
                  {t('rateLabel')}
                </label>
                <input
                  id="inv-vat-rate"
                  type="text"
                  inputMode="decimal"
                  value={vatRate}
                  onChange={(e) => setVatRate(e.target.value)}
                  className="paper-input max-w-[10rem]"
                  placeholder={String(DEFAULT_VAT_RATE)}
                  dir="ltr"
                />
                <p className="font-receipt text-xs text-muted-foreground">{t('rateHint')}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="inv-notes" className="block mono-label text-muted-foreground">
              {t('notesLabel')}
            </label>
            <textarea
              id="inv-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="paper-input"
              rows={2}
              placeholder={t('notesPlaceholder')}
            />
          </div>

          <button
            type="button"
            onClick={handlePrint}
            disabled={!businessName.trim() || !hasAnyLine}
            className={cn(
              'w-full h-12 rounded-lg text-sm font-medium transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary/30',
              'bg-primary text-primary-foreground hover:opacity-90',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            {t('print')}
          </button>
        </div>
      </div>

      {/* Live preview + print target: solid black ink only (no greys / brand green) */}
      <div className="invoice-print-area receipt-edge bg-white text-black px-6 py-8 sm:px-10">
        <div className="text-center space-y-1 mb-6">
          <p className="font-display text-xl text-black">
            {businessName.trim() || t('previewBusinessFallback')}
          </p>
          {businessPhone.trim() && (
            <p className="font-receipt text-sm text-black" dir="ltr">
              {businessPhone.trim()}
            </p>
          )}
          {businessAddress.trim() && (
            <p className="font-receipt text-sm text-black">{businessAddress.trim()}</p>
          )}
        </div>

        <div className="flex flex-wrap justify-between gap-3 text-sm border-y border-dashed border-black py-3 mb-5">
          <div>
            <p className="mono-label text-black">{t('invoiceNumberLabel')}</p>
            <p className="font-receipt text-black" dir="ltr">
              {invoiceNumber || '-'}
            </p>
          </div>
          <div>
            <p className="mono-label text-black">{t('dateLabel')}</p>
            <p className="font-receipt text-black" dir="ltr">
              {formattedDate}
            </p>
          </div>
          <div>
            <p className="mono-label text-black">{t('customerNameLabel')}</p>
            <p className="font-receipt text-black">
              {customerName.trim() || t('previewCustomerFallback')}
            </p>
          </div>
        </div>

        <table className="w-full text-sm mb-5 text-black">
          <thead>
            <tr className="border-b border-dashed border-black">
              <th className="py-2 text-start font-normal mono-label text-black">
                {t('descriptionLabel')}
              </th>
              <th className="py-2 text-end font-normal mono-label text-black w-16">
                {t('quantityLabel')}
              </th>
              <th className="py-2 text-end font-normal mono-label text-black w-24">
                {t('unitPriceLabel')}
              </th>
              <th className="py-2 text-end font-normal mono-label text-black w-24">
                {t('lineTotalLabel')}
              </th>
            </tr>
          </thead>
          <tbody>
            {hasAnyLine ? (
              computedLines
                .filter((line) => line.description.trim() || line.unitPrice > 0)
                .map((line) => (
                  <tr key={line.id} className="border-b border-dashed border-black">
                    <td className="py-2.5 text-start text-black">
                      {line.description.trim() || t('untitledItem')}
                    </td>
                    <td className="py-2.5 text-end font-receipt text-black" dir="ltr">
                      {formatNumber(line.quantity)}
                    </td>
                    <td className="py-2.5 text-end font-receipt text-black" dir="ltr">
                      {formatNumber(line.unitPrice)}
                    </td>
                    <td className="py-2.5 text-end font-receipt text-black" dir="ltr">
                      {formatNumber(line.lineTotal)}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={4} className="py-6 text-center text-black font-receipt">
                  {t('emptyPreview')}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <dl className="space-y-2.5 max-w-xs ms-auto text-black">
          <div className="flex items-baseline gap-3 text-sm">
            <dt className="text-black">{t('subtotal')}</dt>
            <span className="invoice-tear-line flex-1 self-center" aria-hidden="true" />
            <dd className="font-receipt text-black" dir="ltr">
              {formatNumber(subtotal)}
            </dd>
          </div>
          {includeVat && (
            <div className="flex items-baseline gap-3 text-sm">
              <dt className="text-black">
                {t('vatLine', {
                  rate: effectiveVatRate.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                  }),
                })}
              </dt>
              <span className="invoice-tear-line flex-1 self-center" aria-hidden="true" />
              <dd className="font-receipt text-black" dir="ltr">
                {formatNumber(vatAmount)}
              </dd>
            </div>
          )}
          <div className="flex items-baseline gap-3 text-sm font-semibold border-t border-dashed border-black pt-3">
            <dt className="text-black uppercase tracking-wide">{t('total')}</dt>
            <span className="invoice-tear-line flex-1 self-center" aria-hidden="true" />
            <dd className="font-receipt text-black text-base" dir="ltr">
              {formatNumber(total)}
            </dd>
          </div>
        </dl>

        {notes.trim() && (
          <div className="mt-6 pt-4 border-t border-dashed border-black">
            <p className="mono-label text-black mb-1">{t('notesLabel')}</p>
            <p className="font-receipt text-sm text-black whitespace-pre-wrap">{notes.trim()}</p>
          </div>
        )}

        <p className="mt-8 text-center font-receipt text-xs text-black">
          {t('thankYou')}
        </p>
      </div>
    </div>
  );
}
