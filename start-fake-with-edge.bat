@echo off
title Petfly - Fake Server + Edge (No CORS)

echo ========================================
echo  PETFLY - Desarrollo con Datos FAKE
echo ========================================
echo.
echo [1/3] Cerrando instancias de Edge...
taskkill /F /IM msedge.exe >nul 2>&1

echo [2/3] Iniciando servidor Angular (fake)...
echo.
start "Angular Fake Server" cmd /k "npm run start:fake"

echo [3/3] Esperando a que el servidor este listo...
echo.

:wait_loop
timeout /t 2 /nobreak >nul
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:4200' -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop; exit 0 } catch { exit 1 }" >nul 2>&1

if %errorlevel% neq 0 (
    echo    Esperando... ^(verificando http://localhost:4200^)
    goto wait_loop
)

echo    ✓ Servidor listo!
echo.
echo Abriendo Edge sin CORS en http://localhost:4200
timeout /t 1 /nobreak >nul

REM Intentar primero la ruta de 64 bits
if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --disable-web-security --disable-gpu --user-data-dir=%TEMP%\edge-cors-disabled --remote-debugging-port=9222 http://localhost:4200
) else (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --disable-web-security --disable-gpu --user-data-dir=%TEMP%\edge-cors-disabled --remote-debugging-port=9222 http://localhost:4200
)

echo.
echo ========================================
echo  LISTO!
echo ========================================
echo  - Angular corriendo en: http://localhost:4200
echo  - Edge abierto sin CORS
echo  - Modo: FAKE (Datos Mock)
echo ========================================
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
