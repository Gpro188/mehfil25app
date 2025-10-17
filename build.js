const { execSync } = require('child_process');

try {
  console.log('Starting build process...');
  execSync('npx react-scripts build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}