# Script to deploy the app to GitHub Pages

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Error "Git is not installed or not in PATH. Please install Git and try again."
    exit 1
}

# Check if we're in a Git repository
try {
    $gitStatus = git status
} catch {
    Write-Error "Not a Git repository. Please initialize Git repository first."
    exit 1
}

# Build the project
Write-Host "Building the project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed. Please check the errors above."
    exit 1
}

# Deploy to GitHub Pages
Write-Host "Deploying to GitHub Pages..." -ForegroundColor Yellow
npx gh-pages -d build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Deployment failed. Please check the errors above."
    exit 1
}

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "Your app should be available at: https://Gpro188.github.io/mehfil-artsfest-leaderboard" -ForegroundColor Cyan