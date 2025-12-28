@echo off
echo Cerrando todas las instancias de Edge...
taskkill /F /IM msedge.exe >nul 2>&1

echo Esperando 2 segundos...
timeout /t 2 /nobreak >nul

echo Abriendo Edge sin CORS para pruebas en APIS...
start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --disable-web-security --disable-gpu --user-data-dir=%TEMP%\edge-cors-disabled --remote-debugging-port=9222 http://localhost:4200

echo.
echo ========================================
echo Edge abierto sin CORS para pruebas en APIS
echo URL: http://localhost:4200
echo ========================================
echo.
echo IMPORTANTE: No uses este navegador para navegar normalmente
echo Solo para desarrollo con APIs sin CORS y pruebas
echo ========================================
