# 🐾 Petfly

Aplicación de gestión de vuelos para mascotas construida con Angular y Arquitectura Limpia.

## 🏗️ Arquitectura Limpia Implementada

Este proyecto implementa **Clean Architecture**

### 📚 Documentación

- **[RESUMEN.md](./docs/RESUMEN.md)** - 👈 **EMPIEZA AQUÍ** - Resumen de servicios implementados
- **[ARQUITECTURA-LIMPIA.md](./docs/ARQUITECTURA-LIMPIA.md)** - Documentación completa de la arquitectura
- **[EJEMPLO-IMPLEMENTACION.md](./docs/EJEMPLO-IMPLEMENTACION.md)** - Guía paso a paso para implementar servicios
- **[FLUJO-SEARCH-FLIGHTS.md](./docs/FLUJO-SEARCH-FLIGHTS.md)** - Flujo completo del servicio de búsqueda

### 🎯 Casos de Uso Implementados

1. **Get Cities** - Búsqueda de ciudades para vuelos
2. **Get Currencies** - Obtener monedas disponibles
3. **Get Breeds** - Obtener razas de mascotas por tipo
4. **Search Flights** - Búsqueda de vuelos con mascota

```typescript
// Ejemplo de uso en componente
constructor(
  private petflyInteractor: PetflyInteractor,
  private currencyService: CurrencyService
) {}

// Buscar ciudades
this.petflyInteractor.getCities({ query: 'Bogotá', limit: 10 })
  .subscribe(response => console.log(response.cities));

// Obtener monedas
this.petflyInteractor.getCurrencies({})
  .subscribe(response => console.log(response.currencies));

// Obtener razas
this.petflyInteractor.getBreeds({ petTypeId: '7048' })
  .subscribe(response => console.log(response.breeds));

// Buscar vuelos
const formData = this.viewModel.getFormData();
const currency = this.currencyService.getCurrentCurrencyCode();
this.petflyInteractor.searchFlights(formData, currency)
  .subscribe(response => console.log(response.flights));
```

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Desarrollo con datos FAKE (sin backend)
npm run start:fake

# Desarrollo con API REAL (requiere backend)
npm run start:dev
```

## 📁 Estructura de Capas

```
flight-search/
├── core/           # 🔵 DOMAIN (Lógica de negocio)
│   ├── entities/       # Modelos
│   ├── repositories/   # Contratos
│   ├── interactor/     # Orquestador
│   └── usecases/       # Casos de uso
│
├── data/           # 🟢 DATA (Implementaciones)
│   └── repositories/
│       ├── *.repository.ts       # REAL (API)
│       └── *.repository.fake.ts  # FAKE (Mock)
│
└── presentation/   # 🟡 UI (Componentes)
    ├── pages/
    └── components/
```

## 🔄 Flujo

```
Component → Interactor → Use Case → Repository → Implementation (Real/Fake)
```

## 🛠️ Tecnologías

- Angular 17
- TypeScript
- PrimeNG
- RxJS
- Jest

## 📝 Licencia

MIT