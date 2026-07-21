/**
 * Inject per-industry printer-receipt copy (en + ar).
 * Shared total/stamp live under industries.receipt; each vertical owns title/number/items/thanks.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const ZERO = '0.00';

const enReceipts = {
  industryCafe: {
    title: 'Cashvio * Cafe Receipt',
    number: 'NO. 000001 · YOUR CAFE',
    items: [
      { name: 'Fast checkout', value: ZERO },
      { name: 'Order notes', value: ZERO },
      { name: 'Dine-in & delivery', value: ZERO },
      { name: 'WhatsApp updates', value: ZERO },
      { name: 'Stock alerts', value: ZERO },
      { name: 'Daily profit', value: ZERO },
    ],
    thanks: 'Thank you for opening your cafe with us',
  },
  industryClothing: {
    title: 'Cashvio * Boutique Receipt',
    number: 'NO. 000001 · YOUR BOUTIQUE',
    items: [
      { name: 'Size & color variants', value: ZERO },
      { name: 'Barcode labels', value: ZERO },
      { name: 'Returns with credit', value: ZERO },
      { name: 'Coupons everywhere', value: ZERO },
      { name: 'Free online boutique', value: ZERO },
      { name: 'Stock sync', value: ZERO },
    ],
    thanks: 'Thank you for opening your boutique with us',
  },
  industryMinimarket: {
    title: 'Cashvio * Minimarket Receipt',
    number: 'NO. 000001 · YOUR SHOP',
    items: [
      { name: 'USB barcode scan', value: ZERO },
      { name: 'Digital credit book', value: ZERO },
      { name: 'Low-stock alerts', value: ZERO },
      { name: 'Purchase orders', value: ZERO },
      { name: 'End-of-day profit', value: ZERO },
      { name: 'Fast counter', value: ZERO },
    ],
    thanks: 'Thank you for opening your shop with us',
  },
  industryRestaurant: {
    title: 'Cashvio * Restaurant Receipt',
    number: 'NO. 000001 · YOUR KITCHEN',
    items: [
      { name: 'Service checkout', value: ZERO },
      { name: 'Table & delivery status', value: ZERO },
      { name: 'WhatsApp updates', value: ZERO },
      { name: 'Stock alerts', value: ZERO },
      { name: 'Staff logins', value: ZERO },
      { name: 'Daily profit', value: ZERO },
    ],
    thanks: 'Thank you for opening your restaurant with us',
  },
  industrySupermarket: {
    title: 'Cashvio * Grocery Receipt',
    number: 'NO. 000001 · YOUR STORE',
    items: [
      { name: 'Barcode checkout', value: ZERO },
      { name: 'Credit book', value: ZERO },
      { name: 'Low-stock alerts', value: ZERO },
      { name: 'Purchase orders', value: ZERO },
      { name: 'Multi-aisle stock', value: ZERO },
      { name: 'Closing profit', value: ZERO },
    ],
    thanks: 'Thank you for opening your store with us',
  },
  industryPharmacy: {
    title: 'Cashvio * Pharmacy Receipt',
    number: 'NO. 000001 · YOUR PHARMACY',
    items: [
      { name: 'Barcode checkout', value: ZERO },
      { name: 'SKU stock control', value: ZERO },
      { name: 'Customer profiles', value: ZERO },
      { name: 'Purchase orders', value: ZERO },
      { name: 'Staff permissions', value: ZERO },
      { name: 'Daily reports', value: ZERO },
    ],
    thanks: 'Thank you for opening your pharmacy with us',
  },
  industryBakery: {
    title: 'Cashvio * Bakery Receipt',
    number: 'NO. 000001 · YOUR BAKERY',
    items: [
      { name: 'Packed-item checkout', value: ZERO },
      { name: 'Custom cake notes', value: ZERO },
      { name: 'Pickup statuses', value: ZERO },
      { name: 'Packaging stock', value: ZERO },
      { name: 'Purchase orders', value: ZERO },
      { name: 'End-of-day profit', value: ZERO },
    ],
    thanks: 'Thank you for opening your bakery with us',
  },
  industryMobileShop: {
    title: 'Cashvio * Mobile Shop Receipt',
    number: 'NO. 000001 · YOUR SHOP',
    items: [
      { name: 'Device variants', value: ZERO },
      { name: 'Accessory barcodes', value: ZERO },
      { name: 'Credit sales', value: ZERO },
      { name: 'Purchase orders', value: ZERO },
      { name: 'Free online store', value: ZERO },
      { name: 'Stock sync', value: ZERO },
    ],
    thanks: 'Thank you for opening your mobile shop with us',
  },
  industryBeauty: {
    title: 'Cashvio * Beauty Receipt',
    number: 'NO. 000001 · YOUR SHOP',
    items: [
      { name: 'Shade & size variants', value: ZERO },
      { name: 'Barcode labels', value: ZERO },
      { name: 'Returns with credit', value: ZERO },
      { name: 'Coupons', value: ZERO },
      { name: 'Free online store', value: ZERO },
      { name: 'Margin reports', value: ZERO },
    ],
    thanks: 'Thank you for opening your beauty shop with us',
  },
  industryBookstore: {
    title: 'Cashvio * Bookstore Receipt',
    number: 'NO. 000001 · YOUR BOOKSHOP',
    items: [
      { name: 'SKU & barcode checkout', value: ZERO },
      { name: 'Title stock alerts', value: ZERO },
      { name: 'Customer profiles', value: ZERO },
      { name: 'Purchase orders', value: ZERO },
      { name: 'Free online store', value: ZERO },
      { name: 'Daily profit', value: ZERO },
    ],
    thanks: 'Thank you for opening your bookstore with us',
  },
  industryGiftShop: {
    title: 'Cashvio * Gift Shop Receipt',
    number: 'NO. 000001 · YOUR SHOP',
    items: [
      { name: 'Fast gift checkout', value: ZERO },
      { name: 'Wrap variants & notes', value: ZERO },
      { name: 'Seasonal stock alerts', value: ZERO },
      { name: 'Free online store', value: ZERO },
      { name: 'WhatsApp updates', value: ZERO },
      { name: 'Coupons & credit', value: ZERO },
    ],
    thanks: 'Thank you for opening your gift shop with us',
  },
  industryJewelry: {
    title: 'Cashvio * Jewelry Receipt',
    number: 'NO. 000001 · YOUR SHOP',
    items: [
      { name: 'Barcode-first checkout', value: ZERO },
      { name: 'Piece-level stock', value: ZERO },
      { name: 'Customer credit', value: ZERO },
      { name: 'Staff permissions', value: ZERO },
      { name: 'Purchase orders', value: ZERO },
      { name: 'Profit reports', value: ZERO },
    ],
    thanks: 'Thank you for opening your jewelry shop with us',
  },
  industryHardware: {
    title: 'Cashvio * Hardware Receipt',
    number: 'NO. 000001 · YOUR SHOP',
    items: [
      { name: 'USB barcode scan', value: ZERO },
      { name: 'Digital credit book', value: ZERO },
      { name: 'Low-stock alerts', value: ZERO },
      { name: 'Purchase orders', value: ZERO },
      { name: 'Multi-store ready', value: ZERO },
      { name: 'End-of-day profit', value: ZERO },
    ],
    thanks: 'Thank you for opening your hardware shop with us',
  },
  industryElectronics: {
    title: 'Cashvio * Electronics Receipt',
    number: 'NO. 000001 · YOUR SHOP',
    items: [
      { name: 'Model variants', value: ZERO },
      { name: 'Barcode labels', value: ZERO },
      { name: 'Warranty notes', value: ZERO },
      { name: 'Customer credit', value: ZERO },
      { name: 'Free online store', value: ZERO },
      { name: 'Purchase & reports', value: ZERO },
    ],
    thanks: 'Thank you for opening your electronics shop with us',
  },
  freePosEgypt: {
    title: 'Cashvio * Free POS Receipt',
    number: 'NO. 000001 · YOUR SHOP',
    items: [
      { name: 'Arabic & English POS', value: ZERO },
      { name: 'Local-currency pricing', value: ZERO },
      { name: 'Offline-capable sales', value: ZERO },
      { name: 'Free online store', value: ZERO },
      { name: 'Inventory & POs', value: ZERO },
      { name: 'WhatsApp updates', value: ZERO },
    ],
    thanks: 'Thank you for opening your shop with us',
  },
  freeOnlineStoreEgypt: {
    title: 'Cashvio * Online Store Receipt',
    number: 'NO. 000001 · YOUR STORE',
    items: [
      { name: 'Arabic storefront', value: ZERO },
      { name: 'Local-currency checkout', value: ZERO },
      { name: 'Stock synced with POS', value: ZERO },
      { name: 'No free-plan commission', value: ZERO },
      { name: 'Order statuses', value: ZERO },
      { name: 'Coupons & profiles', value: ZERO },
    ],
    thanks: 'Thank you for opening your store with us',
  },
};

const arReceipts = {
  industryCafe: {
    title: 'كاشفيو * إيصال كافيه',
    number: 'رقم 000001 · كافيهك',
    items: [
      { name: 'بيع سريع', value: ZERO },
      { name: 'ملاحظات الطلب', value: ZERO },
      { name: 'صالة وتوصيل', value: ZERO },
      { name: 'تحديثات واتساب', value: ZERO },
      { name: 'تنبيهات مخزون', value: ZERO },
      { name: 'ربح يومي', value: ZERO },
    ],
    thanks: 'شكراً لفتح كافيهك معنا',
  },
  industryClothing: {
    title: 'كاشفيو * إيصال بوتيك',
    number: 'رقم 000001 · بوتيكك',
    items: [
      { name: 'مقاسات وألوان', value: ZERO },
      { name: 'ملصقات باركود', value: ZERO },
      { name: 'مرتجعات برصيد', value: ZERO },
      { name: 'كوبونات', value: ZERO },
      { name: 'بوتيك أونلاين', value: ZERO },
      { name: 'مزامنة مخزون', value: ZERO },
    ],
    thanks: 'شكراً لفتح بوتيكك معنا',
  },
  industryMinimarket: {
    title: 'كاشفيو * إيصال ميني ماركت',
    number: 'رقم 000001 · محلك',
    items: [
      { name: 'مسح باركود USB', value: ZERO },
      { name: 'دفتر حساب رقمي', value: ZERO },
      { name: 'تنبيهات نقص', value: ZERO },
      { name: 'أوامر شراء', value: ZERO },
      { name: 'ربح آخر اليوم', value: ZERO },
      { name: 'كاونتر سريع', value: ZERO },
    ],
    thanks: 'شكراً لفتح محلك معنا',
  },
  industryRestaurant: {
    title: 'كاشفيو * إيصال مطعم',
    number: 'رقم 000001 · مطعمك',
    items: [
      { name: 'بيع خدمة سريعة', value: ZERO },
      { name: 'حالة صالة وتوصيل', value: ZERO },
      { name: 'تحديثات واتساب', value: ZERO },
      { name: 'تنبيهات مخزون', value: ZERO },
      { name: 'لوجين للموظفين', value: ZERO },
      { name: 'ربح يومي', value: ZERO },
    ],
    thanks: 'شكراً لفتح مطعمك معنا',
  },
  industrySupermarket: {
    title: 'كاشفيو * إيصال بقالة',
    number: 'رقم 000001 · متجرك',
    items: [
      { name: 'بيع بالباركود', value: ZERO },
      { name: 'دفتر حساب', value: ZERO },
      { name: 'تنبيهات نقص', value: ZERO },
      { name: 'أوامر شراء', value: ZERO },
      { name: 'مخزون الأقسام', value: ZERO },
      { name: 'ربح الإقفال', value: ZERO },
    ],
    thanks: 'شكراً لفتح متجرك معنا',
  },
  industryPharmacy: {
    title: 'كاشفيو * إيصال صيدلية',
    number: 'رقم 000001 · صيدليتك',
    items: [
      { name: 'بيع بالباركود', value: ZERO },
      { name: 'مخزون لكل SKU', value: ZERO },
      { name: 'ملفات عملاء', value: ZERO },
      { name: 'أوامر شراء', value: ZERO },
      { name: 'صلاحيات موظفين', value: ZERO },
      { name: 'تقارير يومية', value: ZERO },
    ],
    thanks: 'شكراً لفتح صيدليتك معنا',
  },
  industryBakery: {
    title: 'كاشفيو * إيصال مخبز',
    number: 'رقم 000001 · مخبزك',
    items: [
      { name: 'بيع أصناف معبأة', value: ZERO },
      { name: 'ملاحظات طلبات', value: ZERO },
      { name: 'حالات استلام', value: ZERO },
      { name: 'مخزون تعبئة', value: ZERO },
      { name: 'أوامر شراء', value: ZERO },
      { name: 'ربح آخر اليوم', value: ZERO },
    ],
    thanks: 'شكراً لفتح مخبزك معنا',
  },
  industryMobileShop: {
    title: 'كاشفيو * إيصال موبايلات',
    number: 'رقم 000001 · محلك',
    items: [
      { name: 'متغيرات أجهزة', value: ZERO },
      { name: 'باركود إكسسوارات', value: ZERO },
      { name: 'بيع بالآجل', value: ZERO },
      { name: 'أوامر شراء', value: ZERO },
      { name: 'متجر إلكتروني', value: ZERO },
      { name: 'مزامنة مخزون', value: ZERO },
    ],
    thanks: 'شكراً لفتح محل الموبايل معنا',
  },
  industryBeauty: {
    title: 'كاشفيو * إيصال تجميل',
    number: 'رقم 000001 · محلك',
    items: [
      { name: 'درجات ومقاسات', value: ZERO },
      { name: 'ملصقات باركود', value: ZERO },
      { name: 'مرتجعات برصيد', value: ZERO },
      { name: 'كوبونات', value: ZERO },
      { name: 'متجر إلكتروني', value: ZERO },
      { name: 'تقارير هامش', value: ZERO },
    ],
    thanks: 'شكراً لفتح محل التجميل معنا',
  },
  industryBookstore: {
    title: 'كاشفيو * إيصال مكتبة',
    number: 'رقم 000001 · مكتبتك',
    items: [
      { name: 'بيع بـ SKU وباركود', value: ZERO },
      { name: 'تنبيهات عناوين', value: ZERO },
      { name: 'ملفات عملاء', value: ZERO },
      { name: 'أوامر شراء', value: ZERO },
      { name: 'متجر إلكتروني', value: ZERO },
      { name: 'ربح يومي', value: ZERO },
    ],
    thanks: 'شكراً لفتح مكتبتك معنا',
  },
  industryGiftShop: {
    title: 'كاشفيو * إيصال هدايا',
    number: 'رقم 000001 · محلك',
    items: [
      { name: 'بيع هدايا سريع', value: ZERO },
      { name: 'تغليف وملاحظات', value: ZERO },
      { name: 'تنبيهات مواسم', value: ZERO },
      { name: 'متجر إلكتروني', value: ZERO },
      { name: 'تحديثات واتساب', value: ZERO },
      { name: 'كوبونات ورصيد', value: ZERO },
    ],
    thanks: 'شكراً لفتح محل الهدايا معنا',
  },
  industryJewelry: {
    title: 'كاشفيو * إيصال مجوهرات',
    number: 'رقم 000001 · محلك',
    items: [
      { name: 'بيع بالباركود', value: ZERO },
      { name: 'مخزون لكل قطعة', value: ZERO },
      { name: 'رصيد عملاء', value: ZERO },
      { name: 'صلاحيات موظفين', value: ZERO },
      { name: 'أوامر شراء', value: ZERO },
      { name: 'تقارير ربح', value: ZERO },
    ],
    thanks: 'شكراً لفتح محل المجوهرات معنا',
  },
  industryHardware: {
    title: 'كاشفيو * إيصال خردوات',
    number: 'رقم 000001 · محلك',
    items: [
      { name: 'مسح باركود USB', value: ZERO },
      { name: 'دفتر حساب رقمي', value: ZERO },
      { name: 'تنبيهات نقص', value: ZERO },
      { name: 'أوامر شراء', value: ZERO },
      { name: 'جاهز لأكتر من فرع', value: ZERO },
      { name: 'ربح آخر اليوم', value: ZERO },
    ],
    thanks: 'شكراً لفتح محل الخردوات معنا',
  },
  industryElectronics: {
    title: 'كاشفيو * إيصال إلكترونيات',
    number: 'رقم 000001 · محلك',
    items: [
      { name: 'متغيرات موديلات', value: ZERO },
      { name: 'ملصقات باركود', value: ZERO },
      { name: 'ملاحظات ضمان', value: ZERO },
      { name: 'رصيد عملاء', value: ZERO },
      { name: 'متجر إلكتروني', value: ZERO },
      { name: 'شراء وتقارير', value: ZERO },
    ],
    thanks: 'شكراً لفتح محل الإلكترونيات معنا',
  },
  freePosEgypt: {
    title: 'كاشفيو * إيصال كاشير مجاني',
    number: 'رقم 000001 · محلك',
    items: [
      { name: 'كاشير عربي وإنجليزي', value: ZERO },
      { name: 'تسعير بعملتك', value: ZERO },
      { name: 'بيع أوفلاين', value: ZERO },
      { name: 'متجر إلكتروني مجاني', value: ZERO },
      { name: 'مخزون وأوامر شراء', value: ZERO },
      { name: 'تحديثات واتساب', value: ZERO },
    ],
    thanks: 'شكراً لفتح محلك معنا',
  },
  freeOnlineStoreEgypt: {
    title: 'كاشفيو * إيصال متجر أونلاين',
    number: 'رقم 000001 · متجرك',
    items: [
      { name: 'واجهة عربي', value: ZERO },
      { name: 'دفع بعملتك', value: ZERO },
      { name: 'مخزون مع الكاشير', value: ZERO },
      { name: 'من غير عمولة مجانية', value: ZERO },
      { name: 'حالات طلب', value: ZERO },
      { name: 'كوبونات وعملاء', value: ZERO },
    ],
    thanks: 'شكراً لفتح متجرك معنا',
  },
};

function inject(file, receipts, sharedReceipt) {
  const path = join(root, 'messages', file);
  const data = JSON.parse(readFileSync(path, 'utf8'));

  if (!data.industries) data.industries = {};
  data.industries.receipt = sharedReceipt;

  for (const [ns, receipt] of Object.entries(receipts)) {
    if (!data[ns]) {
      console.warn(`Missing namespace ${ns} in ${file}`);
      continue;
    }
    data[ns].receipt = receipt;
  }

  // Align homepage total with no currency code (visible copy rule)
  if (data.home?.hero?.receipt) {
    data.home.hero.receipt.totalValue = ZERO;
  }
  if (data.home?.endOfDay?.receipt) {
    data.home.endOfDay.receipt.totalValue = ZERO;
  }

  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Updated ${file}`);
}

inject('en.json', enReceipts, {
  totalLabel: 'Total',
  totalValue: ZERO,
  stamp: 'Free forever',
});

inject('ar.json', arReceipts, {
  totalLabel: 'الإجمالي',
  totalValue: ZERO,
  stamp: 'مجاني للأبد',
});

console.log('Done.');
