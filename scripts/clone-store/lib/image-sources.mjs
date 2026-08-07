/**
 * Curated Unsplash photo IDs for clone-store category + hero fallbacks.
 * License: Unsplash License (https://unsplash.com/license) — free commercial use.
 *
 * Prefer scraped images from the source shop. Use these only when the scrape
 * has no category / header imagery.
 */

const unsplash = (id, { w = 1200, h = 900 } = {}) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const unsplashHero = (id) => unsplash(id, { w: 1920, h: 900 });

/** Default square when nothing matches */
export const DEFAULT_CATEGORY_IMAGE = unsplash(
  'photo-1441986300917-64674bd600d8',
  { w: 900, h: 900 },
);

/**
 * Keyword (substring, case-insensitive) → category image URL.
 * Longer / more specific keys are preferred by the picker.
 */
export const CATEGORY_IMAGE_BY_KEYWORD = {
  scarf: unsplash('photo-1601924994987-69e26d50dc26', { w: 900, h: 900 }),
  scarves: unsplash('photo-1601924994987-69e26d50dc26', { w: 900, h: 900 }),
  hijab: unsplash('photo-1601924994987-69e26d50dc26', { w: 900, h: 900 }),
  شال: unsplash('photo-1601924994987-69e26d50dc26', { w: 900, h: 900 }),
  طرح: unsplash('photo-1601924994987-69e26d50dc26', { w: 900, h: 900 }),
  كريب: unsplash('photo-1601924994987-69e26d50dc26', { w: 900, h: 900 }),
  شيفون: unsplash('photo-1601924994987-69e26d50dc26', { w: 900, h: 900 }),
  gallery: unsplash('photo-1515886657613-9f3515b0c78f', { w: 900, h: 900 }),
  fashion: unsplash('photo-1483985988355-763728e1935b', { w: 900, h: 900 }),
  clothing: unsplash('photo-1489987707025-941f729c745d', { w: 900, h: 900 }),
  apparel: unsplash('photo-1441986300917-64674bd600d8', { w: 900, h: 900 }),
  dress: unsplash('photo-1595777457583-95e059d581b8', { w: 900, h: 900 }),
  dresses: unsplash('photo-1595777457583-95e059d581b8', { w: 900, h: 900 }),
  فساتين: unsplash('photo-1595777457583-95e059d581b8', { w: 900, h: 900 }),
  shoes: unsplash('photo-1460353581641-37baddab0fa2', { w: 900, h: 900 }),
  footwear: unsplash('photo-1460353581641-37baddab0fa2', { w: 900, h: 900 }),
  احذيه: unsplash('photo-1460353581641-37baddab0fa2', { w: 900, h: 900 }),
  bags: unsplash('photo-1553062407-98eeb64c6a62', { w: 900, h: 900 }),
  accessories: unsplash('photo-1523170335258-f5ed11844a49', { w: 900, h: 900 }),
  jewelry: unsplash('photo-1515562141207-7a88fb7ce338', { w: 900, h: 900 }),
  jewellery: unsplash('photo-1515562141207-7a88fb7ce338', { w: 900, h: 900 }),
  beauty: unsplash('photo-1596462502278-27bfdc403348', { w: 900, h: 900 }),
  skincare: unsplash('photo-1556228720-195a672e8a03', { w: 900, h: 900 }),
  pharmacy: unsplash('photo-1584308666744-24d5c474f2ae', { w: 900, h: 900 }),
  grocery: unsplash('photo-1542838132-92c53300491e', { w: 900, h: 900 }),
  food: unsplash('photo-1504674900247-0877df9cc836', { w: 900, h: 900 }),
  restaurant: unsplash('photo-1517248135467-4c7edcad34c4', { w: 900, h: 900 }),
  cafe: unsplash('photo-1495474472287-4d71bcdd2085', { w: 900, h: 900 }),
  bakery: unsplash('photo-1509440159596-0249088772ff', { w: 900, h: 900 }),
  electronics: unsplash('photo-1498049794561-7780e7231661', { w: 900, h: 900 }),
  mobile: unsplash('photo-1511707171634-5f897ff02aa9', { w: 900, h: 900 }),
  kids: unsplash('photo-1503919545889-aef636e10ad0', { w: 900, h: 900 }),
  toys: unsplash('photo-1558060370-d644479cb6f7', { w: 900, h: 900 }),
  books: unsplash('photo-1512820790803-83ca734da794', { w: 900, h: 900 }),
  furniture: unsplash('photo-1555041469-a586c61ea9bc', { w: 900, h: 900 }),
  decor: unsplash('photo-1616486338812-3dadae4b4ace', { w: 900, h: 900 }),
  ملابس: unsplash('photo-1489987707025-941f729c745d', { w: 900, h: 900 }),
};

/** Per-industry default category image when no keyword matches */
export const INDUSTRY_CATEGORY_DEFAULTS = {
  fashion: unsplash('photo-1483985988355-763728e1935b', { w: 900, h: 900 }),
  restaurant: unsplash('photo-1517248135467-4c7edcad34c4', { w: 900, h: 900 }),
  grocery: unsplash('photo-1542838132-92c53300491e', { w: 900, h: 900 }),
  pharmacy: unsplash('photo-1596462502278-27bfdc403348', { w: 900, h: 900 }),
  electronics: unsplash('photo-1498049794561-7780e7231661', { w: 900, h: 900 }),
  jewelry: unsplash('photo-1515562141207-7a88fb7ce338', { w: 900, h: 900 }),
  kids: unsplash('photo-1503919545889-aef636e10ad0', { w: 900, h: 900 }),
  general: DEFAULT_CATEGORY_IMAGE,
};

/**
 * Stylish wide hero / header images by industry (2–3 each).
 * Prefer scraped og:image / banners when available.
 */
export const INDUSTRY_HERO_IMAGES = {
  fashion: [
    unsplashHero('photo-1483985988355-763728e1935b'),
    unsplashHero('photo-1469334031218-e382a71b716b'),
    unsplashHero('photo-1515886657613-9f3515b0c78f'),
  ],
  restaurant: [
    unsplashHero('photo-1517248135467-4c7edcad34c4'),
    unsplashHero('photo-1414235077428-338989a2e8c0'),
    unsplashHero('photo-1504674900247-0877df9cc836'),
  ],
  grocery: [
    unsplashHero('photo-1542838132-92c53300491e'),
    unsplashHero('photo-1488459716781-31db52582fe9'),
    unsplashHero('photo-1579113800032-c38bd7632818'),
  ],
  pharmacy: [
    unsplashHero('photo-1596462502278-27bfdc403348'),
    unsplashHero('photo-1556228720-195a672e8a03'),
    unsplashHero('photo-1570172619644-dfd03ed5d881'),
  ],
  electronics: [
    unsplashHero('photo-1498049794561-7780e7231661'),
    unsplashHero('photo-1518770660439-4636190af475'),
    unsplashHero('photo-1511707171634-5f897ff02aa9'),
  ],
  jewelry: [
    unsplashHero('photo-1515562141207-7a88fb7ce338'),
    unsplashHero('photo-1611591437281-460bfbe1220a'),
    unsplashHero('photo-1605100804763-247f67b3557e'),
  ],
  kids: [
    unsplashHero('photo-1503919545889-aef636e10ad0'),
    unsplashHero('photo-1519238263530-99bdd11df2ea'),
    unsplashHero('photo-1503454537195-1dcabb73ffb9'),
  ],
  general: [
    unsplashHero('photo-1441986300917-64674bd600d8'),
    unsplashHero('photo-1472851294608-062f824d29cc'),
    unsplashHero('photo-1556742049-0cfed4f6a45d'),
  ],
};

/** Theme key → industry bucket for hero/category defaults */
export const THEME_TO_INDUSTRY = {
  EDITORIAL: 'fashion',
  WARM: 'restaurant',
  FRESH: 'grocery',
  CARE: 'pharmacy',
  TECH: 'electronics',
  ELEGANT: 'jewelry',
  PLAYFUL: 'kids',
  CLASSIC: 'general',
};

/**
 * Pick a category image URL from name + industry.
 * @returns {{ url: string, reason: string }}
 */
export function pickCategoryImageUrl(categoryName, industry = 'general') {
  const name = String(categoryName || '').toLowerCase();
  let bestKey = null;
  let bestUrl = null;
  for (const [keyword, url] of Object.entries(CATEGORY_IMAGE_BY_KEYWORD)) {
    if (!name.includes(keyword.toLowerCase())) continue;
    if (!bestKey || keyword.length > bestKey.length) {
      bestKey = keyword;
      bestUrl = url;
    }
  }
  if (bestUrl) {
    return { url: bestUrl, reason: `keyword:${bestKey}` };
  }
  const bucket = normalizeIndustry(industry);
  const url =
    INDUSTRY_CATEGORY_DEFAULTS[bucket] || INDUSTRY_CATEGORY_DEFAULTS.general;
  return { url, reason: `industry:${bucket}` };
}

/**
 * Resolve 1–3 hero image source URLs.
 * Prefers scraped headerImages; fills from industry Unsplash set.
 */
export function pickHeroImageUrls({
  headerImages = [],
  industry = 'general',
  themeKey,
  max = 3,
} = {}) {
  const scraped = (headerImages || [])
    .map((u) => (typeof u === 'string' ? u : u?.url))
    .filter(Boolean);
  const bucket =
    normalizeIndustry(industry) ||
    THEME_TO_INDUSTRY[themeKey] ||
    'general';
  const curated = INDUSTRY_HERO_IMAGES[bucket] || INDUSTRY_HERO_IMAGES.general;
  const urls = [];
  const reasons = [];
  for (const u of scraped) {
    if (urls.length >= max) break;
    if (!urls.includes(u)) {
      urls.push(u);
      reasons.push('scraped');
    }
  }
  for (const u of curated) {
    if (urls.length >= max) break;
    if (!urls.includes(u)) {
      urls.push(u);
      reasons.push(`industry:${bucket}`);
    }
  }
  return { urls, reasons, industry: bucket };
}

export function normalizeIndustry(industry) {
  const hay = String(industry || 'general').toLowerCase();
  if (
    /fashion|clothing|apparel|boutique|scarf|scarves|hijab|shoes|streetwear|شال|طرح|أزياء|موضة|ملابس/.test(
      hay,
    )
  ) {
    return 'fashion';
  }
  if (/restaurant|cafe|coffee|bakery|food|bistro|مطعم|كافيه/.test(hay)) {
    return 'restaurant';
  }
  if (/grocery|supermarket|market|بقالة|سوبر/.test(hay)) return 'grocery';
  if (/pharmacy|beauty|skincare|clinic|cosmetics|صيدل|تجميل|عناية/.test(hay)) {
    return 'pharmacy';
  }
  if (/electronics|mobile|gadget|tech|إلكترون|موبايل/.test(hay)) {
    return 'electronics';
  }
  if (/jewelry|jewellery|luxury|furniture|decor|مجوهر|ذهب/.test(hay)) {
    return 'jewelry';
  }
  if (/kids|toys|books|stationery|أطفال|ألعاب/.test(hay)) return 'kids';
  return 'general';
}
