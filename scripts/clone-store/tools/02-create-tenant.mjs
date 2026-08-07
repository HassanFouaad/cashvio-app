/**
 * Create a Cashvio tenant + default store using system admin session.
 *
 * Reads store name from catalog.json (preferred) or --name / CLONE_STORE_NAME.
 * Writes tenant.json + credentials draft.
 *
 *   node --env-file=… tools/02-create-tenant.mjs --run <runId> [--name "Shop"]
 */
import { api, loadSession, login, unwrap, exportSession, listAll } from '../lib/api.mjs';
import { STOREFRONT_HOST, CONSOLE_URL, sleep } from '../lib/config.mjs';
import {
  emailFromStoreName,
  generateAdminPassword,
  usernameFromEmail,
} from '../lib/passwords.mjs';
import {
  ensureRunDir,
  parseArgs,
  readJson,
  resolveRunId,
  runPath,
  writeJson,
} from '../lib/run-io.mjs';

async function main() {
  const { flags } = parseArgs();
  const runId = resolveRunId(flags);
  if (!runId) throw new Error('Pass --run <id>');
  ensureRunDir(runId);

  const systemSession = readJson(runPath(runId, 'session.system.json'));
  if (!systemSession?.accessToken) {
    throw new Error('Missing session.system.json — run 01-refresh-system first');
  }
  loadSession(systemSession);

  const catalog = readJson(runPath(runId, 'catalog.json'), {});
  const storeName =
    flags.name ||
    process.env.CLONE_STORE_NAME ||
    catalog.storeName ||
    catalog.name;
  if (!storeName) {
    throw new Error(
      'Store name required (--name, CLONE_STORE_NAME, or catalog.json storeName)',
    );
  }

  const password =
    flags.password ||
    process.env.CLONE_ADMIN_PASSWORD ||
    generateAdminPassword(16);
  const email =
    flags.email ||
    process.env.CLONE_ADMIN_EMAIL ||
    emailFromStoreName(storeName);
  const username =
    flags.username || process.env.CLONE_ADMIN_USERNAME || usernameFromEmail(email);

  const planId = flags.plan || process.env.CLONE_PLAN_ID || undefined;
  const contactPhone =
    flags.phone || process.env.CLONE_CONTACT_PHONE || undefined;

  const payload = {
    name: storeName,
    hasCompletedFeatureSelection: true,
    adminUser: {
      email,
      password,
      firstName: storeName.slice(0, 80),
      lastName: 'Admin',
      username,
    },
  };
  if (planId) payload.planId = planId;
  if (contactPhone) payload.contactPhone = contactPhone;

  console.log(`[02] creating tenant "${storeName}" as ${email}`);
  const created = unwrap(
    await api('POST', '/v1/system/tenants', payload),
    'create tenant',
  );

  // Give onboarding queue a moment to attach plan features
  await sleep(Number(process.env.CLONE_ONBOARDING_WAIT_MS || 3000));

  // Switch to tenant session
  console.log('[02] logging in as tenant admin');
  await login({ username: email, password, audience: 'TENANT' });
  writeJson(runPath(runId, 'session.tenant.json'), {
    audience: 'TENANT',
    loggedInAt: new Date().toISOString(),
    ...exportSession(),
  });

  const stores = await listAll('/v1/tenant/stores', 'stores');
  const store = stores[0];
  if (!store?.id) {
    throw new Error('Tenant created but no store found via GET /v1/tenant/stores');
  }

  const subdomain = created.storeSubdomain || store.subdomain;
  const tenantRecord = {
    tenantId: created.id,
    tenantName: created.name || storeName,
    storeId: store.id,
    storeName: store.name || storeName,
    storeSubdomain: subdomain,
    adminEmail: email,
    adminUsername: created.adminUser?.username || username,
    planId: created.planId || planId || null,
    createdAt: new Date().toISOString(),
  };
  writeJson(runPath(runId, 'tenant.json'), tenantRecord);

  const credentials = {
    storeSubdomain: subdomain,
    storefrontUrl: `https://${subdomain}.${STOREFRONT_HOST}`,
    consoleUrl: CONSOLE_URL,
    admin: {
      email,
      username: tenantRecord.adminUsername,
      password,
    },
    tenantId: tenantRecord.tenantId,
    storeId: tenantRecord.storeId,
    runId,
  };
  writeJson(runPath(runId, 'credentials.json'), credentials);

  console.log('[02] tenant ready');
  console.log(`     subdomain : ${subdomain}`);
  console.log(`     storefront: ${credentials.storefrontUrl}`);
  console.log(`     admin     : ${email} / (see credentials.json)`);
}

main().catch((err) => {
  console.error('[02] FAILED:', err.message || err);
  process.exit(1);
});
