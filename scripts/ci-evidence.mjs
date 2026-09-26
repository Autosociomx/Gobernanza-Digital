import { mkdirSync, writeFileSync } from 'node:fs';

const evidence = {
  schema: 'connectx.ci.evidence.v1',
  sha: process.env.GITHUB_SHA ?? 'local',
  runId: process.env.GITHUB_RUN_ID ?? null,
  runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
  repository: process.env.GITHUB_REPOSITORY ?? null,
  ref: process.env.GITHUB_REF ?? null,
  generatedAt: new Date().toISOString(),
  node: process.version,
};

mkdirSync('artifacts', { recursive: true });
writeFileSync('artifacts/ci-evidence.json', `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify(evidence, null, 2));
