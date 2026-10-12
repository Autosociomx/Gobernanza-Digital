#!/usr/bin/env node
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';

const target = 'firebase-applet-config.json';
const example = 'firebase-applet-config.example.json';
const secret = process.env.FIREBASE_APPLET_CONFIG;

if (secret) {
  let parsed;
  try { parsed = JSON.parse(secret); }
  catch { console.error('FIREBASE_APPLET_CONFIG no contiene JSON valido.'); process.exit(1); }
  writeFileSync(target, JSON.stringify(parsed, null, 2) + '\n', { mode: 0o600 });
  console.log('Firebase config generated from CI secret.');
} else {
  if (!existsSync(example)) {
    console.error(`Missing ${example}; cannot create a reproducible CI checkout.`);
    process.exit(1);
  }
  copyFileSync(example, target);
  console.log('No Firebase secret configured; using non-production placeholder config.');
}

if (!readFileSync(target, 'utf8').trim()) {
  console.error('Generated Firebase config is empty.');
  process.exit(1);
}
