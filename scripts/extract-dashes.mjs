// Extract all string values containing banned chars, as "path\tvalue" lines.
import { readFileSync, writeFileSync } from 'node:fs';

const locale = process.argv[2] || 'en';
const data = JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8'));
const BANNED = /[\u2014\u2013\u2192]/;
const out = [];

function walk(node, path) {
  if (typeof node === 'string') {
    if (BANNED.test(node)) out.push(`${path}\t${node.replace(/\n/g, '\\n')}`);
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => walk(v, `${path}[${i}]`));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${k}` : k);
  }
}

walk(data, '');
writeFileSync(`scripts/dashes-${locale}.tsv`, out.join('\n') + '\n', 'utf8');
console.log(`${out.length} strings written to scripts/dashes-${locale}.tsv`);
