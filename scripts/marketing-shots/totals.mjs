/**
 * Quick pagination totals for key resources.
 *   node --env-file=scripts/marketing-shots/.env.local scripts/marketing-shots/totals.mjs
 */
import { login, api } from './lib/api.mjs';
import { STORE_ID } from './lib/config.mjs';

await login();

const endpoints = [
  ['products', '/v1/tenant/products?page=1&limit=1'],
  ['customers', '/v1/tenant/customers?page=1&limit=1'],
  ['orders', '/v1/tenant/orders?page=1&limit=1'],
  ['purchase-orders', '/v1/tenant/purchase-orders?page=1&limit=1'],
  ['suppliers', '/v1/tenant/suppliers?page=1&limit=1'],
  ['returns', '/v1/tenant/returns?page=1&limit=1'],
  [
    'inventory',
    `/v1/tenant/inventory?page=1&limit=1&storeId=${STORE_ID}`,
  ],
];

for (const [name, path] of endpoints) {
  const res = await api('GET', path);
  const total = res.body?.meta?.pagination?.totalItems;
  if (total === undefined) {
    console.log(`${name}: FAIL ${res.status} ${JSON.stringify(res.body?.error || res.body).slice(0, 200)}`);
  } else {
    console.log(`${name}: ${total}`);
  }
}
