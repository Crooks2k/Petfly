# 🏗️ Arquitectura Limpia - Petfly

## 📋 Introducción

Este proyecto implementa **Clean Architecture** (Arquitectura Limpia)

## 🗂️ Estructura de Capas

```
petfly/src/app/features/flight-search/
├── core/                           # 🔵 DOMAIN LAYER (Lógica de Negocio)
│   ├── entities/                   # Modelos de dominio
│   ├── repositories/               # Contratos (interfaces abstractas)
│   ├── interactor/                 # Orquestadores de casos de uso
│   └── usecases/                   # Casos de uso
│
├── data/                           # 🟢 DATA LAYER (Implementaciones)
│   └── repositories/
│       ├── *-implementation.repository.ts       # ✅ REAL (API)
│       └── *-implementation.repository.fake.ts  # 🎭 FAKE (Mock)
│
└── presentation/                   # 🟡 PRESENTATION LAYER (UI)
    ├── pages/                      # Páginas
    ├── components/                 # Componentes
    └── flight-search.module.ts     # Módulo con providers
```

## 🔄 Flujo de Datos

```
┌─────────────────┐
│  Component (UI) │  Inyecta PetflyInteractor
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Interactor    │  Orquesta los casos de uso
│ (Orchestrator)  │  petflyInteractor.getCities(request)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Use Case     │  Ejecuta lógica de negocio
│(Business Logic) │  getCitiesUseCase.execute(request)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Repository    │  Interface abstracta (contrato)
│   (Contract)    │  abstract getCities(request): Observable<response>
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Implementation  │  Implementación concreta
│  (Real/Fake)    │  - Real: HTTP call a API
└─────────────────┘  - Fake: Mock data con delay
```

## 🎯 Casos de Uso Implementados

### 1. Get Cities
**Endpoint:** `GET /api/cities?query=string&limit=10`

**Request:**
```typescript
interface GetCitiesRequestEntity {
  query: string;   // Texto de búsqueda
  limit: number;   // Límite de resultados
}
```

**Response:**
```typescript
interface GetCitiesResponseEntity {
  cities: CityEntity[];
}

interface CityEntity {
  id: string;
  name: string;
  code: string;
  country: string;
  countryCode: string;
}
```

### 2. Get Currencies
**Endpoint:** `GET /api/currencies`

**Request:**
```typescript
interface GetCurrenciesRequestEntity {
  // Sin parámetros
}
```

**Response:**
```typescript
interface GetCurrenciesResponseEntity {
  currencies: CurrencyEntity[];
}

interface CurrencyEntity {
  id: string;
  code: string;
  name: string;
  symbol: string;
}
```

### 3. Get Breeds
**Endpoint:** `GET /api/breeds?petTypeId=7048`

**Request:**
```typescript
interface GetBreedsRequestEntity {
  petTypeId: string;  // ID del tipo de mascota
}
```

**Response:**
```typescript
interface GetBreedsResponseEntity {
  breeds: BreedEntity[];
}

interface BreedEntity {
  id: string;
  name: string;
  petTypeId: string;
  description?: string;
}
```

### 4. Search Flights
**Endpoint:** `POST /api/search`

**Request:**
```typescript
interface SearchFlightsRequestEntity {
  age: number;
  weight: number;
  breed: string;
  currency: string;
  petType: string;
  userIp: string | null;
  locale: string | null;
  tripClass: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  segments: Array<{
    origin: string;
    origin_country: string | null;
    destination: string;
    destination_country: string | null;
    date: string;
  }>;
}
```

**Response:**
```typescript
interface SearchFlightsResponseEntity {
  searchId: string;
  totalResults: number;
  flights: FlightEntity[];
}

interface FlightEntity {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  price: number;
  currency: string;
  availableSeats: number;
  segments: any[];
}
```

**Uso:**
```typescript
const formData = this.viewModel.getFormData();
const currency = this.currencyService.getCurrentCurrencyCode();
this.petflyInteractor.searchFlights(formData, currency)
  .subscribe(response => {
    console.log('Vuelos:', response.flights);
  });
```

## 🔧 Service Providers

### Real (service-provider.module.ts)
```typescript
@NgModule({
  providers: [
    {
      provide: PetflyRepository,
      useClass: PetflyImplementationRepository, // 🌐 Conecta a API real
    },
    { provide: 'API_URL', useValue: environment.API_SERVICES.API_URL },
  ],
  imports: [CommonModule, HttpClientModule],
})
export class ServiceProviderModule {}
```

### Fake (service-provider.module.fake.ts)
```typescript
@NgModule({
  providers: [
    {
      provide: PetflyRepository,
      useClass: PetflyImplementationRepositoryFake, // 🎭 Usa datos mock
    },
    { provide: 'API_URL', useValue: environment.API_SERVICES.API_URL },
  ],
  imports: [CommonModule, HttpClientModule],
})
export class ServiceProviderModule {}
```

## 🚀 Comandos de Ejecución

### Modo FAKE (datos mock)
```bash
npm run start:fake
```
✅ No requiere backend  
✅ Datos predefinidos  
✅ Simula latencia de red  
✅ Ideal para desarrollo frontend  

### Modo DEV (API real)
```bash
npm run start:dev
```
⚠️ Requiere backend corriendo  
⚠️ Conecta a endpoints reales  

## 🔀 Cambio entre Real y Fake

El cambio se realiza automáticamente mediante la configuración de Angular:

### angular.json
```json
{
  "configurations": {
    "fake": {
      "fileReplacements": [
        {
          "replace": "src/app/core/service-providers/service-provider.module.ts",
          "with": "src/app/core/service-providers/service-provider.module.fake.ts"
        }
      ]
    }
  }
}
```

Cuando ejecutas `npm run start:fake`, Angular reemplaza automáticamente el módulo de service providers, cambiando la implementación de REAL a FAKE.

## 🎓 Ventajas de esta Arquitectura

1. **Separación de responsabilidades**: Cada capa tiene una responsabilidad clara
2. **Testeable**: Fácil de hacer unit tests con mocks
3. **Mantenible**: Cambios en una capa no afectan a las demás
4. **Escalable**: Fácil agregar nuevos casos de uso
5. **Flexible**: Cambio rápido entre implementaciones (real/fake)
6. **Independiente del framework**: La lógica de negocio no depende de Angular
7. **Desarrollo paralelo**: Frontend puede trabajar con fake mientras backend desarrolla la API

## 📚 Conceptos Clave

### Inversión de Dependencias
- Las capas superiores dependen de abstracciones (interfaces)
- Las implementaciones concretas están en la capa de datos
- Fácil cambiar implementaciones sin afectar la lógica

### Inyección de Dependencias
- Angular inyecta la implementación correcta según el entorno
- Configurado en `service-provider.module.ts` (real) o `.fake.ts` (mock)
- Cambio automático mediante `angular.json` fileReplacements

### Casos de Uso
- Encapsulan la lógica de negocio
- Independientes del framework
- Fáciles de testear

### Interactores
- Orquestan los casos de uso
- Punto de entrada desde la presentación
- Inyectables en componentes
