---
name: add-doc-page
description: Add a new merchant documentation guide in Fumadocs MDX with paired English and Arabic files, navigation meta, and search index registration
---

# Add a Documentation Page

Merchant documentation guides explain product workflows, configuration, hardware setup, and POS operational steps.

## When to Use

- Writing user manuals or tutorials for merchant features (e.g. `content/docs/pos/thermal-printers.mdx`).
- Creating bilingual documentation pairs explaining dashboard settings, inventory imports, or receipt customizations.

## Core Rules & Invariants

- **Mandatory Bilingual Pairing**: Always create BOTH files in the same turn:
  - `content/docs/<section>/<slug>.mdx` (English)
  - `content/docs/<section>/<slug>.ar.mdx` (Arabic)
- **Fumadocs Navigation Registration**: Add the slug to the `pages` array in both:
  - `content/docs/<section>/meta.json`
  - `content/docs/<section>/meta.ar.json`
- **Navigation Breadcrumbs Invariant**: Use bold with `>`: `**Settings > Branding > Receipts**`. Never use arrows (`→`).
- **Punctuation Rules**: Zero em-dashes (`—`), en-dashes (`–`), or arrows (`→`).
- **No Fabricated Capabilities**: Document only actual shipped UI screens and fields.
- **Natural Arabic**: Write clear, easy-to-follow Arabic that retail shopkeepers easily understand.

## Step-by-Step Implementation Flow

### Step 1: Create the English Documentation Page (`content/docs/<section>/<slug>.mdx`)

```mdx
---
title: Setting Up Thermal Printers
description: Connect USB and Bluetooth thermal receipt printers to your Cashvio POS.
---

import { Callout } from 'fumadocs-ui/components/callout';

# Setting Up Thermal Printers

Connect any 80mm or 58mm thermal receipt printer to print instant customer receipts.

## Supported Connection Types

- **USB Printers**: Plug directly into your computer, Android tablet, or POS terminal.
- **Bluetooth Printers**: Pair wirelessly with mobile phones and portable tablets.
- **Network / LAN Printers**: Connect via Ethernet cable to your local Wi-Fi router.

<Callout type="info">
  Cashvio supports standard ESC/POS commands used by Epson, Star Micronics, Xprinter, and generic thermal printers.
</Callout>

## Step-by-Step Setup

1. Open your cashier screen and navigate to **Settings > Hardware > Printers**.
2. Click **Add Printer** and select your connection type.
3. Choose your paper width: **80mm** (standard retail) or **58mm** (compact).
4. Click **Print Test Receipt** to verify clear output.
5. Toggle **Auto-Print on Checkout** to print receipts automatically when completing sales.
```

### Step 2: Create the Arabic Documentation Page (`content/docs/<section>/<slug>.ar.mdx`)

```mdx
---
title: إعداد طابعات الإيصالات الحرارية
description: ربط طابعات الإيصالات الحرارية عبر USB وبلوتوث بنظام كاشفيو.
---

import { Callout } from 'fumadocs-ui/components/callout';

# إعداد طابعات الإيصالات الحرارية

قم بتوصيل أي طابعة إيصالات حرارية بمقاس 80 مم أو 58 مم لطباعة فواتير العملاء فوراً.

## طرق التوصيل المدعومة

- **طابعات USB**: التوصيل المباشر بالكمبيوتر أو التابلت أو شاشة الكاشير.
- **طابعات بلوتوث**: الاقتران اللاسلكي بالهواتف الذكية والأجهزة اللوحية.
- **طابعات الشبكة (LAN)**: التوصيل عبر كابل الإنترنت بنفس شبكة الواي فاي.

<Callout type="info">
  يدعم كاشفيو أوامر ESC/POS القياسية المتوافقة مع إبسون وستار وإكس برينتر وجميع الطابعات الحرارية الشائعة.
</Callout>

## خطوات الإعداد

1. افتح شاشة الكاشير وانتقل إلى **الإعدادات > الأجهزة > الطابعات**.
2. اضغط على **إضافة طابعة** واختر طريقة التوصيل.
3. حدد عرض الورق: **80 مم** (المقاس القياسي) أو **58 مم** (المقاس الصغير).
4. اضغط على **طباعة إيصال تجريبي** للتأكد من وضوح الطباعة.
5. فعّل خيار **طباعة تلقائية عند الدفع** لطباعة الفاتورة فور إتمام عملية البيع.
```

### Step 3: Register in Navigation Meta Files

Update both `content/docs/<section>/meta.json` and `meta.ar.json`:

```json
// content/docs/pos/meta.json
{
  "title": "Point of Sale",
  "pages": [
    "overview",
    "thermal-printers",
    "barcode-scanners"
  ]
}

// content/docs/pos/meta.ar.json
{
  "title": "نظام الكاشير (POS)",
  "pages": [
    "overview",
    "thermal-printers",
    "barcode-scanners"
  ]
}
```

### Step 4: Verification

Run the automated checker to verify zero banned characters and valid YAML frontmatter:
```bash
node .agents/skills/seo-preflight/scripts/check-content.mjs
```
