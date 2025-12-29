@echo off
title Petfly - Dev Server + Edge (No CORS)

echo ========================================
echo  PETFLY - Desarrollo Local
echo ========================================
echo.
echo [1/3] Cerrando instancias de Edge...
taskkill /F /IM msedge.exe >nul 2>&1

echo [2/3] Iniciando servidor Angular (dev)...
echo.
start "Angular Dev Server" cmd /k "npm run start:dev"

echo [3/3] Esperando a que el servidor este listo...
echo.

:wait_loop
ping 127.0.0.1 -n 3 >nul
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:4200' -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop; exit 0 } catch { exit 1 }" >nul 2>&1

if %errorlevel% neq 0 (
    echo    Esperando... ^(verificando http://localhost:4200^)
    goto wait_loop
)

echo    ✓ Servidor listo!
echo.
echo Abriendo Edge sin CORS en http://localhost:4200
ping 127.0.0.1 -n 2 >nul

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
echo  - Modo: DEVELOPMENT (API Real)
echo ========================================
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
