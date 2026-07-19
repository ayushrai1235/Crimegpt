/**
 * CrimeGPT Backend Launcher
 * -------------------------
 * Starts all backend microservices as standalone Express servers.
 * This bypasses the Zoho Catalyst CLI (which has compatibility issues
 * with Windows + Node v24) and runs the functions directly.
 *
 * Port mapping (matches frontend hardcoded URLs):
 *   - crimegpt-chat-service      → 3001
 *   - crimegpt-graph-service     → 3002
 *   - crimegpt-insights-service  → 3003
 */

import { fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const services = [
    { name: 'crimegpt-chat-service',     port: 3001 },
    { name: 'crimegpt-graph-service',    port: 3002 },
    { name: 'crimegpt-insights-service', port: 3003 },
];

const processes = [];

services.forEach(({ name, port }) => {
    const scriptPath = path.join(__dirname, 'functions', name, 'index.js');
    const child = fork(scriptPath, [], {
        env: { ...process.env, PORT: String(port), CHAT_PORT: String(port), GRAPH_PORT: String(port) },
        stdio: 'inherit',
    });

    child.on('error', (err) => {
        console.error(`[${name}] Failed to start: ${err.message}`);
    });

    child.on('exit', (code) => {
        if (code !== null && code !== 0) {
            console.error(`[${name}] Exited with code ${code}`);
        }
    });

    processes.push({ name, child });
    console.log(`[launcher] Starting ${name} on port ${port}...`);
});

process.on('SIGINT', () => {
    console.log('\n[launcher] Shutting down all services...');
    processes.forEach(({ name, child }) => {
        child.kill('SIGINT');
        console.log(`[launcher] Stopped ${name}`);
    });
    process.exit(0);
});

console.log(`\n[launcher] All ${services.length} backend services starting. Press Ctrl+C to stop.\n`);
