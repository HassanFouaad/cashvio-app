/**
 * Print tenant totals + recent orders + month sales overview.
 *   node --env-file=scripts/marketing-shots/.env.local scripts/marketing-shots/status.mjs
 */
import { login, api } from './lib/api.mjs';
await login();

const orders = await api('GET', '/v1/tenant/orders?page=1&limit=1');
console.log('TOTAL ORDERS:', orders.body.meta.pagination.totalItems);

const cust = await api('GET', '/v1/tenant/customers?page=1&limit=1');
console.log('TOTAL CUSTOMERS:', cust.body.meta.pagination.totalItems);

const prods = await api('GET', '/v1/tenant/products?page=1&limit=1');
console.log('TOTAL PRODUCTS:', prods.body.meta.pagination.totalItems);

// Sample recent orders
const recent = await api('GET', '/v1/tenant/orders?page=1&limit=8');
console.log('\nRECENT ORDERS:');
for (const o of recent.body.data) {
  console.log(`  ${o.orderNumber} | ${o.customerName || o.customer?.name || '-'} | ch:${o.channel?.name||'-'} | ${o.fulfillmentMethod} | pay:${o.paymentStatus} | ${o.currency} ${o.totalAmount} | ${new Date(o.orderDate).toISOString().slice(0,10)}`);
}

// Analytics: this month sales overview
const now = new Date();
const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
const end = new Date(now.getFullYear(), now.getMonth()+1, 0, 23, 59, 59).toISOString();
const ov = await api('GET', `/v1/tenant/orders/analytics/sales-overview?view=DAY&startDate=${start}&endDate=${end}&timezone=Africa/Cairo`);
console.log('\nSALES OVERVIEW (this month):', ov.status);
if (ov.ok) {
  const d = ov.body.data;
  console.log('  ', JSON.stringify({revenue:d.totalRevenue, orders:d.totalOrders, aov:d.averageOrderValue, profit:d.grossProfit||d.totalProfit}));
}
