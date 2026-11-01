#!/usr/bin/env node
/**
 * ==============================================================================
 * Set the Firebase `admin` custom claim for the portfolio owner (Admin SDK)
 * ==============================================================================
 *
 * This script is hard-pinned. It can ONLY:
 *   - operate on Firebase project  : galvanized-ripple-5b34d
 *   - grant the claim to UID        : 7QYYQnG7G1ZE24RzMkmuarEuU1H3
 *   - ...whose email must be        : ccakiincasan@gmail.com (and be verified)
 * Any other target is refused. It takes NO uid/email arguments.
 *
 * USAGE (nothing happens without --confirm):
 *   node scripts/set-admin-claim.mjs            -> prints the plan and exits
 *   node scripts/set-admin-claim.mjs --confirm  -> performs the change
 *
 * CREDENTIALS: Application Default Credentials (ADC) ONLY. No key file is read.
 *   Option A (local):  gcloud auth application-default login
 *                      (sign in as an owner/editor of the Firebase project)
 *   Option B (no local setup): open Google Cloud Shell for the project, clone
 *                      this repo, `npm i -D firebase-admin`, then run the script.
 *   Do NOT create or download a service-account JSON key for this.
 *
 * After the claim is set, sign out and sign back in on the site (or wait for the
 * token to refresh) so the new claim is present in your ID token.
 * ==============================================================================
 */

import { isAbsolute, relative, resolve } from 'node:path';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// ---- Pinned safety constants (do not parameterise) --------------------------
const EXPECTED_PROJECT_ID = 'galvanized-ripple-5b34d';
const EXPECTED_UID = '7QYYQnG7G1ZE24RzMkmuarEuU1H3';
const EXPECTED_EMAIL = 'ccakiincasan@gmail.com';
// -----------------------------------------------------------------------------

function fail(msg) {
  console.error(`\n[REFUSED] ${msg}\n`);
  process.exit(1);
}

// 1. Arguments: only `--confirm` is accepted; nothing else.
const args = process.argv.slice(2);
const unknownArgs = args.filter((a) => a !== '--confirm');
if (unknownArgs.length > 0) {
  fail(
    `Unexpected argument(s): ${unknownArgs.join(' ')}. ` +
      'This script takes no target arguments; the target is pinned in the source.'
  );
}
const confirmed = args.includes('--confirm');

console.log('\nPlanned action (nothing changes without --confirm):');
console.log(`  Project : ${EXPECTED_PROJECT_ID}`);
console.log(`  UID     : ${EXPECTED_UID}`);
console.log(`  Email   : ${EXPECTED_EMAIL}`);
console.log('  Change  : set custom claim admin=true (other claims preserved)');

if (!confirmed) {
  console.log('\nDry run only. Re-run with --confirm to apply.\n');
  process.exit(0);
}

// 2. Refuse to run if a credentials file path points inside this repository.
const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (credPath) {
  const rel = relative(process.cwd(), resolve(credPath));
  if (!rel.startsWith('..') && !isAbsolute(rel)) {
    fail(
      'GOOGLE_APPLICATION_CREDENTIALS points inside the project directory. ' +
        'Keys must never live in the repository. Use `gcloud auth application-default login` or Cloud Shell.'
    );
  }
}

// 3. ADC only, with the project pinned explicitly.
const app = initializeApp({
  credential: applicationDefault(),
  projectId: EXPECTED_PROJECT_ID,
});

if (app.options.projectId !== EXPECTED_PROJECT_ID) {
  fail(`Resolved project "${app.options.projectId}" does not match "${EXPECTED_PROJECT_ID}".`);
}

try {
  const auth = getAuth(app);

  // 4. Look up by the pinned UID and verify every identity attribute.
  const user = await auth.getUser(EXPECTED_UID);

  if (user.uid !== EXPECTED_UID) fail('UID mismatch.');
  if ((user.email || '').toLowerCase() !== EXPECTED_EMAIL) {
    fail(`UID ${EXPECTED_UID} has email "${user.email}", expected "${EXPECTED_EMAIL}". Nothing was changed.`);
  }
  if (user.emailVerified !== true) fail('The account email is not verified. Nothing was changed.');
  if (user.disabled) fail('The account is disabled. Nothing was changed.');

  console.log('\nIdentity verified (UID, email, emailVerified, enabled).');
  console.log(`  Existing claims: ${JSON.stringify(user.customClaims || {})}`);

  // 5. Apply, preserving any other claims.
  await auth.setCustomUserClaims(EXPECTED_UID, { ...(user.customClaims || {}), admin: true });

  // 6. Read back to verify.
  const after = await auth.getUser(EXPECTED_UID);
  if (after.customClaims?.admin !== true) fail('Read-back verification failed: admin claim not present.');

  console.log('\n[OK] admin=true is set and verified by read-back.');
  console.log('     Sign out and back in on the site to receive the new claim.\n');
} catch (err) {
  console.error('\n[ERROR]', err?.code || '', err?.message || err);
  console.error('If this is a credentials error, run: gcloud auth application-default login\n');
  process.exit(1);
}
