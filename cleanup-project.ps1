Write-Host "======================================================"
Write-Host "   Cleanup Mehfil Artsfest Leaderboard Application"
Write-Host "======================================================"
Write-Host ""

Write-Host "This script will remove unnecessary folders and files to optimize the project structure."
Write-Host ""

Write-Host "Removing simple-hosted-version folder..."
if (Test-Path "simple-hosted-version") {
    Remove-Item -Path "simple-hosted-version" -Recurse -Force
    Write-Host "Successfully removed simple-hosted-version folder"
} else {
    Write-Host "simple-hosted-version folder not found"
}

Write-Host ""
Write-Host "Removing documentation files..."
Get-ChildItem -Path "*.md" | Remove-Item -Force -ErrorAction SilentlyContinue
Write-Host "Successfully removed documentation files"

Write-Host ""
Write-Host "Removing unnecessary batch files..."
$batchFilesToRemove = @(
    "build-app.bat",
    "build-app.ps1",
    "build-for-hosting.bat",
    "check-build.bat",
    "clear-data.bat",
    "deploy-to-netlify.ps1",
    "firebase-config-wizard.bat",
    "firebase-dev.bat",
    "host-online.bat",
    "run-app.bat",
    "run-tests.bat",
    "setup-firebase.bat",
    "show-html-structure.bat",
    "start-app.bat",
    "test-build.bat",
    "update-firebase-config.bat",
    "verify-build.bat",
    "verify-deployment.ps1",
    "web-host-wizard.bat"
)

foreach ($file in $batchFilesToRemove) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "Removed $file"
    }
}

Write-Host ""
Write-Host "Removing unnecessary JavaScript utility files..."
$jsFilesToRemove = @(
    "check-build.js",
    "serve-build.js",
    "test-firebase-config.js",
    "update-firebase-config.js",
    "verify-build.js"
)

foreach ($file in $jsFilesToRemove) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "Removed $file"
    }
}

Write-Host ""
Write-Host "Keeping essential files:"
Write-Host "- src/ (application source code)"
Write-Host "- public/ (public assets)"
Write-Host "- build/ (built application)"
Write-Host "- node_modules/ (dependencies)"
Write-Host "- package.json (project configuration)"
Write-Host "- package-lock.json (dependency lock file)"
Write-Host "- start.bat (main startup script)"
Write-Host "- run-full-app.bat (full application runner)"
Write-Host "- cleanup-project.ps1 (this cleanup script)"

Write-Host ""
Write-Host "Cleanup completed!"
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")