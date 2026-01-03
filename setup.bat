@echo off
echo ========================================
echo GlobeTrotter - Quick Start Script
echo ========================================
echo.

echo [1/4] Installing frontend dependencies...
cd frontend\frontend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Checking environment file...
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Please copy .env.example to .env and add your Supabase credentials
    echo.
    pause
)

echo.
echo [3/4] Building application...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [4/4] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Configure your .env file with Supabase credentials
echo 2. Run SQL scripts in Supabase (sql/01_phase1_schema.sql, etc.)
echo 3. Start the dev server: npm run dev
echo 4. Open http://localhost:5173
echo ========================================
echo.

pause
