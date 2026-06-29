@echo off
cd /d "%~dp0"
echo ========================================
echo   Starting Vite Dev Server on port 5173
echo ========================================
echo.
echo Access at: http://localhost:5173
echo Network:   http://192.168.0.26:5173
echo.
echo Press Ctrl+C to stop
echo.
node node_modules\vite\bin\vite.js --port 5173 --host 0.0.0.0
pause
