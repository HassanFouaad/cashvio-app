/**
 * Backfill customer spend / visits from orders.
 *   node --env-file=scripts/marketing-shots/.env.local scripts/marketing-shots/customer-stats.mjs
 */
import { login, api } from './lib/api.mjs';
await login();

// Fetch all orders (paginate)
const all = [];
let page = 1;
while (true) {
  const r = await api('GET', `/v1/tenant/orders?page=${page}&limit=100`);
  const items = r.body.data || [];
  all.push(...items);
  const tp = r.body.meta.pagination.totalPages;
  if (page >= tp) break;
  page++;
}
console.log('fetched orders:', all.length);

// Group by customerId
const stats = new Map();
for (const o of all) {
  if (!o.customerId) continue;
  const s = stats.get(o.customerId) || { spent: 0, visits: 0, last: 0 };
  s.spent += Number(o.totalAmount) || 0;
  s.visits += 1;
  const t = new Date(o.orderDate).getTime();
  if (t > s.last) s.last = t;
  stats.set(o.customerId, s);
}
console.log('customers with orders:', stats.size);

// Fetch customers
const custRes = await api('GET', '/v1/tenant/customers?page=1&limit=100');
const customers = custRes.body.data || [];

let updated = 0;
for (const c of customers) {
  const s = stats.get(c.id);
  if (!s) continue;
  const avg = s.visits ? Math.round((s.spent / s.visits) * 100) / 100 : 0;
  const payload = {
    totalSpent: Math.round(s.spent * 100) / 100,
    totalVisits: s.visits,
    averageOrderValue: avg,
    lastVisitAt: new Date(s.last).toISOString(),
  };
  const r = await api('PATCH', `/v1/tenant/customers/${c.id}`, payload);
  if (r.ok) { updated++; console.log(`  ${c.name}: spent ${payload.totalSpent}, visits ${payload.totalVisits}`); }
  else console.log(`  FAIL ${c.name}`, r.status, JSON.stringify(r.body).slice(0, 150));
}
console.log('updated', updated);
