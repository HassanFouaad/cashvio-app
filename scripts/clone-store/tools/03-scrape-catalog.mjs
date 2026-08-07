/**
 * Scrape a shop page into catalog.json for seeding.
 *
 * Strategies (in order, merged):
 *  1. Shopify-style /products.json (when available)
 *  2. JSON-LD Product / ItemList / Offer on the page
 *  3. Heuristic product cards (data attributes, price patterns)
 *
 * The AI agent MUST review catalog.json before seeding and fix prices/names
 * when the scraper misses platform-specific markup.
 *
 *   node tools/03-scrape-catalog.mjs --run <id> --url https://example.com
 */
import { chromium } from 'playwright';

import '../lib/load-env.mjs';
import {
  createRunId,
  ensureRunDir,
  parseArgs,
  resolveRunId,
  runPath,
  writeJson,
} from '../lib/run-io.mjs';

function parseMoney(raw) {
  if (raw == null) return null;
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return Math.round(raw * 100) / 100;
  }
  let s = String(raw).trim();
  if (!s) return null;
  // Arabic-Indic digits → Western
  s = s.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  s = s.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  // Keep digits, separators, minus
  s = s.replace(/[^\d.,-]/g, '');
  if (!s) return null;
  // Decide decimal separator: last comma/dot wins as decimal if 1–2 digits after
  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  if (lastComma > lastDot) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else {
    s = s.replace(/,/g, '');
  }
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100) / 100;
}

function absUrl(base, href) {
  if (!href) return null;
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

function dedupeProducts(products) {
  const seen = new Map();
  for (const p of products) {
    if (!p?.name || p.price == null) continue;
    const key = `${p.name.trim().toLowerCase()}|${p.price}`;
    if (!seen.has(key)) seen.set(key, p);
  }
  return [...seen.values()];
}

function guessIndustry(text) {
  const hay = String(text || '').toLowerCase();
  const rules = [
    [
      'fashion',
      /fashion|apparel|clothing|boutique|scarf|scarves|hijab|ملابس|أزياء|موضة|شال|طرح|كريب|شيفون/,
    ],
    ['restaurant', /restaurant|cafe|coffee|bakery|مطعم|كافيه|مقهى/],
    ['grocery', /grocery|supermarket|market|بقالة|سوبر/],
    ['pharmacy', /pharmacy|beauty|skincare|صيدل|عناية|تجميل/],
    ['electronics', /electronics|mobile|phone|gadget|إلكترون|موبايل/],
    ['jewelry', /jewelry|jewellery|gold|مجوهر|ذهب/],
    ['kids', /kids|toys|أطفال|ألعاب/],
  ];
  for (const [industry, re] of rules) {
    if (re.test(hay)) return industry;
  }
  return 'general';
}

async function tryShopifyProducts(baseUrl, max = 100) {
  const endpoints = [
    new URL('/products.json?limit=250', baseUrl).href,
    new URL('/collections/all/products.json?limit=250', baseUrl).href,
  ];
  const products = [];
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'CashvioCloneStore/1.0',
        },
      });
      if (!res.ok) continue;
      const json = await res.json();
      const rows = json.products || [];
      for (const p of rows) {
        const variant = (p.variants || [])[0];
        const price = parseMoney(variant?.price ?? p.price);
        if (!p.title || price == null) continue;
        const image =
          p.images?.[0]?.src ||
          p.image?.src ||
          variant?.featured_image?.src ||
          null;
        products.push({
          name: String(p.title).trim(),
          price,
          compareAtPrice: parseMoney(variant?.compare_at_price),
          category: p.product_type || p.vendor || 'General',
          description: (p.body_html || '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 2000),
          imageUrl: image,
          sourceSku: variant?.sku || null,
          sourceUrl: absUrl(baseUrl, `/products/${p.handle}`),
          source: 'shopify-json',
        });
        if (products.length >= max) break;
      }
      if (products.length) break;
    } catch {
      // not Shopify or blocked
    }
  }
  return products;
}

async function scrapePage(page, pageUrl) {
  await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));

  return page.evaluate(() => {
    const products = [];
    const brandColors = {};

    // theme-color / CSS variables
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta?.content) brandColors.primary = themeMeta.content.trim();
    const rootStyles = getComputedStyle(document.documentElement);
    for (const key of [
      '--primary',
      '--color-primary',
      '--brand',
      '--theme-color',
    ]) {
      const v = rootStyles.getPropertyValue(key).trim();
      if (v && !brandColors.primary) brandColors.primary = v;
    }

    const storeName =
      document.querySelector('meta[property="og:site_name"]')?.content ||
      document.querySelector('meta[name="application-name"]')?.content ||
      document.title?.split(/[|\-–—]/)[0]?.trim() ||
      location.hostname;

    // JSON-LD
    for (const script of document.querySelectorAll(
      'script[type="application/ld+json"]',
    )) {
      let data;
      try {
        data = JSON.parse(script.textContent || 'null');
      } catch {
        continue;
      }
      const nodes = Array.isArray(data)
        ? data
        : data?.['@graph']
          ? data['@graph']
          : [data];
      for (const node of nodes) {
        if (!node) continue;
        const type = node['@type'];
        const types = Array.isArray(type) ? type : [type];
        if (types.includes('Product')) {
          const offers = Array.isArray(node.offers)
            ? node.offers[0]
            : node.offers;
          const price = offers?.price ?? offers?.lowPrice;
          const image = Array.isArray(node.image)
            ? node.image[0]
            : typeof node.image === 'object'
              ? node.image?.url
              : node.image;
          products.push({
            name: node.name,
            price,
            category: node.category || 'General',
            description: node.description || '',
            imageUrl: image || null,
            sourceUrl: node.url || location.href,
            source: 'json-ld',
          });
        }
        if (types.includes('ItemList') && Array.isArray(node.itemListElement)) {
          for (const el of node.itemListElement) {
            const item = el.item || el;
            if (!item?.name) continue;
            const offers = Array.isArray(item.offers)
              ? item.offers[0]
              : item.offers;
            products.push({
              name: item.name,
              price: offers?.price ?? item.price,
              category: item.category || 'General',
              description: item.description || '',
              imageUrl: Array.isArray(item.image)
                ? item.image[0]
                : item.image || null,
              sourceUrl: item.url || location.href,
              source: 'json-ld-list',
            });
          }
        }
      }
    }

    // Heuristic cards
    const cardSelectors = [
      '[data-product]',
      '[data-product-id]',
      '.product-card',
      '.product-item',
      '.product',
      'li.product',
      'article.product',
      '.grid__item',
    ];
    const cards = new Set();
    for (const sel of cardSelectors) {
      document.querySelectorAll(sel).forEach((el) => cards.add(el));
    }
    for (const card of cards) {
      const nameEl =
        card.querySelector(
          '[data-product-title], .product-title, .product-name, h2, h3, a[title]',
        ) || card.querySelector('a');
      const priceEl = card.querySelector(
        '[data-product-price], .price, .product-price, .money, [class*="price"]',
      );
      const imgEl = card.querySelector('img');
      const linkEl = card.querySelector('a[href]');
      const name =
        nameEl?.getAttribute('title') ||
        nameEl?.textContent?.trim() ||
        imgEl?.alt;
      const priceText = priceEl?.textContent || card.getAttribute('data-price');
      if (!name || !priceText) continue;
      products.push({
        name: name.replace(/\s+/g, ' ').slice(0, 120),
        price: priceText,
        category: 'General',
        description: '',
        imageUrl: imgEl?.currentSrc || imgEl?.src || null,
        sourceUrl: linkEl?.href || location.href,
        source: 'heuristic',
      });
    }

    // Header / hero candidates: og:image, twitter, large banners
    const headerImages = [];
    const pushHeader = (u) => {
      if (!u || typeof u !== 'string') return;
      try {
        const abs = new URL(u, location.href).href;
        if (!headerImages.includes(abs)) headerImages.push(abs);
      } catch {
        /* ignore */
      }
    };
    pushHeader(
      document.querySelector('meta[property="og:image"]')?.content,
    );
    pushHeader(
      document.querySelector('meta[name="twitter:image"]')?.content,
    );
    for (const img of document.querySelectorAll(
      'header img, .hero img, .banner img, [class*="hero"] img, [class*="banner"] img, .swiper-slide img, .carousel img',
    )) {
      pushHeader(img.currentSrc || img.src);
      if (headerImages.length >= 6) break;
    }

    // Category tiles with images (Shopify / common patterns)
    const categoryDetails = [];
    const catSeen = new Set();
    for (const a of document.querySelectorAll(
      'a[href*="collection"], a[href*="categor"], a[href*="collections"], a[href*="/ أقسام"], .collection-card, [class*="category"] a',
    )) {
      const label = (a.getAttribute('title') || a.textContent || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 80);
      const img = a.querySelector('img');
      const imageUrl = img?.currentSrc || img?.src || null;
      if (!label || label.length < 2 || catSeen.has(label.toLowerCase())) {
        continue;
      }
      catSeen.add(label.toLowerCase());
      categoryDetails.push({ name: label, imageUrl });
      if (categoryDetails.length >= 20) break;
    }

    const bodyText = document.body?.innerText?.slice(0, 4000) || '';
    return {
      storeName,
      pageTitle: document.title,
      brandColors,
      bodySnippet: bodyText,
      headerImages,
      categoryDetails,
      rawProducts: products,
    };
  });
}

async function main() {
  const { flags } = parseArgs();
  const url = flags.url || process.env.CLONE_SOURCE_URL;
  if (!url) throw new Error('Pass --url <shop-url> or set CLONE_SOURCE_URL');

  let runId = resolveRunId(flags);
  if (!runId) {
    runId = createRunId(new URL(url).hostname);
    console.log(`[03] created run id ${runId}`);
  }
  ensureRunDir(runId);

  const maxProducts = Number(flags.max || process.env.CLONE_MAX_PRODUCTS || 80);
  console.log(`[03] scraping ${url}`);

  const shopifyProducts = await tryShopifyProducts(url, maxProducts);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent:
      'Mozilla/5.0 (compatible; CashvioCloneStore/1.0; +https://cash-vio.com)',
  });

  let pageData;
  try {
    pageData = await scrapePage(page, url);

    // Follow a few product links if we have almost nothing
    if (
      shopifyProducts.length === 0 &&
      (pageData.rawProducts?.length || 0) < 3
    ) {
      const links = await page.$$eval('a[href*="product"]', (as) =>
        [...new Set(as.map((a) => a.href))].slice(0, 12),
      );
      for (const link of links) {
        try {
          const more = await scrapePage(page, link);
          pageData.rawProducts.push(...(more.rawProducts || []));
        } catch {
          // skip dead links
        }
      }
    }
  } finally {
    await browser.close();
  }

  const normalized = [];
  for (const raw of [...shopifyProducts, ...(pageData.rawProducts || [])]) {
    const price = parseMoney(raw.price);
    if (!raw.name || price == null) continue;
    normalized.push({
      name: String(raw.name).trim().slice(0, 120),
      price,
      compareAtPrice: parseMoney(raw.compareAtPrice),
      category: (raw.category || 'General').toString().trim() || 'General',
      description: (raw.description || '').toString().slice(0, 2000),
      imageUrl: raw.imageUrl || null,
      sourceSku: raw.sourceSku || null,
      sourceUrl: raw.sourceUrl || url,
      source: raw.source || 'unknown',
    });
  }

  const products = dedupeProducts(normalized).slice(0, maxProducts);
  const industry =
    flags.industry ||
    process.env.CLONE_INDUSTRY ||
    guessIndustry(
      `${pageData.storeName} ${pageData.pageTitle} ${pageData.bodySnippet}`,
    );

  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];
  if (categories.length === 0) categories.push('General');

  const categoryDetails = (pageData.categoryDetails || []).filter((c) =>
    categories.some(
      (name) => name.toLowerCase() === String(c.name || '').toLowerCase(),
    ),
  );
  // Keep unmatched scraped category tiles that still look useful
  for (const c of pageData.categoryDetails || []) {
    if (!c?.name) continue;
    if (
      categoryDetails.some(
        (x) => x.name.toLowerCase() === c.name.toLowerCase(),
      )
    ) {
      continue;
    }
    if (c.imageUrl) categoryDetails.push(c);
  }

  const catalog = {
    sourceUrl: url,
    scrapedAt: new Date().toISOString(),
    storeName: flags.name || pageData.storeName || new URL(url).hostname,
    industry,
    brandColors: pageData.brandColors || {},
    notes: '',
    headerImages: (pageData.headerImages || []).slice(0, 6),
    categoryDetails,
    categories,
    products,
    stats: {
      productCount: products.length,
      categoryCount: categories.length,
      headerImageCount: (pageData.headerImages || []).length,
      sources: Object.fromEntries(
        Object.entries(
          products.reduce((acc, p) => {
            acc[p.source] = (acc[p.source] || 0) + 1;
            return acc;
          }, {}),
        ),
      ),
    },
  };

  writeJson(runPath(runId, 'catalog.json'), catalog);
  console.log(
    `[03] wrote catalog.json — ${products.length} products, industry=${industry}, store="${catalog.storeName}"`,
  );
  console.log(
    '[03] REVIEW catalog.json before seeding. Fix prices/names if needed.',
  );
  console.log(`[03] run id: ${runId}`);
}

main().catch((err) => {
  console.error('[03] FAILED:', err.message || err);
  process.exit(1);
});
