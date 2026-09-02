import { join } from 'path';

import { siteConfig } from '@/config/site';
import { source } from '@/lib/docs-source';
import { loadDocsLlmSections } from '@/lib/docs-llm';

export const revalidate = false; // static at build time

export function GET() {
  const SITE_URL = siteConfig.url;
  const docsDir = join(process.cwd(), 'content', 'docs');
  const sections = loadDocsLlmSections(docsDir);
  const pages = source.getPages('en');

  const pageByDocsPath = new Map<
    string,
    { title: string; description: string; url: string }
  >();

  for (const page of pages) {
    const docsPath = page.url.replace(/^\/(en|ar)/, '');
    pageByDocsPath.set(docsPath, {
      title: page.data.title,
      description: page.data.description || '',
      url: `${SITE_URL}${docsPath}`,
    });
  }

  const lines: string[] = [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.description}`,
    '',
    `Cashvio is a complete business management platform for online and in-store operations. It offers a free POS (free cashier), a free online store, product catalogue management, inventory control, multi-channel order processing, customer management, supplier & purchasing, analytics & reporting, team roles & permissions, and online storefront capabilities. It is fully bilingual (English and Arabic with native RTL) and offers a free forever plan with no credit card required.`,
    '',
    `## Product`,
    '',
    `- [Features overview](${SITE_URL}/features): All modules in one place: products, inventory, orders, customers, suppliers, analytics, POS, and team permissions`,
    `- [Free POS / free cashier](${SITE_URL}/features/free-pos): 100% free POS system with a sales screen, barcode scanning, thermal and digital receipts, and live inventory`,
    `- [Free online store](${SITE_URL}/features/free-online-store): Create a free online store synced with your free POS. No commission, with an Arabic & English storefront`,
    `- [Arabic POS & storefront](${SITE_URL}/features/arabic-pos): Point of sale and online store built natively for Arabic with true RTL, bilingual receipts, and regional payment methods`,
    `- [Omnichannel retail](${SITE_URL}/features/omnichannel-retail): One dashboard for physical stores and online storefront with unified inventory, orders, and customers`,
    `- [Free inventory management](${SITE_URL}/features/inventory-management): Per-variant, per-store stock tracking with low-stock alerts, purchase orders, and a full audit trail`,
    `- [Coupons & discounts](${SITE_URL}/features/coupons-and-discounts): Percentage and fixed-amount discount codes with usage limits, scheduling, and real-time checkout validation`,
    `- [Order management](${SITE_URL}/features/order-management): Orders from POS, online store, and manual entry in one list, with fulfillment statuses, partial payments, digital receipts, and WhatsApp updates`,
    `- [Customer management](${SITE_URL}/features/customer-management): Customer profiles with visits, spending, store credit, addresses, and full order history, starting from a phone number`,
    `- [Sales analytics](${SITE_URL}/features/sales-analytics): Six ready reports covering overview, profit, customers, returns, staff, and plain-language insights with recommended actions`,
    `- [AI assistant](${SITE_URL}/features/ai-assistant): Ask about orders, stock, customers, and analytics in plain language with approval before store changes`,
    `- [Purchase orders & suppliers](${SITE_URL}/features/purchase-orders): Two-step purchase orders with partial receiving, automatic inventory updates, and a supplier database`,
    `- [Returns & refunds](${SITE_URL}/features/returns-and-refunds): Item-level returns with restock control, recorded reasons, an approval flow, and four refund methods including store credit`,
    `- [Multi-store management](${SITE_URL}/features/multi-store-management): Separate stock, prices, and settings per branch with one dashboard, stock transfers, and per-store reports`,
    `- [Team & permissions](${SITE_URL}/features/team-management): Individual staff accounts with fine-grained roles, store-scoped access, and per-person sales reports`,
    `- [Customer credit](${SITE_URL}/features/customer-credit): Digital credit book with store credit, balances, and payment history from a phone number`,
    `- [WhatsApp commerce](${SITE_URL}/features/whatsapp-commerce): Share order status and digital receipts on WhatsApp from one order queue`,
    `- [Barcode POS](${SITE_URL}/features/barcode-pos): USB barcode scanning, printable labels, and live stock updates at the register`,
    `- [Pricing](${SITE_URL}/pricing): Plans and pricing, including the free forever plan`,
    `- [Register](${SITE_URL}/register): Create a free account`,
    '',
    `## Business types`,
    '',
    `- [POS by business type](${SITE_URL}/industries): How the free POS and online store fit different kinds of shops`,
    `- [Cafe POS](${SITE_URL}/industries/cafe): Free POS for cafes and coffee shops with order notes, dine-in and delivery statuses, and WhatsApp order updates`,
    `- [Clothing store POS](${SITE_URL}/industries/clothing): Size and color variants, printable barcode labels, returns with store credit, and a free online boutique`,
    `- [Minimarket & grocery POS](${SITE_URL}/industries/minimarket): USB barcode scanning, a digital credit book, low-stock alerts, and purchase orders`,
    `- [Restaurant POS](${SITE_URL}/industries/restaurant): Free restaurant POS with dine-in and delivery statuses, WhatsApp updates, and daily profit`,
    `- [Supermarket POS](${SITE_URL}/industries/supermarket): Barcode scanning, credit book, low-stock alerts, and purchase orders for groceries`,
    `- [Pharmacy POS](${SITE_URL}/industries/pharmacy): Barcode checkout, stock control, customer profiles, and purchase orders`,
    `- [Bakery POS](${SITE_URL}/industries/bakery): Packed items and custom cakes, stock alerts, purchase orders, and closing profit`,
    `- [Mobile shop POS](${SITE_URL}/industries/mobile-shop): Device variants, accessory barcodes, credit sales, and a free online store`,
    `- [Beauty & cosmetics POS](${SITE_URL}/industries/beauty): Shades and sizes as variants, barcode labels, returns with store credit, and coupons`,
    `- [Bookstore POS](${SITE_URL}/industries/bookstore): SKU and barcode checkout, stock alerts, customer history, and a free online store for books`,
    `- [Gift shop POS](${SITE_URL}/industries/gift-shop): Seasonal stock, wrap variants, WhatsApp updates, coupons, and a free online gift store`,
    `- [Jewelry POS](${SITE_URL}/industries/jewelry): Barcode checkout for high-value pieces, customer credit, staff permissions, and profit reports`,
    `- [Hardware store POS](${SITE_URL}/industries/hardware): USB barcode scanning, digital credit book, low-stock alerts, and purchase orders`,
    `- [Electronics store POS](${SITE_URL}/industries/electronics): Variants, barcodes, credit sales, and a free online store for appliances and accessories`,
    `- [Stationery POS](${SITE_URL}/industries/stationery): Barcode checkout, school-season stock alerts, purchase orders, and a free online store for pens and notebooks`,
    `- [Auto parts POS](${SITE_URL}/industries/auto-parts): USB barcode scanning, digital credit book for workshops, low-stock alerts, and purchase orders`,
    `- [Furniture store POS](${SITE_URL}/industries/furniture): Color and size variants, delivery notes, customer credit, and a free online store for showroom stock`,
    `- [Optics POS](${SITE_URL}/industries/optics): Frame variants, barcode labels, customer profiles, and a free online store for sunglasses and frames`,
    `- [Free POS Egypt](${SITE_URL}/free-pos-egypt): Free POS for Egypt with EGP pricing, Arabic receipts, and a free online store`,
    `- [Free online store Egypt](${SITE_URL}/free-online-store-egypt): Free Arabic storefront in EGP, stock synced with the free POS, no commission on the free plan`,
    '',
    `## Free tools`,
    '',
    `- [Free tools for merchants](${SITE_URL}/tools): Browser tools with no signup and no watermark`,
    `- [Barcode generator](${SITE_URL}/tools/barcode-generator): Scannable Code 128 and EAN-13 barcodes as high-resolution PNG downloads`,
    `- [QR code generator](${SITE_URL}/tools/qr-code-generator): Print-ready QR codes for store links, menus, and WhatsApp`,
    `- [Profit margin calculator](${SITE_URL}/tools/profit-margin-calculator): Profit, margin, and markup from cost and price, or a selling price from a target margin`,
    `- [Egypt VAT calculator](${SITE_URL}/tools/vat-calculator): Add or extract Egypt 14% VAT from any amount`,
    `- [Invoice generator](${SITE_URL}/tools/invoice-generator): Free printable bilingual invoice and receipt maker with optional 14% VAT`,
    `- [Discount calculator](${SITE_URL}/tools/discount-calculator): Percent-off final price, or discount percent from original and sale prices`,
    `- [Price tag generator](${SITE_URL}/tools/price-tag-generator): Printable A4 shelf labels with price and optional Code 128 barcode`,
    `- [Dead stock report template](${SITE_URL}/tools/dead-stock-report): Printable and CSV aging stock template with 30, 60, and 90-day buckets`,
    '',
    `## Documentation`,
    '',
    `Merchant docs follow an onboarding path: account and store, catalogue, stock, first sale, then online store and growth topics.`,
    '',
    `Full docs with all content inline: ${SITE_URL}/llms-full.txt`,
    `Arabic docs use the same URLs under ${SITE_URL}/ar/docs/...`,
    '',
    `### Start here`,
    '',
    `- [Docs home](${SITE_URL}/docs): Journey hub for first week, sell in store, sell online, and grow`,
    `- [Quick setup](${SITE_URL}/docs/getting-started/onboarding): From a fresh account to the first sale`,
    `- [First-week checklist](${SITE_URL}/docs/getting-started/first-week-checklist): Day-by-day plan for the first week`,
    `- [Your first sale](${SITE_URL}/docs/getting-started/your-first-sale): Open New Sale and take payment`,
    `- [Go live online](${SITE_URL}/docs/getting-started/go-live-online): Turn on the free online store`,
    `- [Changelog](${SITE_URL}/docs/changelog): Recent product updates`,
    '',
  ];

  for (const section of sections) {
    lines.push(`### ${section.title}`);
    lines.push('');

    for (const slug of section.pageSlugs) {
      const docsPath =
        section.key === 'overview' || section.key === slug
          ? slug === 'index'
            ? '/docs'
            : `/docs/${slug}`
          : `/docs/${section.key}/${slug}`;

      const page = pageByDocsPath.get(docsPath);
      if (!page) continue;

      const desc = page.description ? `: ${page.description}` : '';
      lines.push(`- [${page.title}](${page.url})${desc}`);
    }

    lines.push('');
  }

  lines.push(`## Links`);
  lines.push('');
  lines.push(`- Website: ${SITE_URL}`);
  lines.push(`- Documentation: ${SITE_URL}/docs`);
  lines.push(`- Features: ${SITE_URL}/features`);
  lines.push(`- Pricing: ${SITE_URL}/pricing`);
  lines.push(`- Contact: ${SITE_URL}/contact`);
  lines.push(`- Auth for agents: ${SITE_URL}/auth.md`);
  lines.push(`- API catalog: ${SITE_URL}/.well-known/api-catalog`);
  lines.push('');

  const content = lines.join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
