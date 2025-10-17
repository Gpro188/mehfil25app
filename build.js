const fs = require('fs');
const path = require('path');

// Simple function to copy a directory recursively
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Starting build process...');

try {
  // Clean build directory
  if (fs.existsSync('build')) {
    fs.rmSync('build', { recursive: true });
  }
  
  // Create build directory
  fs.mkdirSync('build', { recursive: true });
  
  // Copy public directory contents
  if (fs.existsSync('public')) {
    console.log('Copying public directory...');
    copyRecursiveSync('public', 'build');
  }
  
  console.log('Build completed successfully!');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
