import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const run = (cmd, args = []) => execFileSync(cmd, args, { encoding: 'utf8' }).trim();
const sha = process.env.GITHUB_SHA || run('git', ['rev-parse', 'HEAD']);
const trackedFiles = run('git', ['ls-files']).split('\n').filter(Boolean);
const testFiles = trackedFiles.filter((p) => /(?:__tests__|\.test\.|\.spec\.)/.test(p));
const sourceFiles = trackedFiles.filter((p) => /\.(?:ts|tsx|mts|mjs)$/.test(p));

const evidence = {
  schema: 'connectx.ci.metrics.v1',
  sha,
  generatedAt: new Date().toISOString(),
  node: process.version,
  trackedFiles: trackedFiles.length,
  sourceFiles: sourceFiles.length,
  testFiles: testFiles.length,
  testToSourceRatio: sourceFiles.length ? Number((testFiles.length / sourceFiles.length).toFixed(4)) : 0,
};

mkdirSync('artifacts', { recursive: true });
writeFileSync('artifacts/ci-metrics.json', `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify(evidence, null, 2));
