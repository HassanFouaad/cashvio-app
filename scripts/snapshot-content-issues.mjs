import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BANNED = /[\u2014\u2013\u2192]/g;

for (const f of ['messages/en.json', 'messages/ar.json']) {
  const s = readFileSync(f, 'utf8');
  console.log(f, 'banned:', (s.match(BANNED) || []).length);
}

const arF = [];
const enF = [];
const badFm = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) {
      walk(p);
      continue;
    }
    if (!entry.endsWith('.mdx')) continue;
    const s = readFileSync(p, 'utf8');
    const n = (s.match(BANNED) || []).length;
    if (entry.endsWith('.ar.mdx')) {
      if (n) arF.push(`${p}:${n}`);
    } else if (n) {
      enF.push(`${p}:${n}`);
    }
    const m = s.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!m) continue;
    for (const line of m[1].split(/\r?\n/)) {
      const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
      if (!kv || !kv[2]) continue;
      const v = kv[2];
      const quoted = /^".*"$/.test(v) || /^'.*'$/.test(v);
      if (!quoted && (/:\s/.test(v) || /:$/.test(v) || /^[[{#&*!|>%@`]/.test(v))) {
        badFm.push(`${p} -> ${kv[1]}: ${v}`);
      }
    }
  }
}

walk('content/docs');
console.log('EN docs banned files:', enF.length ? enF.join('\n') : 'NONE');
console.log('AR docs banned files:', arF.length ? arF.join('\n') : 'NONE');
console.log('Bad frontmatter:', badFm.length ? badFm.join('\n') : 'NONE');
