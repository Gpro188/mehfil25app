@echo off
title Cleanup Mehfil Artsfest Leaderboard Application

echo ======================================================
echo    Cleanup Mehfil Artsfest Leaderboard Application
echo ======================================================
echo.
echo This script will remove unnecessary folders and files
echo to optimize the project structure.
echo.
echo Press any key to continue...
pause >nul

cls
echo ======================================================
echo    Cleaning up the Application
echo ======================================================
echo.

cd /d "c:\Users\SMIC_STUDIO\Desktop\MEHFIL 25 APP"

echo Removing simple-hosted-version folder...
rmdir /s /q "simple-hosted-version"
if %errorlevel% equ 0 (
    echo Successfully removed simple-hosted-version folder
) else (
    echo Failed to remove simple-hosted-version folder
)

echo.
echo Removing documentation files...
del "*.md" >nul 2>&1
if %errorlevel% equ 0 (
    echo Successfully removed documentation files
) else (
    echo No documentation files found or failed to remove
)

echo.
echo Removing unnecessary batch files...
del "build-app.bat" >nul 2>&1
del "build-app.ps1" >nul 2>&1
del "build-for-hosting.bat" >nul 2>&1
del "check-build.bat" >nul 2>&1
del "clear-data.bat" >nul 2>&1
del "deploy-to-netlify.ps1" >nul 2>&1
del "firebase-config-wizard.bat" >nul 2>&1
del "firebase-dev.bat" >nul 2>&1
del "host-online.bat" >nul 2>&1
del "run-app.bat" >nul 2>&1
del "run-tests.bat" >nul 2>&1
del "setup-firebase.bat" >nul 2>&1
del "show-html-structure.bat" >nul 2>&1
del "start-app.bat" >nul 2>&1
del "test-build.bat" >nul 2>&1
del "update-firebase-config.bat" >nul 2>&1
del "verify-build.bat" >nul 2>&1
del "verify-deployment.ps1" >nul 2>&1
del "web-host-wizard.bat" >nul 2>&1
echo Successfully removed unnecessary batch files

echo.
echo Keeping essential files:
echo - src/ (application source code)
echo - public/ (public assets)
echo - build/ (built application)
echo - node_modules/ (dependencies)
echo - package.json (project configuration)
echo - start.bat (main startup script)
echo - run-full-app.bat (full application runner)

echo.
echo Cleanup completed!
echo.
echo Press any key to exit...
pause >nul