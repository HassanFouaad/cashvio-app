import { readFileSync } from 'fs';
import { join, relative } from 'path';
import { pathToFileURL } from 'url';

// Inline the same logic expectations without importing TS
const docsDir = join(process.cwd(), 'content', 'docs');
const rootMeta = JSON.parse(readFileSync(join(docsDir, 'meta.json'), 'utf-8'));

const sections = [];
let pendingTitle = null;
for (const entry of rootMeta.pages) {
  if (entry === 'index') {
    sections.push({ key: 'overview', title: 'Overview', pageSlugs: ['index'] });
    continue;
  }
  if (entry.startsWith('---') && entry.endsWith('---')) {
    pendingTitle = entry.slice(3, -3).trim();
    continue;
  }
  if (entry.startsWith('...')) {
    const folder = entry.slice(3);
    const sectionMeta = JSON.parse(readFileSync(join(docsDir, folder, 'meta.json'), 'utf-8'));
    sections.push({
      key: folder,
      title: pendingTitle || folder,
      pageSlugs: sectionMeta.pages.filter((slug) => !slug.startsWith('---')),
    });
    pendingTitle = null;
    continue;
  }
  sections.push({ key: entry, title: pendingTitle || entry, pageSlugs: [entry] });
  pendingTitle = null;
}

const totalSlugs = sections.reduce((n, s) => n + s.pageSlugs.length, 0);
console.log('sections', sections.length);
console.log(sections.map((s) => `${s.title}: ${s.pageSlugs.length}`).join('\n'));
console.log('total ordered pages', totalSlugs);

const expectedOrder = [
  'Overview',
  'Getting Started',
  'Store Management',
  'Product Catalogue',
  'Inventory',
  'Sales & Orders',
  'Customers',
  'Returns & Refunds',
  'Suppliers & Purchasing',
  'Online Store',
  'Marketing',
  'Sales Channels',
  'Team & Permissions',
  'Reports & Analytics',
  'Settings',
  'Integrations',
  'Calculations & Pricing',
  "What's New",
];
const titles = sections.map((s) => s.title);
if (JSON.stringify(titles) !== JSON.stringify(expectedOrder)) {
  console.error('ORDER MISMATCH');
  console.error('got', titles);
  process.exit(1);
}
console.log('ORDER OK');
