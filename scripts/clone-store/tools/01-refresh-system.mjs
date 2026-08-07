/**
 * Exchange SYSTEM_REFRESH_TOKEN for a system-admin access session.
 *
 *   node --env-file=scripts/clone-store/.env.local \
 *     scripts/clone-store/tools/01-refresh-system.mjs --run <runId>
 */
import { refreshWithToken, exportSession } from '../lib/api.mjs';
import { requireEnv } from '../lib/config.mjs';
import {
  ensureRunDir,
  parseArgs,
  resolveRunId,
  writeJson,
  runPath,
} from '../lib/run-io.mjs';

async function main() {
  const { flags } = parseArgs();
  const runId = resolveRunId(flags);
  if (!runId) throw new Error('Pass --run <id>');
  ensureRunDir(runId);

  const refreshToken =
    flags['refresh-token'] ||
    process.env.CASHVIO_SYSTEM_REFRESH_TOKEN ||
    requireEnv('CASHVIO_SYSTEM_REFRESH_TOKEN');

  console.log(`[01] refreshing system session for run ${runId}`);
  await refreshWithToken(refreshToken);
  const session = exportSession();
  writeJson(runPath(runId, 'session.system.json'), {
    audience: 'SYSTEM',
    refreshedAt: new Date().toISOString(),
    ...session,
  });
  console.log('[01] system access token ready');
}

main().catch((err) => {
  console.error('[01] FAILED:', err.message || err);
  process.exit(1);
});
