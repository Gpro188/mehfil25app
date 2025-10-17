const { spawnSync } = require('child_process');
const path = require('path');

console.log('Starting build process...');

// Try to find react-scripts binary
const reactScriptsPath = path.join(__dirname, 'node_modules', '.bin', 'react-scripts');
const reactScriptsJsPath = path.join(__dirname, 'node_modules', 'react-scripts', 'bin', 'react-scripts.js');

console.log('Looking for react-scripts at:', reactScriptsJsPath);

// Use node to directly run the react-scripts.js file
const result = spawnSync('node', [reactScriptsJsPath, 'build'], {
  stdio: 'inherit',
  cwd: __dirname
});

if (result.error) {
  console.error('Failed to start build process:', result.error);
  process.exit(1);
}

if (result.status !== 0) {
  console.error('Build process exited with code:', result.status);
  process.exit(result.status);
}

console.log('Build completed successfully!');