/**
 * Bulk-seed realistic demo data on a Cashvio tenant (idempotent via CVX-* SKUs).
 *
 * Usage (from repo root, with env loaded):
 *   node --env-file=scripts/marketing-shots/.env.local scripts/marketing-shots/seed.mjs
 *   node --env-file=… scripts/marketing-shots/seed.mjs orders 80
 */
import { login, api, unwrap } from './lib/api.mjs';
import { STORE_ID, CHANNELS, sleep } from './lib/config.mjs';

const TAG = 'CVX';

const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];
const money = (n) => Math.round(n * 100) / 100;

const CATEGORIES = [
  'Apparel',
  'Outerwear',
  'Footwear',
  'Accessories',
  'Bags',
  'Dresses',
  'Activewear',
];

// Original 14 + 26 extras (SKU index = array index + 1)
const PRODUCTS = [
  ['Premium Cotton T-Shirt', 'Apparel', 350, 145],
  ['Slim Fit Jeans', 'Apparel', 780, 320],
  ['Classic Oxford Shirt', 'Apparel', 560, 230],
  ['Merino Knit Sweater', 'Apparel', 880, 360],
  ['Denim Jacket', 'Outerwear', 990, 430],
  ['Wool Blend Overcoat', 'Outerwear', 2450, 1080],
  ['Leather Sneakers', 'Footwear', 1250, 540],
  ['Running Shoes', 'Footwear', 1480, 650],
  ['Suede Loafers', 'Footwear', 1650, 720],
  ['Genuine Leather Belt', 'Accessories', 320, 120],
  ['Silk Scarf', 'Accessories', 420, 160],
  ['Aviator Sunglasses', 'Accessories', 690, 250],
  ['Canvas Tote Bag', 'Bags', 280, 95],
  ['Leather Crossbody Bag', 'Bags', 1150, 480],
  ['Linen Button-Up Shirt', 'Apparel', 890, 380],
  ['Relaxed Chino Trousers', 'Apparel', 750, 320],
  ['Ribbed Crewneck Tee', 'Apparel', 320, 140],
  ['Pleated Wide-Leg Pants', 'Apparel', 980, 420],
  ['Cashmere Blend Cardigan', 'Apparel', 1650, 720],
  ['Quilted Bomber Jacket', 'Outerwear', 1890, 820],
  ['Water-Resistant Raincoat', 'Outerwear', 1420, 610],
  ['Cropped Trench Coat', 'Outerwear', 2100, 920],
  ['Fleece Zip Hoodie', 'Outerwear', 680, 290],
  ['Chunky Chelsea Boots', 'Footwear', 1750, 760],
  ['Canvas Slip-On Shoes', 'Footwear', 540, 230],
  ['Leather Ankle Boots', 'Footwear', 1980, 860],
  ['Espadrille Flat Sandals', 'Footwear', 420, 180],
  ['Woven Straw Hat', 'Accessories', 280, 120],
  ['Gold-Tone Hoop Earrings', 'Accessories', 350, 150],
  ['Knit Beanie Cap', 'Accessories', 250, 105],
  ['Structured Leather Wallet', 'Accessories', 480, 205],
  ['Mini Quilted Shoulder Bag', 'Bags', 1250, 540],
  ['Nylon Weekender Duffel', 'Bags', 980, 420],
  ['Croc-Embossed Clutch', 'Bags', 720, 310],
  ['Floral Midi Wrap Dress', 'Dresses', 1100, 475],
  ['Satin Slip Evening Dress', 'Dresses', 1450, 630],
  ['Cotton Shirt Dress', 'Dresses', 850, 365],
  ['Seamless Yoga Leggings', 'Activewear', 560, 240],
  ['Moisture-Wick Tank Top', 'Activewear', 290, 125],
  ['Lightweight Training Shorts', 'Activewear', 380, 165],
];

const CUSTOMERS = [
  'Mariam Hassan',
  'Omar Khaled',
  'Youssef Ali',
  'Nour Adel',
  'Ahmed Samir',
  'Salma Fathy',
  'Khaled Mostafa',
  'Layla Ibrahim',
  'Karim Nabil',
  'Farida Tarek',
  'Mostafa Hany',
  'Habiba Sherif',
  'Ziad Ashraf',
  'Dina Magdy',
  'Amira Saeed',
  'Hassan Mahmoud',
  'Rana ElSayed',
  'Tamer Fouad',
  'Yasmin Gamal',
  'Sherine Mansour',
  'Bassem Lotfy',
  'Hana Refaat',
  'Mahmoud Sobhy',
  'Nadine Wahba',
  'Amr Hegazy',
  'Rania Soliman',
  'Hossam Farouk',
  'Menna Ashraf',
  'Wael Ramadan',
  'Sara Abdelrahman',
  'Tarek ElMasry',
  'Jana Kamel',
  'Ehab Nassar',
  'Malak Younis',
];

const SUPPLIERS = [
  {
    name: 'Nile Textile Trading',
    email: 'orders@niletextile-eg.com',
    phone: '+20225784410',
    address: '12 Talaat Harb St, Downtown, Cairo',
  },
  {
    name: 'Giza Fashion Supplies',
    email: 'sales@gizafashion.com',
    phone: '+20235821190',
    address: '45 Haram St, Giza',
  },
  {
    name: 'Alexandria Apparel Co.',
    email: 'info@alexapparel.com.eg',
    phone: '+2034872205',
    address: '88 Fouad St, Alexandria',
  },
  {
    name: 'Cairo Leather Works',
    email: 'wholesale@cairoleather.eg',
    phone: '+20223659088',
    address: '3 Ahmed Maher St, Sayeda Zeinab, Cairo',
  },
  {
    name: 'Delta Soft Goods',
    email: 'contact@deltasoftgoods.com',
    phone: '+20233376541',
    address: '21 Lebanon Sq, Mohandessin, Giza',
  },
  {
    name: 'Pharos Accessories',
    email: 'b2b@pharosacc.com',
    phone: '+2035827740',
    address: '15 Sultan Hussein St, Alexandria',
  },
  {
    name: 'Misr Knitwear Factory',
    email: 'export@misrknitwear.eg',
    phone: '+20226351122',
    address: 'Industrial Zone A5, 10th of Ramadan, Cairo',
  },
  {
    name: 'Sphinx Bags & Luggage',
    email: 'orders@sphinxbags.com',
    phone: '+20227483390',
    address: '67 Abbas El Akkad St, Nasr City, Cairo',
  },
];

const RETURN_REASONS = [
  'CHANGED_MIND',
  'SIZE_FIT_ISSUE',
  'DEFECTIVE',
  'WRONG_ITEM',
  'NOT_AS_DESCRIBED',
  'QUALITY_ISSUE',
];

function egyptPhone() {
  const prefix = pick(['10', '11', '12']);
  const rest = String(rand(1e8)).padStart(8, '0');
  return `+20${prefix}${rest}`;
}

async function listAll(path, label) {
  const items = [];
  let page = 1;
  while (true) {
    const res = unwrap(
      await api('GET', `${path}${path.includes('?') ? '&' : '?'}page=${page}&limit=100`),
      label,
    );
    const rows = Array.isArray(res) ? res : res?.data || [];
    items.push(...rows);
    const totalPages =
      res?.meta?.pagination?.totalPages ??
      (rows.length < 100 ? page : page + 1);
    // When unwrap returns bare array, meta is lost — stop on short page
    if (rows.length < 100) break;
    if (typeof totalPages === 'number' && page >= totalPages) break;
    page++;
    if (page > 50) break;
  }
  return items;
}

async function ensureCategories() {
  const existing = unwrap(
    await api('GET', '/v1/tenant/categories?page=1&limit=100'),
    'cats',
  );
  const list = Array.isArray(existing) ? existing : existing?.data || [];
  const byName = new Map(list.map((c) => [c.name, c.id]));
  const ids = {};
  for (const name of CATEGORIES) {
    if (byName.has(name)) {
      ids[name] = byName.get(name);
      continue;
    }
    const created = unwrap(
      await api('POST', '/v1/tenant/categories', { name }),
      `cat ${name}`,
    );
    ids[name] = created.id;
    console.log('  + category', name);
  }
  return ids;
}

async function ensureProducts(catIds) {
  // Build SKU map from product details (list may omit variants)
  const listed = unwrap(
    await api('GET', '/v1/tenant/products?page=1&limit=100'),
    'prods',
  );
  const list = Array.isArray(listed) ? listed : listed?.data || [];
  const bySku = new Map();
  for (const p of list) {
    const full = unwrap(
      await api('GET', `/v1/tenant/products/${p.id}`),
      `detail ${p.id}`,
    );
    for (const v of full.variants || []) {
      bySku.set(v.sku, {
        productId: full.id,
        variantId: v.id,
        name: full.name,
        sell: Number(v.baseSellingPrice || v.sellingPrice || 0),
        cost: Number(v.basePurchasePrice || v.purchasePrice || 0),
      });
    }
    await sleep(20);
  }

  const result = [];
  let i = 0;
  for (const [name, cat, sell, cost] of PRODUCTS) {
    i++;
    const sku = `${TAG}-${String(i).padStart(3, '0')}`;
    if (bySku.has(sku)) {
      const existing = bySku.get(sku);
      result.push({ ...existing, name, sell, cost, sku });
      continue;
    }
    const created = unwrap(
      await api('POST', '/v1/tenant/products', {
        name,
        categoryId: catIds[cat],
        status: 'active',
        inventoryTrackable: true,
        variants: [
          { sku, baseSellingPrice: sell, basePurchasePrice: cost },
        ],
      }),
      `product ${name}`,
    );
    const full = unwrap(
      await api('GET', `/v1/tenant/products/${created.id}`),
      'product detail',
    );
    const variantId = full.variants[0].id;
    result.push({ productId: created.id, variantId, name, sell, cost, sku });
    console.log('  + product', name, sku);
    await sleep(40);
  }
  return result;
}

async function stockVaried(products) {
  // Mix: healthy stock, medium, and a few low-stock for alerts
  const items = products.map((p, idx) => {
    let quantity = 80 + rand(120);
    if (idx % 9 === 0) quantity = 2 + rand(4); // low stock
    else if (idx % 5 === 0) quantity = 12 + rand(10); // medium-low
    return {
      variantId: p.variantId,
      quantity,
      reason: 'Bulk seed restock',
      unitCost: p.cost,
    };
  });
  const res = await api('POST', '/v1/tenant/inventory/adjust-quantity/bulk', {
    storeId: STORE_ID,
    items,
  });
  if (!res.ok) {
    throw new Error('stock failed ' + JSON.stringify(res.body).slice(0, 300));
  }
  const low = items.filter((i) => i.quantity <= 5).length;
  console.log(`  stocked ${items.length} variants (${low} low-stock)`);
}

async function ensureCustomers() {
  const listed = unwrap(
    await api('GET', '/v1/tenant/customers?page=1&limit=100'),
    'cust',
  );
  const list = Array.isArray(listed) ? listed : listed?.data || [];
  const byName = new Map(list.map((c) => [c.name, c.id]));
  const ids = [];
  for (const name of CUSTOMERS) {
    if (byName.has(name)) {
      ids.push(byName.get(name));
      continue;
    }
    const created = unwrap(
      await api('POST', '/v1/tenant/customers', {
        name,
        phone: egyptPhone(),
      }),
      `customer ${name}`,
    );
    ids.push(created.id);
    console.log('  + customer', name);
    await sleep(30);
  }
  return ids;
}

async function ensureSuppliers() {
  const listed = unwrap(
    await api('GET', '/v1/tenant/suppliers?page=1&limit=100'),
    'suppliers',
  );
  const list = Array.isArray(listed) ? listed : listed?.data || [];
  const byName = new Map(list.map((s) => [s.name, s]));
  const result = [];
  for (const s of SUPPLIERS) {
    if (byName.has(s.name)) {
      result.push(byName.get(s.name));
      continue;
    }
    const created = unwrap(
      await api('POST', '/v1/tenant/suppliers', {
        name: s.name,
        contactInfo: {
          email: s.email,
          phone: s.phone,
          address: s.address,
        },
      }),
      `supplier ${s.name}`,
    );
    result.push(created);
    console.log('  + supplier', s.name);
    await sleep(30);
  }
  // Include any pre-existing suppliers too
  for (const s of list) {
    if (!result.find((r) => r.id === s.id)) result.push(s);
  }
  return result;
}

function orderDateWithin(daysAgoMax) {
  const now = Date.now();
  const r = Math.pow(Math.random(), 1.5);
  const daysAgo = r * daysAgoMax;
  const d = new Date(now - daysAgo * 86400000);
  d.setHours(10 + rand(11), rand(60), rand(60), 0);
  return d.toISOString();
}

async function createOrders(products, customerIds, count, maxDays = 30) {
  const channelNames = Object.keys(CHANNELS);
  const fulfillments = [
    'IN_STORE',
    'IN_STORE',
    'IN_STORE',
    'IN_STORE',
    'PICKUP',
    'PICKUP',
  ];
  const payMethods = ['CASH', 'CASH', 'ONLINE', 'ONLINE', 'RECEIPT'];
  let ok = 0;
  let fail = 0;

  for (let n = 0; n < count; n++) {
    const itemCount = 1 + rand(3);
    const chosen = [];
    const used = new Set();
    for (let k = 0; k < itemCount; k++) {
      let p = pick(products);
      let guard = 0;
      while (used.has(p.variantId) && guard++ < 5) p = pick(products);
      used.add(p.variantId);
      chosen.push({
        variantId: p.variantId,
        quantity: 1 + rand(3),
        stockType: 'INVENTORY',
      });
    }

    const channelName = pick(channelNames);
    const fulfillmentMethod = pick(fulfillments);
    const orderDate = orderDateWithin(maxDays);
    const useCustomer = Math.random() < 0.85;
    const customerId = useCustomer ? pick(customerIds) : undefined;

    const base = {
      storeId: STORE_ID,
      orderDate,
      source: 'WEB',
      channelId: CHANNELS[channelName],
      fulfillmentMethod,
      items: chosen,
      ...(customerId
        ? { customerId }
        : { customerName: pick(CUSTOMERS), customerPhone: egyptPhone() }),
    };

    const prev = await api('POST', '/v1/tenant/orders/preview', base);
    if (!prev.ok) {
      fail++;
      if (fail <= 3) {
        console.log('  preview fail', JSON.stringify(prev.body).slice(0, 200));
      }
      continue;
    }
    const total = prev.body.data.totalAmount;
    const roll = Math.random();
    let payment = {};
    if (fulfillmentMethod === 'IN_STORE') {
      if (roll < 0.85) {
        payment = { paymentMethod: pick(payMethods), amountPaid: money(total) };
      } else {
        payment = {
          paymentMethod: pick(payMethods),
          amountPaid: money(total * 0.4),
        };
      }
    } else if (roll < 0.7) {
      payment = { paymentMethod: pick(payMethods), amountPaid: money(total) };
    } else if (roll < 0.85) {
      payment = {
        paymentMethod: pick(payMethods),
        amountPaid: money(total * 0.4),
      };
    }

    const res = await api('POST', '/v1/tenant/orders', { ...base, ...payment });
    if (res.ok) ok++;
    else {
      fail++;
      if (fail <= 5) {
        console.log(
          '  order fail',
          res.status,
          JSON.stringify(res.body).slice(0, 220),
        );
      }
    }
    if (n % 10 === 9) {
      console.log(`  orders ${ok} ok / ${fail} fail`);
      await sleep(60);
    }
  }
  console.log(`  DONE orders: ${ok} ok, ${fail} fail`);
}

async function createPurchaseOrders(products, suppliers, count = 12) {
  let ok = 0;
  let fail = 0;
  for (let i = 0; i < count; i++) {
    const supplier = pick(suppliers);
    const lineCount = 2 + rand(3);
    const used = new Set();
    const items = [];
    for (let k = 0; k < lineCount; k++) {
      let p = pick(products);
      let guard = 0;
      while (used.has(p.variantId) && guard++ < 5) p = pick(products);
      used.add(p.variantId);
      items.push({
        variantId: p.variantId,
        quantityOrdered: 10 + rand(40),
        unitCost: p.cost || 50,
      });
    }
    const status = i % 3 === 0 ? 'APPROVED' : 'DRAFT';
    const body = {
      status,
      storeId: STORE_ID,
      supplierId: supplier.id,
      expectedDate: new Date(Date.now() + (3 + i) * 86400000).toISOString(),
      taxAmount: money(40 + rand(80)),
      shippingAmount: money(20 + rand(60)),
      notes: `Bulk seed PO ${i + 1} — ${supplier.name}`,
      items,
    };
    const res = await api('POST', '/v1/tenant/purchase-orders', body);
    if (res.ok) {
      ok++;
      console.log(`  + PO ${status} via ${supplier.name}`);
    } else {
      fail++;
      if (fail <= 4) {
        console.log(
          '  PO fail',
          res.status,
          JSON.stringify(res.body).slice(0, 250),
        );
      }
    }
    await sleep(40);
  }
  console.log(`  DONE POs: ${ok} ok, ${fail} fail`);
}

async function createReturns(target = 10) {
  // Pull recent paid-ish orders with items
  const ordersRes = await api(
    'GET',
    '/v1/tenant/orders?page=1&limit=40&sortBy=orderDate&sortOrder=DESC',
  );
  if (!ordersRes.ok) {
    console.log('  returns skip — orders list failed', ordersRes.status);
    return;
  }
  const orders = ordersRes.body.data || [];
  let ok = 0;
  let fail = 0;

  for (const o of orders) {
    if (ok >= target) break;
    const detailRes = await api('GET', `/v1/tenant/orders/${o.id}`);
    if (!detailRes.ok) continue;
    const detail = detailRes.body.data;
    const items = (detail.items || []).filter((it) => Number(it.quantity) > 0);
    if (!items.length) continue;
    // Skip if already heavily returned
    if (detail.returnStatus && detail.returnStatus !== 'NONE') continue;

    const item = pick(items);
    const qty = 1;
    const body = {
      orderId: detail.id,
      returnReason: pick(RETURN_REASONS),
      notes: 'Bulk seed return for marketing screenshots',
      items: [
        {
          orderItemId: item.id,
          quantity: qty,
          shouldRestock: Math.random() < 0.7,
          ...(Math.random() < 0.3
            ? {
                shouldRestock: false,
                nonRestockReason: 'DAMAGED',
                conditionNotes: 'Cosmetic damage on receipt',
              }
            : {}),
        },
      ],
    };
    const res = await api('POST', '/v1/tenant/returns', body);
    if (res.ok) {
      ok++;
      console.log(`  + return on ${detail.orderNumber || detail.id}`);
    } else {
      fail++;
      if (fail <= 5) {
        console.log(
          '  return fail',
          res.status,
          JSON.stringify(res.body).slice(0, 220),
        );
      }
    }
    await sleep(50);
  }
  console.log(`  DONE returns: ${ok} ok, ${fail} fail`);
}

async function backfillCustomerStats() {
  const all = [];
  let page = 1;
  while (true) {
    const r = await api('GET', `/v1/tenant/orders?page=${page}&limit=100`);
    const items = r.body.data || [];
    all.push(...items);
    const tp = r.body.meta?.pagination?.totalPages || 1;
    if (page >= tp) break;
    page++;
  }
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
  const custRes = await api('GET', '/v1/tenant/customers?page=1&limit=100');
  const customers = custRes.body.data || [];
  let updated = 0;
  for (const c of customers) {
    const s = stats.get(c.id);
    if (!s) continue;
    const avg = s.visits ? money(s.spent / s.visits) : 0;
    const payload = {
      totalSpent: money(s.spent),
      totalVisits: s.visits,
      averageOrderValue: avg,
      lastVisitAt: new Date(s.last).toISOString(),
    };
    const r = await api('PATCH', `/v1/tenant/customers/${c.id}`, payload);
    if (r.ok) updated++;
  }
  console.log(`  updated stats for ${updated} customers`);
}

async function printTotals() {
  for (const [label, path] of [
    ['products', '/v1/tenant/products?page=1&limit=1'],
    ['customers', '/v1/tenant/customers?page=1&limit=1'],
    ['orders', '/v1/tenant/orders?page=1&limit=1'],
    ['purchase-orders', '/v1/tenant/purchase-orders?page=1&limit=1'],
    ['suppliers', '/v1/tenant/suppliers?page=1&limit=1'],
    ['returns', '/v1/tenant/returns?page=1&limit=1'],
  ]) {
    const r = await api('GET', path);
    const total = r.body?.meta?.pagination?.totalItems ?? '?';
    console.log(`  ${label}: ${total}`);
  }
}

async function main() {
  const mode = process.argv[2] || 'all';
  await login();
  console.log('logged in.\n');

  if (mode === 'orders') {
    const catIds = await ensureCategories();
    const products = await ensureProducts(catIds);
    const customerIds = await ensureCustomers();
    const count = Number(process.argv[3] || 80);
    const maxDays = Number(process.argv[4] || 30);
    console.log(`orders-only: creating ${count}...`);
    await createOrders(products, customerIds, count, maxDays);
    console.log('customer stats...');
    await backfillCustomerStats();
    console.log('\nTOTALS:');
    await printTotals();
    return;
  }

  console.log('1) categories...');
  const catIds = await ensureCategories();
  console.log('2) products...');
  const products = await ensureProducts(catIds);
  console.log(`   ready: ${products.length} products`);
  console.log('3) stock (varied)...');
  await stockVaried(products);
  console.log('4) customers...');
  const customerIds = await ensureCustomers();
  console.log(`   ready: ${customerIds.length} customers`);
  console.log('5) suppliers...');
  const suppliers = await ensureSuppliers();
  console.log(`   ready: ${suppliers.length} suppliers`);
  console.log('6) purchase orders...');
  await createPurchaseOrders(products, suppliers, 12);
  console.log('7) orders...');
  await createOrders(products, customerIds, Number(process.argv[3] || 90), 30);
  console.log('8) returns...');
  await createReturns(12);
  console.log('9) customer stats...');
  await backfillCustomerStats();
  console.log('\nTOTALS:');
  await printTotals();
  console.log('\nBULK SEED DONE');
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
