/**
 * End-to-end orchestrator for clone-store.
 *
 *   node --env-file=scripts/clone-store/.env.local \
 *     scripts/clone-store/tools/run.mjs \
 *     --url https://shop.example.com \
 *     --refresh-token <SYSTEM_REFRESH_TOKEN>
 *
 * Pipeline:
 *   scrape → refresh system → create tenant → cleanup sample catalog →
 *   download images → seed catalog → upload product images → apply theme →
 *   sync category + hero visuals → print credentials
 *
 * Flags:
 *   --url              Source shop URL (required for new runs)
 *   --run              Resume / reuse an existing run id
 *   --name             Override store / tenant name
 *   --industry         Override industry for theme + Unsplash picks
 *   --theme            Force theme key (EDITORIAL, FRESH, …)
 *   --refresh-token    System admin refresh token
 *   --skip-scrape      Use existing catalog.json
 *   --skip-images      Skip product download + upload
 *   --skip-visuals     Skip category images + hero banners
 *   --skip-cleanup     Keep onboarding sample products/categories
 *   --only             Comma list of step numbers to run (e.g. 5,6,7,8,9)
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import '../lib/load-env.mjs';
import {
  createRunId,
  ensureRunDir,
  parseArgs,
  readJson,
  resolveRunId,
  runPath,
} from '../lib/run-io.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PIPELINE = [
  { n: 3, file: '03-scrape-catalog.mjs', kind: 'scrape' },
  { n: 1, file: '01-refresh-system.mjs', kind: 'auth' },
  { n: 2, file: '02-create-tenant.mjs', kind: 'tenant' },
  { n: 9, file: '09-cleanup-samples.mjs', kind: 'cleanup' },
  { n: 4, file: '04-download-images.mjs', kind: 'images' },
  { n: 5, file: '05-seed-catalog.mjs', kind: 'seed' },
  { n: 6, file: '06-upload-images.mjs', kind: 'images' },
  { n: 7, file: '07-apply-theme.mjs', kind: 'theme' },
  { n: 8, file: '08-sync-visuals.mjs', kind: 'visuals' },
];

function runNode(scriptName, args) {
  return new Promise((resolve, reject) => {
    const script = path.join(__dirname, scriptName);
    const child = spawn(process.execPath, [script, ...args], {
      stdio: 'inherit',
      env: process.env,
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${scriptName} exited ${code}`));
    });
  });
}

async function main() {
  const { flags } = parseArgs();
  const url = flags.url || process.env.CLONE_SOURCE_URL;

  if (flags['refresh-token']) {
    process.env.CASHVIO_SYSTEM_REFRESH_TOKEN = String(flags['refresh-token']);
  }
  if (flags.name) process.env.CLONE_STORE_NAME = String(flags.name);
  if (flags.industry) process.env.CLONE_INDUSTRY = String(flags.industry);
  if (flags.theme) process.env.CLONE_THEME = String(flags.theme);

  const skipScrape = Boolean(flags['skip-scrape']);
  const skipImages = Boolean(flags['skip-images']);
  const skipVisuals = Boolean(flags['skip-visuals']);
  const skipCleanup = Boolean(flags['skip-cleanup']);
  const only = flags.only
    ? new Set(
        String(flags.only)
          .split(',')
          .map((s) => Number(s.trim()))
          .filter(Boolean),
      )
    : null;

  let runId = resolveRunId(flags);
  if (!runId) {
    if (!url && !skipScrape) {
      throw new Error('Pass --url <shop> (or --run <id> --skip-scrape)');
    }
    runId = createRunId(url ? new URL(url).hostname : 'store');
  }
  ensureRunDir(runId);
  console.log(`\n=== clone-store run: ${runId} ===\n`);

  const args = ['--run', runId];
  if (url) args.push('--url', String(url));
  if (flags.name) args.push('--name', String(flags.name));
  if (flags.industry) args.push('--industry', String(flags.industry));
  if (flags.theme) args.push('--theme', String(flags.theme));

  for (const step of PIPELINE) {
    if (only && !only.has(step.n)) {
      console.log(`-- skip ${step.file} (not in --only)`);
      continue;
    }
    if (step.kind === 'scrape' && skipScrape) {
      console.log(`-- skip ${step.file}`);
      continue;
    }
    if (step.kind === 'images' && skipImages) {
      console.log(`-- skip ${step.file}`);
      continue;
    }
    if (step.kind === 'visuals' && skipVisuals) {
      console.log(`-- skip ${step.file}`);
      continue;
    }
    if (step.kind === 'cleanup' && skipCleanup) {
      console.log(`-- skip ${step.file}`);
      continue;
    }
    await runNode(step.file, args);
  }

  const credentials = readJson(runPath(runId, 'credentials.json'));
  if (!credentials) {
    throw new Error('Run finished but credentials.json is missing');
  }

  console.log('\n========== CLONE COMPLETE ==========');
  console.log(JSON.stringify(credentials, null, 2));
  console.log('====================================\n');
  console.log(`Artifacts: scripts/clone-store/runs/${runId}/`);
}

main().catch((err) => {
  console.error('[run] FAILED:', err.message || err);
  process.exit(1);
});
