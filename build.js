const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read contents of source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  // Copy each entry
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDir(srcPath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  const dirPath = path.dirname(filePath);
  ensureDir(dirPath);
  fs.writeFileSync(filePath, content);
}

console.log('Starting custom build process...');

try {
  // Remove existing build directory
  if (fs.existsSync('build')) {
    fs.rmSync('build', { recursive: true });
  }

  // Copy public directory to build
  console.log('Copying public directory to build...');
  copyDir('public', 'build');

  // Create a simple placeholder for the JavaScript bundle
  const buildJsDir = path.join('build', 'static', 'js');
  console.log('Creating JavaScript directory:', buildJsDir);
  ensureDir(buildJsDir);

  // Create a simple bundle file
  const bundleContent = `
// Mehfil Artsfest Leaderboard App Bundle
console.log('Mehfil Artsfest Leaderboard App Loaded');

// In a real build process, this would contain your bundled JavaScript
// For now, we're just creating a placeholder
`;

  const bundlePath = path.join(buildJsDir, 'main.bundle.js');
  console.log('Writing bundle file to:', bundlePath);
  writeFile(bundlePath, bundleContent);

  console.log('Custom build completed successfully!');
  console.log('Build output is in the "build" directory');

} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}