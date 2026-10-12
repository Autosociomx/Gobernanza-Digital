import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const configPath = 'firebase-applet-config.json';
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const allowedFirebaseKey = typeof config.apiKey === 'string' ? config.apiKey : null;
const assetRoot = 'dist/assets';
const keyPattern = /AIza[0-9A-Za-z_-]{20,}/g;
const forbiddenMarker = /GEMINI_API_KEY/;
const findings = [];

function visit(path) {
  for (const entry of readdirSync(path)) {
    const full = join(path, entry);
    if (statSync(full).isDirectory()) {
      visit(full);
      continue;
    }
    const content = readFileSync(full, 'utf8');
    if (forbiddenMarker.test(content)) {
      findings.push(`${full}: GEMINI_API_KEY marker`);
    }
    for (const match of content.matchAll(keyPattern)) {
      if (match[0] !== allowedFirebaseKey) {
        findings.push(`${full}: non-Firebase Google API key pattern`);
      }
    }
  }
}

visit(assetRoot);
if (findings.length) {
  console.error('Potential secret material found in browser bundle:');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log('Bundle check passed: configured Firebase client key is allowed; no Gemini key marker or other Google API key pattern found.');
