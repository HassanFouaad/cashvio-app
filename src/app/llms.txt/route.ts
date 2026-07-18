import { source } from '@/lib/docs-source';
import { siteConfig } from '@/config/site';

export const revalidate = false; // static at build time

export function GET() {
  const SITE_URL = siteConfig.url;
  const pages = source.getPages('en');

  const sections: Map<string, { title: string; description: string; url: string }[]> = new Map();

  for (const page of pages) {
    const docsPath = page.url.replace(/^\/(en|ar)/, '');
    const parts = docsPath.replace('/docs/', '').split('/');
    const section = parts.length > 1 ? parts[0] : 'overview';

    if (!sections.has(section)) {
      sections.set(section, []);
    }

    sections.get(section)!.push({
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
    `- [Features overview](${SITE_URL}/features): All modules — products, inventory, orders, customers, suppliers, analytics, POS, and team permissions`,
    `- [Free POS / free cashier](${SITE_URL}/features/free-pos): 100% free POS system — sales screen, cash register, shifts, thermal receipts, and live inventory`,
    `- [Free online store](${SITE_URL}/features/free-online-store): Create a free online store synced with your free POS — no commission, Arabic & English storefront`,
    `- [Arabic POS & storefront](${SITE_URL}/features/arabic-pos): Point of sale and online store built natively for Arabic with true RTL, bilingual receipts, and regional payment methods`,
    `- [Omnichannel retail](${SITE_URL}/features/omnichannel-retail): One dashboard for physical stores and online storefront with unified inventory, orders, and customers`,
    `- [Free inventory management](${SITE_URL}/features/inventory-management): Per-variant, per-store stock tracking with low-stock alerts, purchase orders, and a full audit trail`,
    `- [Coupons & discounts](${SITE_URL}/features/coupons-and-discounts): Percentage and fixed-amount discount codes with usage limits, scheduling, and real-time checkout validation`,
    `- [Order management](${SITE_URL}/features/order-management): Orders from POS, online store, and manual entry in one list — fulfillment statuses, partial payments, digital receipts, and WhatsApp updates`,
    `- [Customer management](${SITE_URL}/features/customer-management): Customer profiles with visits, spending, store credit, addresses, and full order history — starting from a phone number`,
    `- [Sales analytics](${SITE_URL}/features/sales-analytics): Six ready reports — overview, profit, customers, returns, staff, and plain-language insights with recommended actions`,
    `- [Purchase orders & suppliers](${SITE_URL}/features/purchase-orders): Two-step purchase orders with partial receiving, automatic inventory updates, and a supplier database`,
    `- [Returns & refunds](${SITE_URL}/features/returns-and-refunds): Item-level returns with restock control, recorded reasons, an approval flow, and four refund methods including store credit`,
    `- [Multi-store management](${SITE_URL}/features/multi-store-management): Separate stock, prices, and settings per branch with one dashboard, stock transfers, and per-store reports`,
    `- [Team & permissions](${SITE_URL}/features/team-management): Individual staff accounts with fine-grained roles, store-scoped access, and per-person sales reports`,
    `- [Pricing](${SITE_URL}/pricing): Plans and pricing, including the free forever plan`,
    `- [Register](${SITE_URL}/register): Create a free account`,
    '',
    `## Documentation`,
    '',
    `Full docs with all content inline: ${SITE_URL}/llms-full.txt`,
    '',
  ];

  for (const [section, pages] of sections) {
    const sectionTitle = section
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    lines.push(`### ${sectionTitle}`);
    lines.push('');

    for (const page of pages) {
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
  lines.push('');

  const content = lines.join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
