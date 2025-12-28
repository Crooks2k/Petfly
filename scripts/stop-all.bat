@echo off
title Petfly - Detener Todo

echo ========================================
echo  PETFLY - Deteniendo Servicios
echo ========================================
echo.

echo [1/2] Cerrando Edge...
taskkill /F /IM msedge.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ Edge cerrado
) else (
    echo    - Edge no estaba corriendo
)

echo [2/2] Cerrando Node/Angular...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ Node/Angular cerrado
) else (
    echo    - Node/Angular no estaba corriendo
)

echo.
echo ========================================
echo  TODO DETENIDO
echo ========================================
echo.
timeout /t 3 /nobreak >nul
