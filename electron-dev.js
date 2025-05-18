/**
 * Development entry point for Electron
 * This script handles the development environment setup
 */
process.env.NODE_ENV = 'development';

const { spawn } = require('child_process');
const { join } = require('path');
const path = require('path');

// Pass proper environment variables for native modules
const electronProcess = spawn(process.execPath, [
  '-r', 'ts-node/register',
  join(__dirname, 'main/main.ts')
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    // This is important for native modules to work correctly with ts-node
    TS_NODE_IGNORE: 'false',
    // Make sure better-sqlite3 can be loaded
    TS_NODE_PROJECT: path.join(__dirname, 'tsconfig-electron.json'),
    // Needed for loading better-sqlite3 with Node.js
    // See: https://github.com/WiseLibs/better-sqlite3/issues/126
    ELECTRON_RUN_AS_NODE: '1'
  }
});

electronProcess.on('close', (code) => {
  console.log(`Electron process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  electronProcess.kill('SIGINT');
  process.exit(0);
}); 