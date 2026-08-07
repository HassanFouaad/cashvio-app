import path from 'node:path';
import { fileURLToPath } from 'node:url';

import './load-env.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** …/scripts/clone-store */
export const CLONE_ROOT = path.resolve(__dirname, '..');

/** my-app repo root */
export const REPO_ROOT = path.resolve(CLONE_ROOT, '../..');

export const RUNS_DIR = path.join(CLONE_ROOT, 'runs');

export const CONSOLE_URL =
  process.env.CASHVIO_CONSOLE_URL || 'https://console.cash-vio.com';

export const API_URL =
  process.env.CASHVIO_API_URL || `${CONSOLE_URL.replace(/\/$/, '')}/api`;

/** Public storefront host used to print the live URL */
export const STOREFRONT_HOST =
  process.env.CASHVIO_STOREFRONT_HOST || 'cash-vio.com';

export const COOKIE_ACCESS = 'cv_access_token';
export const COOKIE_REFRESH = 'cv_refresh_token';

/** Product name max length enforced by CreateProductDto */
export const PRODUCT_NAME_MAX = 64;

/** Default stock quantity when the source shop does not expose inventory */
export const DEFAULT_STOCK_QTY = Number(process.env.CLONE_DEFAULT_STOCK || 50);

/**
 * Cost is rarely public. When missing, estimate purchase price as this
 * fraction of the selling price (seed/demo only).
 */
export const DEFAULT_COST_RATIO = Number(process.env.CLONE_COST_RATIO || 0.4);

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Set it in the environment or scripts/clone-store/.env.local`,
    );
  }
  return value;
}

export function resolveRunDir(runId) {
  if (!runId) {
    throw new Error('runId is required (pass --run <id> or CLONE_RUN_ID)');
  }
  return path.join(RUNS_DIR, runId);
}
