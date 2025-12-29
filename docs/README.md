# 📚 Documentación del Proyecto Petfly

Esta carpeta contiene la documentación técnica del proyecto. Los documentos están organizados por tema para facilitar su consulta.

## 📖 Índice de Documentación

### 🏗️ Arquitectura y Estructura

**[ARQUITECTURA-LIMPIA.md](./ARQUITECTURA-LIMPIA.md)**
- Explicación de Clean Architecture implementada
- Estructura de capas (Core, Data, Presentation)
- Flujo de datos entre capas
- Casos de uso implementados
- Service providers (Real vs Fake)

### 💻 Desarrollo

**[DESARROLLO-LOCAL.md](./DESARROLLO-LOCAL.md)**
- Comandos para ejecutar el proyecto
- Configuración de entorno local
- Scripts disponibles (dev, fake, prod)
- Uso de Edge sin CORS
- Solución de problemas comunes

**[EJEMPLO-IMPLEMENTACION.md](./EJEMPLO-IMPLEMENTACION.md)**
- Guía paso a paso para agregar nuevos servicios
- Ejemplos de implementación (Get Cities, Get Breeds, Search Flights)
- Uso de mappers para transformación de datos
- Implementación de filtros
- Transferencia de datos entre páginas (routing state)
- Checklist de implementación

### 🎨 Componentes

**[FLIGHT-CARD-COMPONENT.md](./FLIGHT-CARD-COMPONENT.md)**
- Componente de tarjeta de vuelo
- Estructura de datos (FlightTicketEntity)
- Métodos de formateo
- Diseño responsive (desktop/mobile)
- Textos i18n

### 🔧 Integraciones

**[WHATSAPP-INTEGRATION.md](./WHATSAPP-INTEGRATION.md)**
- Integración del botón de WhatsApp en header
- Configuración de número y mensajes
- Soporte multiidioma
- Mantenimiento y personalización

## 🎯 Guías Rápidas

### Para Empezar a Desarrollar
1. Lee [DESARROLLO-LOCAL.md](./DESARROLLO-LOCAL.md) para configurar tu entorno
2. Ejecuta `npm start` para iniciar el proyecto
3. Revisa [ARQUITECTURA-LIMPIA.md](./ARQUITECTURA-LIMPIA.md) para entender la estructura

### Para Agregar un Nuevo Servicio
1. Sigue la guía en [EJEMPLO-IMPLEMENTACION.md](./EJEMPLO-IMPLEMENTACION.md)
2. Usa el checklist al final del documento
3. Implementa tanto la versión REAL como FAKE

### Para Entender el Flujo de Datos
1. Lee la sección "Flujo de Datos" en [ARQUITECTURA-LIMPIA.md](./ARQUITECTURA-LIMPIA.md)
2. Revisa los ejemplos en [EJEMPLO-IMPLEMENTACION.md](./EJEMPLO-IMPLEMENTACION.md)
3. Consulta el flujo de búsqueda y filtros en [EJEMPLO-IMPLEMENTACION.md](./EJEMPLO-IMPLEMENTACION.md)

## 📝 Convenciones

### Estructura de Archivos
```
src/app/features/[feature]/
├── core/                    # Lógica de negocio
│   ├── entities/           # Modelos de dominio
│   ├── repositories/       # Contratos (interfaces)
│   ├── interactor/         # Orquestadores
│   └── usecases/          # Casos de uso
├── data/                   # Implementaciones
│   ├── repositories/      # Implementaciones REAL y FAKE
│   └── mappers/           # Transformadores de datos
└── presentation/          # UI
    ├── pages/            # Páginas
    └── components/       # Componentes
```

### Naming Conventions
- **Entities:** `[Name]Entity` (ej: `CityEntity`, `FlightTicketEntity`)
- **Requests:** `[Action][Entity]RequestEntity` (ej: `GetCitiesRequestEntity`)
- **Responses:** `[Action][Entity]ResponseEntity` (ej: `GetCitiesResponseEntity`)
- **Use Cases:** `[Action][Entity]UseCase` (ej: `GetCitiesUseCase`)
- **Repositories:** `[Feature]Repository` (ej: `PetflyRepository`)
- **Implementations:** `[Feature]ImplementationRepository[.fake]` (ej: `PetflyImplementationRepository`)

## 🔄 Modos de Ejecución

| Comando | Modo | Backend | Uso |
|---------|------|---------|-----|
| `npm start` | DEV | API Real | Desarrollo con backend |
| `npm run start:fake` | FAKE | Mock Data | Desarrollo sin backend |
| `npm run start:prod` | PROD | API Real | Producción |

## 🛠️ Herramientas

- **Angular 17:** Framework principal
- **PrimeNG:** Librería de componentes UI
- **RxJS:** Programación reactiva
- **TypeScript:** Lenguaje tipado
- **SCSS:** Estilos

## 📞 Soporte

Para preguntas o problemas:
1. Revisa la documentación relevante
2. Consulta la sección de "Solución de Problemas" en [DESARROLLO-LOCAL.md](./DESARROLLO-LOCAL.md)
3. Revisa los ejemplos en [EJEMPLO-IMPLEMENTACION.md](./EJEMPLO-IMPLEMENTACION.md)

## 🔄 Actualización de Documentación

Al agregar nuevas funcionalidades:
1. Actualiza el documento correspondiente
2. Agrega ejemplos de código si es necesario
3. Actualiza este README si agregas nuevos documentos
4. Mantén la consistencia con el formato existente
