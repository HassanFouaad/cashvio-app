import fs from 'node:fs';

const raw = fs.readFileSync('messages/en.json', 'utf8');
const data = JSON.parse(raw);
const bad = /[\u2013\u2014\u2192]/;
const found = [];

function walk(node, path) {
  if (typeof node === 'string') {
    if (bad.test(node)) found.push({ path, value: node });
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => walk(v, `${path}[${i}]`));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${k}` : k);
  }
}

walk(data, '');
console.log('TOTAL', found.length);
fs.writeFileSync(
  'scripts/dash-values.json',
  JSON.stringify(found, null, 2) + '\n',
  'utf8',
);
