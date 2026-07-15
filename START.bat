@echo off
title EduMed Deontolog - Ishga tushirish
echo ======================================
echo   EduMed Deontolog platformasi
echo ======================================
echo.
echo [1/3] Backend server ishga tushmoqda (port 3000)...
start "EduMed Backend" cmd /k "cd /d %~dp0backend && node server.js"
timeout /t 3 /nobreak >nul
echo [2/3] Frontend ishga tushmoqda (Vite)...
start "EduMed Frontend" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 5 /nobreak >nul
echo [3/3] Brauzer ochilmoqda...
start http://localhost:5173
echo.
echo Tayyor! Ikkala oynani yopmang.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
pause
