# 🐾 Petfly

> Plataforma de búsqueda y gestión de vuelos para mascotas construida con Angular 17 y Clean Architecture

[![Angular](https://img.shields.io/badge/Angular-17.3-DD0031?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-17.18-007ACC)](https://primeng.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Demo](#-demo)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Uso](#-uso)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Arquitectura](#️-arquitectura)
- [Tecnologías](#-tecnologías)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Documentación](#-documentación)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

## 📖 Descripción

Petfly es una aplicación web moderna que permite a los usuarios buscar, comparar y gestionar vuelos para viajar con sus mascotas. La plataforma integra información de múltiples aerolíneas, políticas de transporte de mascotas, y certificados necesarios para facilitar el proceso de viaje.

### Funcionalidades Principales

- 🔍 **Búsqueda Avanzada**: Busca vuelos considerando el tipo, peso y raza de tu mascota
- 🎫 **Certificados**: Gestión de certificados de apoyo emocional y perros de servicio
- 💰 **Comparación de Precios**: Visualiza precios diferenciados por tipo de certificado
- 🌍 **Multiidioma**: Soporte completo para español e inglés
- 📱 **Responsive**: Diseño adaptado para desktop, tablet y móvil
- ⚡ **Alto Rendimiento**: Optimizado con OnPush change detection y paginación
- 🎨 **UI Moderna**: Interfaz intuitiva con PrimeNG y diseño personalizado

## ✨ Características

### Búsqueda de Vuelos
- Búsqueda por origen, destino y fechas
- Filtros por tipo de mascota (perro/gato), peso y raza
- Selección de clase de cabina y número de pasajeros
- Validación de edad de mascota (máximo 24 semanas)

### Filtros Avanzados
- Filtro por rango de precios
- Filtro por aerolínea
- Vuelos directos o con escalas
- Selección de certificados (AE, PS, MR)
- Aside colapsable para maximizar espacio

### Resultados
- Paginación inteligente (50 resultados iniciales, carga de 25 más)
- Ordenamiento por precio o duración
- Cards diferenciadas para mobile y desktop
- Información detallada de vuelos y escalas
- Indicadores de certificados aceptados/rechazados

### Notificaciones
- Toast notifications para feedback inmediato
- Mensajes de éxito, advertencia y error
- Posicionamiento configurable

## 🎬 Demo

[Agregar capturas de pantalla o GIFs aquí]

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: >= 18.x
- **npm**: >= 9.x
- **Angular CLI**: 17.3.x (se instala con las dependencias)
- **Git**: Para clonar el repositorio

### Verificar Instalación

```bash
node --version  # v18.x o superior
npm --version   # 9.x o superior
```

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/your-username/petfly.git
cd petfly
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Verificar Instalación

```bash
npm run type-check
```

## ⚙️ Configuración

### Variables de Entorno

El proyecto utiliza diferentes configuraciones según el entorno:

```
src/environments/
├── environment.ts          # Desarrollo (por defecto)
├── environment.dev.ts      # Desarrollo con API real
├── environment.qa.ts       # QA/Staging
├── environment.pdn.ts      # Producción
```

### Configuración de API

Edita `src/environments/environment.dev.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://apiflight.petfly.io/api',
  useFakeData: false,
};
```

### Configuración de Mocks

Para desarrollo sin backend, usa `environment.ts` con `useFakeData: true`.

## 🎯 Uso

### Desarrollo con API Real

```bash
# Inicia servidor + abre Edge sin CORS
npm start

# Solo servidor (sin abrir navegador)
npm run start:dev
```

La aplicación estará disponible en `http://localhost:4200`

### Desarrollo con Datos Mock

```bash
# Con Edge sin CORS
npm run start:fake:edge

# Solo servidor
npm run start:fake
```

### Producción

```bash
# Build de producción
npm run build

# Build de QA
npm run build:qa
```

Los archivos compilados estarán en `dist/`

## 📜 Scripts Disponibles

### Desarrollo

| Script | Descripción |
|--------|-------------|
| `npm start` | Desarrollo con API real + Edge sin CORS |
| `npm run start:dev` | Solo servidor con API real |
| `npm run start:fake` | Servidor con datos mock |
| `npm run start:fake:edge` | Datos mock + Edge sin CORS |
| `npm run start:qa` | Servidor con configuración QA |

### Build

| Script | Descripción |
|--------|-------------|
| `npm run build` | Build de producción |
| `npm run build:dev` | Build de desarrollo |
| `npm run build:qa` | Build de QA |
| `npm run watch` | Build en modo watch |

### Testing

| Script | Descripción |
|--------|-------------|
| `npm test` | Ejecutar tests con cobertura |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:ci` | Tests para CI/CD |

### Calidad de Código

| Script | Descripción |
|--------|-------------|
| `npm run lint` | Ejecutar linter |
| `npm run lint:fix` | Fix automático de lint |
| `npm run format` | Formatear código con Prettier |
| `npm run format:check` | Verificar formato |
| `npm run type-check` | Verificar tipos TypeScript |
| `npm run pre-commit` | Ejecutar todas las verificaciones |

### Utilidades

| Script | Descripción |
|--------|-------------|
| `npm run edge:no-cors` | Abrir Edge sin CORS |
| `npm run stop` | Detener Edge y Angular |

## 📁 Estructura del Proyecto

```
petfly/
├── docs/                           # Documentación técnica
│   ├── README.md                   # Índice de documentación
│   ├── ARQUITECTURA-LIMPIA.md      # Guía de arquitectura
│   ├── DESARROLLO-LOCAL.md         # Setup local
│   ├── EJEMPLO-IMPLEMENTACION.md   # Ejemplos de código
│   ├── FLIGHT-CARD-COMPONENT.md    # Componente de cards
│   └── WHATSAPP-INTEGRATION.md     # Integración WhatsApp
│
├── scripts/                        # Scripts de utilidad
│   ├── edge-no-cors.bat           # Abrir Edge sin CORS
│   ├── start-dev-with-edge.bat    # Iniciar dev + Edge
│   ├── start-fake-with-edge.bat   # Iniciar fake + Edge
│   └── stop-all.bat               # Detener procesos
│
├── src/
│   ├── app/
│   │   ├── core/                  # Servicios core y configuración
│   │   │   ├── i18n/             # Internacionalización
│   │   │   └── service-providers/ # Providers de servicios
│   │   │
│   │   ├── features/              # Módulos de funcionalidades
│   │   │   └── flight-search/
│   │   │       ├── core/         # 🔵 DOMAIN (Lógica de negocio)
│   │   │       │   ├── entities/     # Modelos de dominio
│   │   │       │   ├── repositories/ # Contratos (interfaces)
│   │   │       │   ├── interactor/   # Orquestador
│   │   │       │   ├── usecases/     # Casos de uso
│   │   │       │   ├── types/        # Tipos TypeScript
│   │   │       │   └── constants/    # Constantes
│   │   │       │
│   │   │       ├── data/         # 🟢 DATA (Implementaciones)
│   │   │       │   ├── repositories/
│   │   │       │   │   ├── *.repository.ts      # API real
│   │   │       │   │   └── *.repository.fake.ts # Mocks
│   │   │       │   └── mappers/      # Transformadores
│   │   │       │
│   │   │       └── presentation/ # 🟡 UI (Componentes)
│   │   │           ├── pages/        # Páginas
│   │   │           ├── components/   # Componentes
│   │   │           └── flight-search.module.ts
│   │   │
│   │   ├── layout/                # Layout principal
│   │   └── shared/                # Código compartido
│   │       ├── components/        # Componentes reutilizables
│   │       ├── services/          # Servicios compartidos
│   │       ├── view-models/       # ViewModels base
│   │       ├── mocks/             # Datos mock
│   │       └── core/              # Entidades y tipos compartidos
│   │
│   ├── assets/                    # Recursos estáticos
│   │   ├── i18n/                 # Archivos de traducción
│   │   │   ├── es.json
│   │   │   └── en.json
│   │   └── images/               # Imágenes
│   │
│   ├── environments/              # Configuraciones de entorno
│   ├── styles.scss               # Estilos globales
│   └── main.ts                   # Punto de entrada
│
├── angular.json                   # Configuración Angular
├── package.json                   # Dependencias y scripts
├── tsconfig.json                  # Configuración TypeScript
├── jest.config.ts                 # Configuración Jest
├── .eslintrc.json                # Configuración ESLint
├── .prettierrc                   # Configuración Prettier
└── README.md                      # Este archivo
```

## 🏗️ Arquitectura

### Clean Architecture

Este proyecto implementa **Clean Architecture** con separación clara en 3 capas:

#### 🔵 CORE (Domain Layer)
**Responsabilidad**: Lógica de negocio pura, independiente de frameworks

- **Entities**: Modelos de dominio (interfaces TypeScript)
- **Repositories**: Contratos (interfaces) que definen operaciones
- **Use Cases**: Casos de uso específicos del negocio
- **Interactor**: Orquestador que coordina los casos de uso
- **Types & Constants**: Tipos y constantes del dominio

```typescript
// Ejemplo: Use Case
export class SearchFlightsUseCase implements UseCase<SearchFlightsRequestEntity, SearchFlightsResponseEntity> {
  constructor(private repository: PetflyRepository) {}
  
  execute(request: SearchFlightsRequestEntity): Observable<SearchFlightsResponseEntity> {
    return this.repository.searchFlights(request);
  }
}
```

#### 🟢 DATA (Data Layer)
**Responsabilidad**: Implementaciones concretas de repositorios

- **Repositories**: Implementaciones reales (API) y fake (mocks)
- **Mappers**: Transforman datos entre capas (DTO ↔ Entity)

```typescript
// Implementación Real
export class PetflyImplementationRepository implements PetflyRepository {
  searchFlights(request: SearchFlightsRequestEntity): Observable<SearchFlightsResponseEntity> {
    return this.http.post<SearchFlightsResponseEntity>('/search', request);
  }
}

// Implementación Fake
export class PetflyImplementationRepositoryFake implements PetflyRepository {
  searchFlights(request: SearchFlightsRequestEntity): Observable<SearchFlightsResponseEntity> {
    return of(MOCK_FLIGHT_TICKETS);
  }
}
```

#### 🟡 PRESENTATION (UI Layer)
**Responsabilidad**: Interfaz de usuario y lógica de presentación

- **Pages**: Páginas/vistas principales
- **Components**: Componentes reutilizables
- **ViewModels**: Lógica de presentación y gestión de formularios

### Flujo de Datos

```
┌─────────────┐
│  Component  │ ← Usuario interactúa
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  ViewModel  │ ← Gestiona estado y formularios
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Interactor  │ ← Orquesta casos de uso
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Use Case   │ ← Lógica de negocio
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Repository  │ ← Contrato (interface)
└──────┬──────┘
       │
       ├─────────────┐
       ↓             ↓
┌──────────┐  ┌──────────┐
│   Real   │  │   Fake   │ ← Implementaciones
│   (API)  │  │  (Mock)  │
└──────────┘  └──────────┘
```

### Casos de Uso Implementados

1. **GetCitiesUseCase**: Búsqueda de ciudades para vuelos
2. **GetCurrenciesUseCase**: Obtener monedas disponibles
3. **GetBreedsUseCase**: Obtener razas de mascotas por tipo
4. **SearchFlightsUseCase**: Búsqueda de vuelos con mascota
5. **FilterFlightsUseCase**: Filtrar resultados de búsqueda

### Ejemplo de Implementación

```typescript
// 1. Inyectar el interactor en el componente
constructor(private petflyInteractor: PetflyInteractor) {}

// 2. Usar el caso de uso
this.petflyInteractor.searchFlights(formData, 'COP', 'es')
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (response) => {
      console.log('Vuelos encontrados:', response.flightTickets);
    },
    error: (error) => {
      console.error('Error:', error);
    }
  });
```

## 🛠️ Tecnologías

### Core
- **[Angular 17.3](https://angular.io/)** - Framework principal
- **[TypeScript 5.4](https://www.typescriptlang.org/)** - Lenguaje tipado
- **[RxJS 7.8](https://rxjs.dev/)** - Programación reactiva

### UI/UX
- **[PrimeNG 17.18](https://primeng.org/)** - Librería de componentes UI
- **[PrimeFlex 3.3](https://primeflex.org/)** - Utilidades CSS
- **[PrimeIcons 6.0](https://primeng.org/icons)** - Iconos
- **[SCSS](https://sass-lang.com/)** - Preprocesador CSS

### Internacionalización
- **[@ngx-translate/core 15.0](https://github.com/ngx-translate/core)** - i18n
- **[@ngx-translate/http-loader 8.0](https://github.com/ngx-translate/http-loader)** - Carga de traducciones

### Testing
- **[Jest 29.7](https://jestjs.io/)** - Framework de testing
- **[jest-preset-angular 14.4](https://github.com/thymikee/jest-preset-angular)** - Preset para Angular

### Calidad de Código
- **[ESLint 8.57](https://eslint.org/)** - Linter
- **[@angular-eslint 17.5](https://github.com/angular-eslint/angular-eslint)** - Reglas Angular
- **[Prettier 3.4](https://prettier.io/)** - Formateador de código

### Herramientas de Desarrollo
- **[Angular CLI 17.3](https://cli.angular.io/)** - CLI de Angular
- **[TypeScript Compiler](https://www.typescriptlang.org/)** - Compilador TS

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests con cobertura
npm test

# Tests en modo watch
npm run test:watch

# Tests para CI/CD
npm run test:ci
```

### Estructura de Tests

```
src/
└── app/
    └── features/
        └── flight-search/
            ├── core/
            │   └── usecases/
            │       └── search-flights.usecase.spec.ts
            ├── data/
            │   └── mappers/
            │       └── flight-search-form.mapper.spec.ts
            └── presentation/
                └── components/
                    └── flight-card/
                        └── flight-card.component.spec.ts
```

### Cobertura de Código

Los reportes de cobertura se generan en `coverage/`

```bash
# Ver reporte en navegador
open coverage/lcov-report/index.html
```

## 🚀 Deployment

### Build de Producción

```bash
npm run build
```

Los archivos optimizados se generan en `dist/petfly/browser/`

### Configuración de Servidor

#### Nginx

```nginx
server {
    listen 80;
    server_name petfly.io;
    root /var/www/petfly/dist/petfly/browser;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Caché para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Apache

```apache
<VirtualHost *:80>
    ServerName petfly.io
    DocumentRoot /var/www/petfly/dist/petfly/browser

    <Directory /var/www/petfly/dist/petfly/browser>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Rewrite para SPA
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

### Variables de Entorno en Producción

Asegúrate de configurar correctamente `src/environments/environment.pdn.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://apiflight.petfly.io/api',
  useFakeData: false,
};
```

## 🐛 Troubleshooting

### Problemas Comunes

#### Error: "Cannot find module"

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### Error de CORS en desarrollo

```bash
# Usar Edge sin CORS
npm run edge:no-cors

# O iniciar con el script que incluye Edge
npm start
```

#### Error de compilación TypeScript

```bash
# Verificar tipos
npm run type-check

# Limpiar caché de Angular
rm -rf .angular
```

#### Tests fallan

```bash
# Limpiar caché de Jest
npm test -- --clearCache

# Ejecutar tests en modo verbose
npm test -- --verbose
```

#### Problemas de formato

```bash
# Formatear todo el código
npm run format

# Verificar y corregir lint
npm run lint:fix
```

### Logs y Debugging

#### Habilitar logs detallados

En `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  useFakeData: false,
  enableDebugLogs: true, // Agregar esta línea
};
```

#### Ver logs de red

Abre las DevTools del navegador:
- Chrome/Edge: F12 → Network tab
- Firefox: F12 → Network tab

### Soporte Adicional

Para más información, consulta:
- [Documentación completa](./docs/README.md)
- [Guía de desarrollo local](./docs/DESARROLLO-LOCAL.md)
- [Solución de problemas detallada](./docs/DESARROLLO-LOCAL.md#solución-de-problemas)

## 📚 Documentación

Toda la documentación técnica está disponible en la carpeta [`docs/`](./docs/):

| Documento | Descripción |
|-----------|-------------|
| [README.md](./docs/README.md) | Índice completo de documentación |
| [ARQUITECTURA-LIMPIA.md](./docs/ARQUITECTURA-LIMPIA.md) | Guía detallada de Clean Architecture |
| [DESARROLLO-LOCAL.md](./docs/DESARROLLO-LOCAL.md) | Setup y desarrollo local |
| [EJEMPLO-IMPLEMENTACION.md](./docs/EJEMPLO-IMPLEMENTACION.md) | Ejemplos de implementación |
| [FLIGHT-CARD-COMPONENT.md](./docs/FLIGHT-CARD-COMPONENT.md) | Documentación de componentes |
| [WHATSAPP-INTEGRATION.md](./docs/WHATSAPP-INTEGRATION.md) | Integración con WhatsApp |

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📧 Contacto

Para consultas sobre el proyecto:

- **Email**: [your.email@example.com](mailto:your.email@example.com)
- **Website**: [https://petfly.io](https://petfly.io)
- **Issues**: [GitHub Issues](https://github.com/your-username/petfly/issues)

---

Desarrollado con ❤️ para facilitar los viajes con mascotas
