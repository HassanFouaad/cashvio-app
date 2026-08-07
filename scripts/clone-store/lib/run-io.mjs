import fs from 'node:fs';
import path from 'node:path';

import { resolveRunDir, RUNS_DIR } from './config.mjs';

export function createRunId(storeHint) {
  const slug = String(storeHint || 'store')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32) || 'store';
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${slug}-${stamp}`;
}

export function ensureRunDir(runId) {
  const dir = resolveRunDir(runId);
  fs.mkdirSync(path.join(dir, 'images'), { recursive: true });
  return dir;
}

export function runPath(runId, ...parts) {
  return path.join(resolveRunDir(runId), ...parts);
}

export function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export function parseArgs(argv = process.argv.slice(2)) {
  const flags = {};
  const positionals = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positionals.push(a);
    }
  }
  return { flags, positionals };
}

export function resolveRunId(flags) {
  return (
    flags.run ||
    process.env.CLONE_RUN_ID ||
    null
  );
}

/** List run folders newest-first */
export function listRuns() {
  if (!fs.existsSync(RUNS_DIR)) return [];
  return fs
    .readdirSync(RUNS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
    .reverse();
}
