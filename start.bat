@echo off
title Mehfil Artsfest Leaderboard

echo ================================
echo Mehfil Artsfest Leaderboard
echo ================================
echo.
echo Installing dependencies...
echo.

npm install

if %errorlevel% neq 0 (
    echo.
    echo Error: Failed to install dependencies
    echo Please make sure Node.js is installed
    echo.
    pause
    exit /b
)

echo.
echo Starting the application...
echo.
echo The application will be available at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm start