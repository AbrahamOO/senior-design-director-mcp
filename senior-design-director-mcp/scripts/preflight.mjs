#!/usr/bin/env node
/**
 * Pre-publish version guard.
 * Blocks `npm publish` if the current version is already on the npm registry,
 * preventing the E403 "cannot publish over previously published versions" error.
 *
 * Run automatically via the `prepublishOnly` script in package.json.
 */

import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const pkgPath = resolve(dirname(fileURLToPath(import.meta.url)), '../package.json');
const { name, version } = createRequire(import.meta.url)(pkgPath);

// Compute the suggested next patch version from the published version
function nextPatch(v) {
  const parts = v.split('.').map(Number);
  parts[2] += 1;
  return parts.join('.');
}

let publishedVersion;
try {
  const raw = execSync(`npm view ${name} version --json 2>/dev/null`, { encoding: 'utf8' }).trim();
  publishedVersion = JSON.parse(raw);
} catch {
  // Package not yet published or registry unreachable — allow publish to proceed.
  console.log(`  Preflight: no published version found for ${name}. Proceeding.`);
  process.exit(0);
}

if (publishedVersion === version) {
  const suggested = nextPatch(publishedVersion);
  console.error(`
  Error: v${version} is already published on npm.

  Open this file and change the version:
    ${pkgPath}

    "version": "${version}"   <-- change this to "${suggested}"

  Then run npm publish again.
`);
  process.exit(1);
}

console.log(`  Preflight: v${version} not yet published (latest on npm is v${publishedVersion}). Good to go.`);
