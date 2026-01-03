@echo off
title GlobeTrotter Travel App - Demo Launcher
color 0A

echo ====================================
echo   GLOBETROTTER TRAVEL APP
echo   Demo Launcher
echo ====================================
echo.

REM Check if we're in the correct directory
if not exist "frontend\frontend\package.json" (
    echo ERROR: Please run this script from the project root directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js: OK
echo.

echo [2/3] Checking dependencies...
if not exist "frontend\frontend\node_modules" (
    echo Dependencies not found. Installing...
    cd frontend\frontend
    call npm install --legacy-peer-deps
    cd ..\..
) else (
    echo Dependencies: OK
)
echo.

echo [3/3] Starting development server...
echo.
echo ====================================
echo   APPLICATION STARTING
echo ====================================
echo.
echo DEMO MODE ENABLED - No login required!
echo.
echo Demo User: Keerthivasan
echo Location: Chennai, India
echo Phone: 9488627508
echo.
echo The app will open at: http://localhost:5173
echo You'll be automatically logged in!
echo.
echo Press Ctrl+C to stop the server
echo ====================================
echo.

cd frontend\frontend
npm run dev

pause
