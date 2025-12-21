# 🚀 Guía de Desarrollo Local - Petfly

Esta guía explica cómo ejecutar el proyecto localmente con Edge sin restricciones CORS.

---

## 📋 Comandos Disponibles

### ⚡ Inicio Rápido (Recomendado)

```bash
# Desarrollo con API REAL + Edge sin CORS (TODO EN UNO)
npm start

# O explícitamente:
npm run start:dev:edge
```

Este comando:
1. ✅ Cierra instancias previas de Edge
2. ✅ Inicia el servidor Angular en modo DEV
3. ✅ Espera 8 segundos a que Angular compile
4. ✅ Abre Edge automáticamente sin CORS en `http://localhost:4200`

---

### 🎭 Modo FAKE (Datos Mock)

```bash
# Desarrollo con DATOS FAKE + Edge sin CORS
npm run start:fake:edge
```

Ideal para:
- ✅ Desarrollo sin backend
- ✅ Testing de UI
- ✅ Demos y presentaciones

---

### 🛑 Detener Todo

```bash
# Cierra Edge y Node/Angular
npm run stop
```

---

## 🔧 Comandos Individuales

### Solo Servidor (sin abrir Edge)

```bash
# Servidor DEV (API real)
npm run start:dev

# Servidor FAKE (datos mock)
npm run start:fake

# Servidor PROD
npm run start:prod

# Servidor QA
npm run start:qa
```

### Solo Edge sin CORS

```bash
# Abrir Edge sin CORS (requiere servidor corriendo)
npm run edge:no-cors
```

---

## 📁 Archivos .bat Creados

El proyecto incluye scripts batch para Windows:

| Archivo | Descripción |
|---------|-------------|
| `start-dev-with-edge.bat` | Inicia servidor DEV + Edge sin CORS |
| `start-fake-with-edge.bat` | Inicia servidor FAKE + Edge sin CORS |
| `edge-no-cors.bat` | Solo abre Edge sin CORS |
| `stop-all.bat` | Detiene Edge y Node/Angular |

Puedes ejecutarlos con **doble clic** o desde npm.

---

## 🎯 Flujos de Trabajo

### Desarrollo con API Real

```bash
# Terminal única
npm start
```

Esto abre automáticamente:
- 🟢 Angular Dev Server en `http://localhost:4200`
- 🌐 Edge sin CORS apuntando a la app

### Desarrollo sin Backend (FAKE)

```bash
# Terminal única
npm run start:fake:edge
```

Usa datos mock con latencia simulada (600-2000ms).

### Desarrollo Manual (2 terminales)

**Terminal 1:**
```bash
npm run start:dev
```

**Terminal 2:**
```bash
npm run edge:no-cors
```

---

## ⚠️ Notas Importantes

### Banner de Advertencia en Edge

Verás un banner amarillo que dice:
```
"Estás usando un indicador de línea de comandos no compatible: --disable-web-security"
```

✅ **Esto es normal y esperado** - significa que CORS está deshabilitado correctamente.

### Perfil Temporal

Edge se abre con un perfil temporal en:
```
%TEMP%\edge-cors-disabled
```

Esto significa:
- ✅ No afecta tu perfil normal de Edge
- ✅ No guarda historial ni cookies
- ✅ Ideal para desarrollo

### Seguridad

⚠️ **NUNCA uses este Edge para navegar normalmente**
- Solo para desarrollo local
- CORS deshabilitado = menos seguro
- Usa tu Edge normal para navegación regular

---

## 🐛 Solución de Problemas

### Edge no se abre automáticamente

**Problema:** El script no encuentra Edge.

**Solución:** Edita los archivos `.bat` y cambia la ruta:

```batch
# Si Edge está en 64 bits:
"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

# Si Edge está en 32 bits:
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
```

### Angular no compila a tiempo

**Problema:** Edge se abre antes de que Angular termine de compilar.

**Solución:** Aumenta el timeout en los archivos `.bat`:

```batch
# Cambiar de 8 a 15 segundos
timeout /t 15 /nobreak
```

### Puerto 4200 ocupado

**Problema:** Otro proceso usa el puerto 4200.

**Solución:**
```bash
# Ver qué proceso usa el puerto
netstat -ano | findstr :4200

# Matar el proceso (reemplaza PID con el número que viste)
taskkill /F /PID <PID>

# O usa npm run stop
npm run stop
```

### Edge no cierra correctamente

**Problema:** Quedan procesos de Edge corriendo.

**Solución:**
```bash
# Forzar cierre de Edge
taskkill /F /IM msedge.exe

# O usa el script
npm run stop
```

---

## 🔄 Cambio entre Modos

### De FAKE a REAL

```bash
# Detener todo
npm run stop

# Iniciar en modo REAL
npm start
```

### De REAL a FAKE

```bash
# Detener todo
npm run stop

# Iniciar en modo FAKE
npm run start:fake:edge
```

---

## 📊 Comparación de Modos

| Característica | DEV (Real) | FAKE (Mock) |
|----------------|------------|-------------|
| Backend requerido | ✅ Sí | ❌ No |
| Datos reales | ✅ Sí | ❌ Mock |
| Latencia | Variable | Simulada (600-2000ms) |
| Ideal para | Integración | UI/Testing |
| Configuración | `start:dev` | `start:fake` |

---

## 🎓 Comandos Útiles Adicionales

```bash
# Build para producción
npm run build

# Tests con cobertura
npm run test

# Tests en modo watch
npm run test:watch

# Linting
npm run lint

# Formatear código
npm run format

# Type checking
npm run type-check
```

---

## 🌐 URLs Importantes

| Servicio | URL |
|----------|-----|
| Aplicación | http://localhost:4200 |
| Angular DevTools | chrome://inspect |
| Edge Remote Debugging | http://localhost:9222 |

---

## 💡 Tips

1. **Usa `npm start`** para desarrollo diario - es el más rápido
2. **Usa `npm run start:fake:edge`** cuando el backend no esté disponible
3. **Usa `npm run stop`** para limpiar todo antes de cerrar
4. **No cierres la terminal** donde corre Angular - déjala abierta
5. **Recarga con F5** en Edge si ves errores de compilación

---

## 📝 Resumen de Scripts

```json
{
  "start": "Inicia DEV + Edge sin CORS (TODO EN UNO)",
  "start:dev": "Solo servidor DEV",
  "start:fake": "Solo servidor FAKE",
  "start:dev:edge": "DEV + Edge sin CORS",
  "start:fake:edge": "FAKE + Edge sin CORS",
  "edge:no-cors": "Solo Edge sin CORS",
  "stop": "Detiene Edge y Angular"
}
```

---

## 🎯 Recomendación

Para desarrollo diario, usa:

```bash
npm start
```

Es simple, rápido y hace todo automáticamente. 🚀
