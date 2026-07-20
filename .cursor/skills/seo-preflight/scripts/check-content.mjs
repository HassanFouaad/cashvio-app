// Content preflight for the Cashvio marketing site.
// Checks: banned characters, en/ar key parity, JSON validity.
// Usage: node .cursor/skills/seo-preflight/scripts/check-content.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BANNED = /[\u2014\u2013\u2192]/; // em-dash, en-dash, arrow
const BANNED_G = /[\u2014\u2013\u2192]/g;
let failed = false;

function fail(msg) {
  failed = true;
  console.error(`FAIL  ${msg}`);
}

function ok(msg) {
  console.log(`OK    ${msg}`);
}

// ---------- 1. Messages: JSON validity + banned chars in values ----------
const messages = {};
for (const locale of ['en', 'ar']) {
  const file = `messages/${locale}.json`;
  try {
    messages[locale] = JSON.parse(readFileSync(file, 'utf8'));
    ok(`${file} is valid JSON`);
  } catch (e) {
    fail(`${file} is not valid JSON: ${e.message}`);
  }
}

function walkStrings(node, path, hits) {
  if (typeof node === 'string') {
    if (BANNED.test(node)) hits.push(`${path}: ${JSON.stringify(node)}`);
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => walkStrings(v, `${path}[${i}]`, hits));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) walkStrings(v, path ? `${path}.${k}` : k, hits);
  }
}

for (const locale of ['en', 'ar']) {
  if (!messages[locale]) continue;
  const hits = [];
  walkStrings(messages[locale], '', hits);
  if (hits.length) {
    fail(`messages/${locale}.json has ${hits.length} banned character value(s):`);
    hits.slice(0, 20).forEach((h) => console.error(`      ${h}`));
    if (hits.length > 20) console.error(`      ...and ${hits.length - 20} more`);
  } else {
    ok(`messages/${locale}.json has no banned characters`);
  }
}

// ---------- 2. en/ar key parity ----------
function keySet(node, prefix, out) {
  if (node && typeof node === 'object' && !Array.isArray(node)) {
    for (const [k, v] of Object.entries(node)) keySet(v, prefix ? `${prefix}.${k}` : k, out);
  } else {
    out.add(prefix);
  }
}

if (messages.en && messages.ar) {
  const enKeys = new Set();
  const arKeys = new Set();
  keySet(messages.en, '', enKeys);
  keySet(messages.ar, '', arKeys);
  const missingInAr = [...enKeys].filter((k) => !arKeys.has(k));
  const missingInEn = [...arKeys].filter((k) => !enKeys.has(k));
  if (missingInAr.length) {
    fail(`${missingInAr.length} key(s) exist in en.json but not ar.json:`);
    missingInAr.slice(0, 20).forEach((k) => console.error(`      ${k}`));
  }
  if (missingInEn.length) {
    fail(`${missingInEn.length} key(s) exist in ar.json but not en.json:`);
    missingInEn.slice(0, 20).forEach((k) => console.error(`      ${k}`));
  }
  if (!missingInAr.length && !missingInEn.length) ok('en/ar key sets match');
}

// ---------- 3. Docs MDX: banned chars ----------
function collectFiles(dir, filter) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...collectFiles(p, filter));
    else if (filter(entry)) out.push(p);
  }
  return out;
}

const mdxFiles = collectFiles('content/docs', (f) => f.endsWith('.mdx'));
let mdxBad = 0;
let fmBad = 0;
for (const f of mdxFiles) {
  const s = readFileSync(f, 'utf8');
  const n = (s.match(BANNED_G) || []).length;
  if (n) {
    mdxBad += 1;
    fail(`${f}: ${n} banned character(s)`);
  }

  // Frontmatter YAML safety: unquoted values containing ": " (or other YAML
  // specials) crash the fumadocs build. Colons are common after the dash
  // rewrites, so every such value must be quoted.
  const fm = s.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) {
    fmBad += 1;
    fail(`${f}: missing frontmatter block`);
    continue;
  }
  for (const line of fm[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (!kv || !kv[2]) continue;
    const v = kv[2];
    const isQuoted = /^".*"$/.test(v) || /^'.*'$/.test(v);
    if (!isQuoted && (/:\s/.test(v) || /:$/.test(v) || /^[[{#&*!|>%@`]/.test(v))) {
      fmBad += 1;
      fail(`${f}: unquoted YAML value needs quotes -> ${kv[1]}: ${v}`);
    }
  }
}
if (!mdxBad) ok(`${mdxFiles.length} docs MDX files have no banned characters`);
if (!fmBad) ok('all docs frontmatter is YAML-safe');

// ---------- 4. src: suspicious lines (informational; comments are fine) ----------
const srcFiles = collectFiles('src', (f) => /\.(ts|tsx)$/.test(f));
const suspicious = [];
for (const f of srcFiles) {
  const lines = readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (!BANNED.test(line)) return;
    const t = line.trim();
    const isComment =
      t.startsWith('//') || t.startsWith('*') || t.startsWith('/*') || t.startsWith('{/*');
    if (!isComment) suspicious.push(`${f}:${i + 1}: ${t.slice(0, 100)}`);
  });
}
if (suspicious.length) {
  console.log(`\nREVIEW  ${suspicious.length} non-comment line(s) in src/ contain banned characters.`);
  console.log('        Rendered strings must be fixed; CSS/comment edge cases may be fine:');
  suspicious.forEach((s) => console.log(`      ${s}`));
} else {
  ok('src/ has no banned characters outside comments');
}

console.log('');
if (failed) {
  console.error('RESULT: FAIL');
  process.exit(1);
}
console.log('RESULT: PASS');
