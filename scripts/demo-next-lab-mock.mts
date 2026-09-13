import { runLabMockDemo } from '../next/runtime/lab-mock-demo';

const output = await runLabMockDemo();
const decisions = output.flow.map(({ decision }) => decision);
const route = output.flow.at(-1)?.data as { routeStatus?: string } | undefined;

if (output.executionMode !== 'LAB_MOCK' || decisions.some((decision) => decision !== 'ALLOW') || route?.routeStatus !== 'FOUND') {
  console.error(JSON.stringify(output, null, 2));
  throw new Error('La demo LAB_MOCK no alcanzó el resultado esperado.');
}

console.log(JSON.stringify(output, null, 2));
