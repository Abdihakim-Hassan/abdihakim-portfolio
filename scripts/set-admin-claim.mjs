#!/usr/bin/env node
/**
 * ==============================================================================
 * Firebase Custom Claim Provisioning Script (Server-Side / Admin SDK)
 * ==============================================================================
 * 
 * This script securely sets the `{ admin: true }` Custom Claim on a designated
 * Firebase Authentication account.
 * 
 * SECURITY BEST PRACTICES:
 * - NEVER commit your serviceAccountKey.json file to GitHub or any public repo.
 * - This script runs locally in your terminal using the official Firebase Admin SDK.
 * - Custom Claims are signed by Google and validated cryptographically by both
 *   Firebase Authentication and Cloud Firestore Security Rules (`request.auth.token.admin == true`).
 * 
 * USAGE:
 * 1. Download your service account key from:
 *    Firebase Console -> Project Settings -> Service accounts -> "Generate new private key"
 * 2. Save the JSON file in the project root as `serviceAccountKey.json`
 *    (It is already added to .gitignore so it will never be committed).
 * 3. Run:
 *    node scripts/set-admin-claim.mjs <user-email-or-uid>
 * 
 * Example:
 *    node scripts/set-admin-claim.mjs eng.abdihakim.hassan@gmail.com
 * ==============================================================================
 */

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const targetIdentifier = process.argv[2];

if (!targetIdentifier) {
  console.error('\n❌ Error: Please provide an email address or Firebase UID.');
  console.log('Usage: node scripts/set-admin-claim.mjs <user-email-or-uid>\n');
  console.log('Example: node scripts/set-admin-claim.mjs eng.abdihakim.hassan@gmail.com\n');
  process.exit(1);
}

// Locate service account credentials
const keyCandidates = [
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  resolve(process.cwd(), 'serviceAccountKey.json'),
  resolve(process.cwd(), 'scripts', 'serviceAccountKey.json'),
].filter(Boolean);

let serviceAccountPath = null;
for (const candidate of keyCandidates) {
  if (existsSync(candidate)) {
    serviceAccountPath = candidate;
    break;
  }
}

if (!serviceAccountPath) {
  console.error('\n❌ Service Account Key Not Found!');
  console.error('Please download your Firebase Admin private key:');
  console.error('1. Go to Firebase Console -> Project Settings -> Service accounts');
  console.error('2. Click "Generate new private key"');
  console.error('3. Save the downloaded file as "serviceAccountKey.json" in this project directory.');
  console.error('   (Or set GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json)\n');
  process.exit(1);
}

try {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  const auth = getAuth();

  // Find user by email or UID
  let targetUser;
  if (targetIdentifier.includes('@')) {
    console.log(`\n🔍 Looking up user by email: ${targetIdentifier}...`);
    targetUser = await auth.getUserByEmail(targetIdentifier);
  } else {
    console.log(`\n🔍 Looking up user by UID: ${targetIdentifier}...`);
    targetUser = await auth.getUser(targetIdentifier);
  }

  console.log(`✅ User found:`);
  console.log(`   - UID:   ${targetUser.uid}`);
  console.log(`   - Email: ${targetUser.email}`);
  console.log(`   - Current claims: ${JSON.stringify(targetUser.customClaims || {})}`);

  // Assign the admin custom claim
  console.log(`\n⚙️  Setting admin claim { admin: true }...`);
  await auth.setCustomUserClaims(targetUser.uid, {
    ...(targetUser.customClaims || {}),
    admin: true,
  });

  // Verify the updated user record
  const verifiedUser = await auth.getUser(targetUser.uid);
  console.log(`\n🎉 SUCCESS! Custom Claims successfully set:`);
  console.log(`   - UID:          ${verifiedUser.uid}`);
  console.log(`   - Email:        ${verifiedUser.email}`);
  console.log(`   - CustomClaims: ${JSON.stringify(verifiedUser.customClaims)}`);
  console.log(`\nℹ️  Next Step:`);
  console.log(`   If the user is currently logged in, they must log out and log in again,`);
  console.log(`   or trigger a token refresh (user.getIdToken(true)) to receive the new claim.\n`);

} catch (err) {
  console.error('\n❌ Failed to set admin claim:', err.message || err);
  process.exit(1);
}
