/**
 * Cashvio storefront theme catalog (stable UUIDs across environments).
 * Source: be migration seed-store-front-themes.
 *
 * Display names after later renames (Bistro/Market/…) still use these keys.
 */

export const THEMES = {
  CLASSIC: {
    key: 'CLASSIC',
    themeId: '0198a000-0000-7000-8000-000000000001',
    paletteId: '0198b000-0000-7000-8000-000000000001',
    fontPreset: 'CLASSIC',
    radiusPreset: 'SOFT',
    fits: ['general', 'mixed', 'unknown'],
  },
  WARM: {
    key: 'WARM',
    themeId: '0198a000-0000-7000-8000-000000000002',
    paletteId: '0198b000-0000-7000-8000-000000000002',
    fontPreset: 'FRIENDLY',
    radiusPreset: 'ROUNDED',
    fits: [
      'restaurant',
      'cafe',
      'coffee',
      'bakery',
      'food',
      'bistro',
      'kitchen',
    ],
  },
  FRESH: {
    key: 'FRESH',
    themeId: '0198a000-0000-7000-8000-000000000003',
    paletteId: '0198b000-0000-7000-8000-000000000003',
    fontPreset: 'CLEAN',
    radiusPreset: 'SOFT',
    fits: [
      'grocery',
      'supermarket',
      'minimarket',
      'produce',
      'market',
      'organic',
    ],
  },
  CARE: {
    key: 'CARE',
    themeId: '0198a000-0000-7000-8000-000000000004',
    paletteId: '0198b000-0000-7000-8000-000000000004',
    fontPreset: 'CLEAN',
    radiusPreset: 'SOFT',
    fits: [
      'pharmacy',
      'optics',
      'beauty',
      'skincare',
      'clinic',
      'health',
      'cosmetics',
      'spa',
    ],
  },
  TECH: {
    key: 'TECH',
    themeId: '0198a000-0000-7000-8000-000000000005',
    paletteId: '0198b000-0000-7000-8000-000000000005',
    fontPreset: 'TECHNICAL',
    radiusPreset: 'SHARP',
    fits: [
      'electronics',
      'mobile',
      'phones',
      'gadgets',
      'hardware',
      'computer',
      'tech',
    ],
  },
  ELEGANT: {
    key: 'ELEGANT',
    themeId: '0198a000-0000-7000-8000-000000000006',
    paletteId: '0198b000-0000-7000-8000-000000000006',
    fontPreset: 'ELEGANT',
    radiusPreset: 'SHARP',
    fits: [
      'jewelry',
      'jewellery',
      'furniture',
      'gifts',
      'luxury',
      'home',
      'decor',
      'watches',
    ],
  },
  EDITORIAL: {
    key: 'EDITORIAL',
    themeId: '0198a000-0000-7000-8000-000000000007',
    paletteId: '0198b000-0000-7000-8000-000000000007',
    fontPreset: 'MODERN',
    radiusPreset: 'SHARP',
    fits: [
      'fashion',
      'clothing',
      'apparel',
      'boutique',
      'streetwear',
      'shoes',
      'footwear',
      'bags',
      'accessories',
      'scarf',
      'scarves',
      'hijab',
      'شال',
      'طرح',
      'كريب',
      'أزياء',
      'موضة',
      'ملابس',
    ],
  },
  PLAYFUL: {
    key: 'PLAYFUL',
    themeId: '0198a000-0000-7000-8000-000000000008',
    paletteId: '0198b000-0000-7000-8000-000000000008',
    fontPreset: 'FRIENDLY',
    radiusPreset: 'PILL',
    fits: [
      'kids',
      'toys',
      'bookstore',
      'books',
      'stationery',
      'gifts',
      'hobby',
      'pet',
    ],
  },
};

/**
 * Apply scraped brand primary into a theme PATCH (customTokens).
 */
export function applyBrandPrimary(patch, brandColors) {
  const primary = normalizeHex(brandColors?.primary);
  if (!primary) return patch;
  return {
    ...patch,
    customTokens: {
      light: {
        primary,
        primaryForeground: '#ffffff',
      },
      dark: {
        primary,
        primaryForeground: '#0a0a0a',
      },
    },
  };
}

/**
 * Pick a theme from free-text industry / store description.
 * Returns the theme object + reason.
 *
 * Prefer industry-driven selection. Pass `forcedKey` only when the human
 * explicitly overrides (still applies brandColors when present).
 */
export function pickTheme({
  industry,
  storeName,
  notes,
  brandColors,
  forcedKey,
} = {}) {
  let best = THEMES.CLASSIC;
  let matched = [];
  let reason;

  const forced = forcedKey ? String(forcedKey).toUpperCase() : '';
  if (forced && THEMES[forced]) {
    best = THEMES[forced];
    reason = `forced via --theme ${forced}`;
  } else {
    const hay = [industry, storeName, notes]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    let bestScore = 0;
    for (const theme of Object.values(THEMES)) {
      let score = 0;
      const hits = [];
      for (const keyword of theme.fits) {
        if (hay.includes(keyword)) {
          score += keyword.length > 5 ? 2 : 1;
          hits.push(keyword);
        }
      }
      if (score > bestScore) {
        bestScore = score;
        best = theme;
        matched = hits;
      }
    }
    reason =
      matched.length > 0
        ? `matched keywords: ${matched.join(', ')}`
        : 'default CLASSIC (no industry keywords matched)';
  }

  const patch = applyBrandPrimary(
    {
      themeId: best.themeId,
      paletteId: best.paletteId,
      fontPreset: best.fontPreset,
      radiusPreset: best.radiusPreset,
      status: 'ACTIVE',
    },
    brandColors,
  );

  return {
    key: best.key,
    reason,
    patch,
    brandPrimary: normalizeHex(brandColors?.primary),
  };
}

function normalizeHex(value) {
  if (!value || typeof value !== 'string') return null;
  const m = value.trim().match(/^#?([0-9a-fA-F]{6})$/);
  return m ? `#${m[1].toLowerCase()}` : null;
}
