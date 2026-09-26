const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function simulateDeleteDoc() {
    await sleep(20); // Simulate network/DB latency
}

async function runSequential() {
    const docs = Array.from({ length: 50 }, (_, i) => ({ id: `doc-${i}` }));
    const start = performance.now();
    for (const d of docs) {
        await simulateDeleteDoc();
    }
    const end = performance.now();
    return end - start;
}

async function runParallel() {
    const docs = Array.from({ length: 50 }, (_, i) => ({ id: `doc-${i}` }));
    const start = performance.now();
    await Promise.all(docs.map(() => simulateDeleteDoc()));
    const end = performance.now();
    return end - start;
}

async function main() {
    console.log("Running baseline benchmark...");
    const seqTime = await runSequential();
    console.log(`Sequential deletion time: ${seqTime.toFixed(2)} ms`);

    console.log("Running optimized benchmark...");
    const parTime = await runParallel();
    console.log(`Parallel deletion time: ${parTime.toFixed(2)} ms`);

    console.log(`Speedup: ${(seqTime / parTime).toFixed(2)}x`);
}

main();
