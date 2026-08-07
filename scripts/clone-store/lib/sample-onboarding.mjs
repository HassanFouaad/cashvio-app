/**
 * Markers for the default catalog seeded by BE tenant onboarding
 * (TenantOnboardingService). Clone-store deletes these before seeding
 * the scraped catalogue.
 */

/** SKU prefix used by onboarding sample variants (`SAMPLE-1`, `SAMPLE-2`) */
export const SAMPLE_SKU_PREFIX = 'SAMPLE-';

/** Exact category names (en + ar) */
export const SAMPLE_CATEGORY_NAMES = new Set([
  'Sample Category',
  'القسم التجريبي',
]);

/** Exact product names (en + ar) */
export const SAMPLE_PRODUCT_NAMES = new Set([
  'Sample Product 1',
  'Sample Product 2',
  'منتج تجريبي ١',
  'منتج تجريبي ٢',
]);

export function isSampleCategoryName(name) {
  return SAMPLE_CATEGORY_NAMES.has(String(name || '').trim());
}

export function isSampleProductName(name) {
  return SAMPLE_PRODUCT_NAMES.has(String(name || '').trim());
}

export function isSampleSku(sku) {
  return String(sku || '')
    .toUpperCase()
    .startsWith(SAMPLE_SKU_PREFIX);
}
