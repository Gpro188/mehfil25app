@echo off
title Run Full Mehfil Artsfest Leaderboard Application

echo ======================================================
echo    Run Full Mehfil Artsfest Leaderboard Application
echo ======================================================
echo.
echo This script will start the full application with:
echo - Admin dashboard
echo - Team manager interface
echo - Public leaderboard
echo - Data management features
echo.
echo Would you like to clean up unnecessary files/folders first?
echo (This will remove documentation and unused scripts)
set /p cleanup=Enter 'y' to cleanup or press Enter to skip: 
if /i "%cleanup%"=="y" (
    echo Running cleanup script...
    powershell -ExecutionPolicy Bypass -File "cleanup-project.ps1"
    echo.
    echo Press any key to continue with application startup...
    pause >nul
    cls
)

cls
echo ======================================================
echo    Starting the Application
echo ======================================================
echo.
echo Make sure you're in the project directory...
echo.

cd /d "c:\Users\SMIC_STUDIO\Desktop\MEHFIL 25 APP"

REM Check if node is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Starting the development server...
echo.
echo The application will be available at http://localhost:3000
echo.
echo Login credentials:
echo Admin:     Username: admin     Password: admin123
echo Team Manager: Any username and password
echo.
echo Press Ctrl+C to stop the server
echo.

npm start