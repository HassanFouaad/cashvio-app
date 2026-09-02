'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Download, Plus, Printer, X } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { trackButtonClick, trackEvent } from '@/lib/analytics';

type AgeBucket = '30' | '60' | '90' | 'never';

interface DeadStockItem {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  unitCost: number;
  lastSaleDate: string;
  ageBucket: AgeBucket;
  action: string;
}

function createDeadStockItem(overrides: Partial<DeadStockItem> = {}): DeadStockItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    sku: '',
    productName: '',
    quantity: 0,
    unitCost: 0,
    lastSaleDate: '',
    ageBucket: '30',
    action: '',
    ...overrides,
  };
}

function formatNumber(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function DeadStockReportTool() {
  const t = useTranslations('deadStockReport.tool');

  const [shopName, setShopName] = React.useState('');
  const [reportDate, setReportDate] = React.useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [items, setItems] = React.useState<DeadStockItem[]>([
    createDeadStockItem({
      sku: 'SKU-001',
      productName: 'Sample slow mover',
      quantity: 12,
      unitCost: 25,
      ageBucket: '60',
      action: 'Discount 20%',
    }),
  ]);

  const addItem = () => {
    setItems((prev) => [...prev, createDeadStockItem()]);
    trackEvent('tool_interaction', {
      category: 'engagement',
      tool_name: 'dead_stock_report',
      action: 'add_item',
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((item) => item.id !== id)));
  };

  const updateItem = <K extends keyof DeadStockItem>(
    id: string,
    field: K,
    value: DeadStockItem[K]
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculateStockValue = (quantity: number, unitCost: number): number => {
    return quantity * unitCost;
  };

  const totalValue = React.useMemo(() => {
    return items.reduce(
      (sum, item) => sum + calculateStockValue(item.quantity, item.unitCost),
      0
    );
  }, [items]);

  const getAgeDays = (bucket: AgeBucket): number => {
    switch (bucket) {
      case '30':
        return 30;
      case '60':
        return 60;
      case '90':
        return 90;
      case 'never':
        return 0;
    }
  };

  const handlePrint = () => {
    trackButtonClick('dead_stock_print', 'dead_stock_report_tool');
    trackEvent('tool_completed', {
      category: 'engagement',
      tool_name: 'dead_stock_report',
      item_count: items.length,
      total_value: totalValue,
    });
    window.print();
  };

  const handleDownloadCSV = () => {
    trackButtonClick('dead_stock_csv_download', 'dead_stock_report_tool');

    const headers = [
      t('tableHeaders.sku'),
      t('tableHeaders.product'),
      t('tableHeaders.quantity'),
      t('tableHeaders.unitCost'),
      t('tableHeaders.stockValue'),
      t('tableHeaders.lastSale'),
      t('tableHeaders.age'),
      t('tableHeaders.action'),
    ];

    const rows = items.map((item) => [
      item.sku,
      item.productName,
      item.quantity,
      item.unitCost,
      calculateStockValue(item.quantity, item.unitCost),
      item.lastSaleDate || t('neverSold'),
      item.ageBucket === 'never'
        ? t('neverSold')
        : t('ageDays', { days: getAgeDays(item.ageBucket) }),
      item.action,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dead-stock-report-${reportDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    trackEvent('tool_completed', {
      category: 'engagement',
      tool_name: 'dead_stock_report_csv',
      item_count: items.length,
      total_value: totalValue,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Form Section - Hidden on Print */}
      <div className="receipt-edge bg-card px-6 py-8 sm:px-8 space-y-6 print:hidden">
        {/* Business Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="shopName" className="block mono-label text-muted-foreground">
              {t('shopNameLabel')}
            </label>
            <input
              id="shopName"
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder={t('shopNamePlaceholder')}
              className="paper-input"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="reportDate" className="block mono-label text-muted-foreground">
              {t('reportDateLabel')}
            </label>
            <input
              id="reportDate"
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="paper-input"
            />
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-t border-dashed border-ledger-line pt-4">
            <h3 className="mono-label text-foreground">{t('itemsHeading')}</h3>
            <span className="font-receipt text-xs text-muted-foreground">
              {t('itemCountLabel', { count: items.length })}
            </span>
          </div>

          {items.map((item, index) => (
            <div
              key={item.id}
              className="space-y-4 rounded-lg border border-dashed border-ledger-line p-4"
            >
              <div className="flex items-center justify-between">
                <span className="mono-label text-muted-foreground text-xs">
                  {t('itemNumber', { number: String(index + 1).padStart(2, '0') })}
                </span>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="font-receipt text-xs text-destructive hover:underline inline-flex items-center gap-1"
                    aria-label={t('removeItem')}
                  >
                    <X className="size-3.5" aria-hidden="true" />
                    <span>{t('removeItem')}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label htmlFor={`sku-${item.id}`} className="block mono-label text-muted-foreground">
                    {t('skuLabel')}
                  </label>
                  <input
                    id={`sku-${item.id}`}
                    type="text"
                    value={item.sku}
                    onChange={(e) => updateItem(item.id, 'sku', e.target.value)}
                    placeholder={t('skuPlaceholder')}
                    className="paper-input"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2 sm:col-span-1 lg:col-span-3">
                  <label htmlFor={`product-${item.id}`} className="block mono-label text-muted-foreground">
                    {t('productNameLabel')}
                  </label>
                  <input
                    id={`product-${item.id}`}
                    type="text"
                    value={item.productName}
                    onChange={(e) => updateItem(item.id, 'productName', e.target.value)}
                    placeholder={t('productNamePlaceholder')}
                    className="paper-input"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor={`quantity-${item.id}`} className="block mono-label text-muted-foreground">
                    {t('quantityLabel')}
                  </label>
                  <input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="0"
                    value={item.quantity || ''}
                    onChange={(e) =>
                      updateItem(item.id, 'quantity', parseInt(e.target.value, 10) || 0)
                    }
                    className="paper-input"
                    placeholder="0"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor={`cost-${item.id}`} className="block mono-label text-muted-foreground">
                    {t('unitCostLabel')}
                  </label>
                  <input
                    id={`cost-${item.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitCost || ''}
                    onChange={(e) =>
                      updateItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)
                    }
                    className="paper-input"
                    placeholder="0.00"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor={`lastSale-${item.id}`} className="block mono-label text-muted-foreground">
                    {t('lastSaleDateLabel')}
                  </label>
                  <input
                    id={`lastSale-${item.id}`}
                    type="date"
                    value={item.lastSaleDate}
                    onChange={(e) => updateItem(item.id, 'lastSaleDate', e.target.value)}
                    className="paper-input"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor={`age-${item.id}`} className="block mono-label text-muted-foreground">
                    {t('ageBucketLabel')}
                  </label>
                  <select
                    id={`age-${item.id}`}
                    value={item.ageBucket}
                    onChange={(e) =>
                      updateItem(item.id, 'ageBucket', e.target.value as AgeBucket)
                    }
                    className="paper-input bg-card"
                  >
                    <option value="30">{t('age30')}</option>
                    <option value="60">{t('age60')}</option>
                    <option value="90">{t('age90')}</option>
                    <option value="never">{t('ageNever')}</option>
                  </select>
                </div>

                <div className="space-y-2 sm:col-span-2 lg:col-span-4">
                  <label htmlFor={`action-${item.id}`} className="block mono-label text-muted-foreground">
                    {t('actionLabel')}
                  </label>
                  <input
                    id={`action-${item.id}`}
                    type="text"
                    value={item.action}
                    onChange={(e) => updateItem(item.id, 'action', e.target.value)}
                    placeholder={t('actionPlaceholder')}
                    className="paper-input"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="w-full sm:w-auto h-10 px-4 rounded-lg text-sm font-medium border border-dashed border-ledger-line text-foreground hover:bg-muted/50 transition-colors inline-flex items-center justify-center gap-2"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span>{t('addItem')}</span>
          </button>
        </div>

        {/* Summary Card */}
        <div className="border-t border-dashed border-ledger-line pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="mono-label text-muted-foreground">{t('totalValueLabel')}</span>
          <span className="font-receipt text-lg sm:text-xl font-bold text-primary">
            {formatNumber(totalValue)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="h-11 px-5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
          >
            <Printer className="size-4" aria-hidden="true" />
            <span>{t('print')}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadCSV}
            className="h-11 px-5 rounded-lg text-sm font-medium border border-dashed border-ledger-line text-foreground hover:bg-muted/50 transition-colors inline-flex items-center justify-center gap-2"
          >
            <Download className="size-4" aria-hidden="true" />
            <span>{t('downloadCsv')}</span>
          </button>
        </div>

        <p className="font-receipt text-xs text-muted-foreground border-t border-dashed border-ledger-line pt-4">
          {t('footerNote')}
        </p>
      </div>

      {/* Related Resources Links (Visible on web, hidden on print) */}
      <div className="receipt-edge bg-card px-6 py-6 sm:px-8 print:hidden">
        <p className="mono-label text-primary mb-3">RELATED TOOLS & RESOURCES</p>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/docs/reports/dead-stock-analytics" className="text-primary hover:underline font-medium">
              Read the dead stock analytics guide
            </Link>
          </li>
          <li>
            <Link href="/features/inventory-management" className="text-primary hover:underline font-medium">
              Automate aging stock tracking with Cashvio Inventory
            </Link>
          </li>
          <li>
            <Link href="/features/sales-analytics" className="text-primary hover:underline font-medium">
              View sales velocity and profit reports
            </Link>
          </li>
        </ul>
      </div>

      {/* Print View - Visible ONLY when printing */}
      <div className="hidden print:block font-receipt text-black space-y-6">
        <div className="border-b border-black/30 pb-4">
          <h1 className="text-2xl font-bold uppercase tracking-wider">{t('reportTitle')}</h1>
          <div className="mt-2 text-xs flex justify-between text-black/70">
            <span>{shopName || t('shopNamePlaceholder')}</span>
            <span>
              {t('reportDatePrefix')} {reportDate}
            </span>
          </div>
        </div>

        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-black">
              <th className="text-start py-2 pe-2">{t('tableHeaders.sku')}</th>
              <th className="text-start py-2 pe-2">{t('tableHeaders.product')}</th>
              <th className="text-end py-2 px-2">{t('tableHeaders.quantity')}</th>
              <th className="text-end py-2 px-2">{t('tableHeaders.unitCost')}</th>
              <th className="text-end py-2 px-2">{t('tableHeaders.stockValue')}</th>
              <th className="text-start py-2 px-2">{t('tableHeaders.lastSale')}</th>
              <th className="text-start py-2 px-2">{t('tableHeaders.age')}</th>
              <th className="text-start py-2 ps-2">{t('tableHeaders.action')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-black/20">
                <td className="py-2 pe-2 font-mono">{item.sku}</td>
                <td className="py-2 pe-2">{item.productName}</td>
                <td className="py-2 px-2 text-end font-mono">{item.quantity}</td>
                <td className="py-2 px-2 text-end font-mono">{item.unitCost.toFixed(2)}</td>
                <td className="py-2 px-2 text-end font-mono font-bold">
                  {calculateStockValue(item.quantity, item.unitCost).toFixed(2)}
                </td>
                <td className="py-2 px-2">{item.lastSaleDate || t('neverSold')}</td>
                <td className="py-2 px-2">
                  {item.ageBucket === 'never'
                    ? t('neverSold')
                    : t('ageDays', { days: getAgeDays(item.ageBucket) })}
                </td>
                <td className="py-2 ps-2">{item.action}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-black font-bold">
              <td colSpan={4} className="py-3 text-start">
                {t('totalValueLabel')}
              </td>
              <td className="py-3 text-end font-mono font-bold text-sm">
                {formatNumber(totalValue)}
              </td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        </table>

        <p className="text-[10px] text-black/60 pt-4 border-t border-dashed border-black/30">
          {t('footerNote')}
        </p>
      </div>
    </div>
  );
}
