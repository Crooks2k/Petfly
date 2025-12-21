# Implementación del Servicio de Filtros

## Resumen

Se implementó un nuevo servicio de filtros que utiliza query params + body para filtrar resultados de vuelos basándose en una búsqueda previa identificada por `searchId`.

## Arquitectura

### 1. Entidades (Core Layer)

#### FilterFlightsRequestEntity
```typescript
{
  // Query params
  searchId: string;
  isDirect?: boolean | null;
  maxPrice?: number | null;
  minPrice?: number | null;
  airlineCode?: string | null;

  // Body (mismo formato que search)
  body: SearchFlightsRequestEntity;
}
```

#### FilterFlightsResponseEntity
- Mismo formato que `SearchFlightsResponseEntity`
- Incluye `flightTickets` y `filtersBoundary`

#### SearchFlightsResponseEntity (actualizado)
- Agregado campo opcional `searchId?: string`

#### FlightSearchFormEntity (actualizado)
- Agregados campos de filtro:
  - `precioMinimo?: number | null`
  - `precioMaximo?: number | null`
  - `aerolinea?: string | null`

### 2. Repositorio (Core Layer)

**PetflyRepository** - Agregado método abstracto:
```typescript
abstract filterFlights(
  formData: FlightSearchFormEntity,
  searchId: string,
  currency: string,
  locale: string,
  options?: { useDefaults?: boolean }
): Observable<FilterFlightsResponseEntity>;
```

### 3. Use Case (Core Layer)

**FilterFlightsUseCase** - Nuevo caso de uso:
```typescript
execute(params: FilterFlightsUseCaseParams): Observable<FilterFlightsResponseEntity>
```

### 4. Interactor (Core Layer)

**PetflyInteractor** - Agregado método:
```typescript
public filterFlights(
  formData: FlightSearchFormEntity,
  searchId: string,
  currency: string,
  locale: string,
  options?: { useDefaults?: boolean }
): Observable<FilterFlightsResponseEntity>
```

### 5. Mapper (Data Layer)

**FilterFlightsFormMapper** - Nuevo mapper:
- Reutiliza `FlightSearchFormMapper` para el body
- Extrae query params del formulario:
  - `isDirect` desde `permitirEscalas` (invertido)
  - `maxPrice` desde `precioMaximo`
  - `minPrice` desde `precioMinimo`
  - `airlineCode` desde `aerolinea`

### 6. Implementaciones (Data Layer)

#### PetflyImplementationRepository (REAL)
```typescript
filterFlights(...): Observable<FilterFlightsResponseEntity> {
  const filterRequest = FilterFlightsFormMapper.toApiRequest(...);
  
  // Construir query params
  let params = new HttpParams()
    .set('searchId', filterRequest.searchId)
    .set('isDirect', ...)
    .set('maxPrice', ...)
    .set('minPrice', ...)
    .set('airlineCode', ...);

  return this.http.post<FilterFlightsResponseEntity>(
    `${this.apiUrl}filter`,
    filterRequest.body,
    { params }
  );
}
```

#### PetflyImplementationRepositoryFake (FAKE)
- Genera respuesta mock con delay de 1.5s
- Simula filtrado de resultados
- Incluye logs detallados para debugging

### 7. ViewModel (Presentation Layer)

**FlightResultsViewModel** - Actualizaciones:
- Agregado campo privado `searchId: string | null`
- Método `setSearchId(searchId: string)` para establecer el ID
- Método `applyFiltersToSearch()` actualizado para usar `filterFlights` en lugar de `searchFlights`
- Validación de `searchId` antes de aplicar filtros

### 8. Page (Presentation Layer)

**FlightResultsPage** - Actualizaciones:
- Agregado campo `searchId: string | null`
- Interface `FlightResultsState` actualizada con `searchId: string`
- Método `loadSearchData()` extrae y pasa `searchId` al ViewModel
- Métodos `onFiltersApplied()` y `applyFilters()` validan `searchId` antes de filtrar

**FlightSearchPage** - Actualizaciones:
- Extrae `searchId` de la respuesta de búsqueda
- Usa fallback `'mock-search-id-123'` si no viene en la respuesta
- Envía `searchId` en el state al navegar a resultados

## Flujo de Datos

### 1. Búsqueda Inicial
```
FlightSearchPage
  → searchFlights()
  → Respuesta incluye searchId
  → Navega a FlightResultsPage con searchId en state
```

### 2. Aplicación de Filtros
```
FlightResultsPage (usuario hace clic en "Filtrar")
  → onFiltersApplied() / applyFilters()
  → FlightResultsViewModel.applyFiltersToSearch()
  → PetflyInteractor.filterFlights(formData, searchId, currency, locale)
  → FilterFlightsUseCase.execute()
  → PetflyRepository.filterFlights()
  → FilterFlightsFormMapper.toApiRequest()
  → HTTP POST /api/filter?searchId=xxx&isDirect=false&maxPrice=500000...
  → Body: { age, weight, breed, currency, locale, segments, ... }
  → Respuesta: FilterFlightsResponseEntity
```

## Endpoint del API

### URL
```
POST /api/filter
```

### Query Params
- `searchId` (required): ID de la búsqueda original
- `isDirect` (optional): Filtrar solo vuelos directos
- `maxPrice` (optional): Precio máximo
- `minPrice` (optional): Precio mínimo
- `airlineCode` (optional): Código IATA de aerolínea

### Body
Mismo formato que el servicio de búsqueda:
```json
{
  "age": 24,
  "weight": 5,
  "breed": "Mixed",
  "currency": "COP",
  "petType": "Dog",
  "locale": "es",
  "tripClass": "Economy",
  "passengers": {
    "adults": 1,
    "children": 0,
    "infants": 0
  },
  "segments": [
    {
      "origin": "BOG",
      "origin_country": "CO",
      "destination": "MDE",
      "destination_country": "CO",
      "date": "2025-01-15"
    }
  ]
}
```

### Response
Mismo formato que el servicio de búsqueda:
```json
{
  "flightTickets": [...],
  "filtersBoundary": {...}
}
```

## Características Implementadas

✅ Servicio de filtros con query params + body
✅ Reutilización del mapper de búsqueda para el body
✅ Extracción de query params desde el formulario
✅ Implementación REAL con HttpClient
✅ Implementación FAKE con mock data
✅ Integración con ViewModel y Page
✅ Validación de searchId antes de filtrar
✅ Logs detallados para debugging
✅ Uso de valores por defecto con `useDefaults: true`
✅ Manejo de errores
✅ Clean Architecture (Domain → Data → Presentation)

## Uso

### En el componente de filtros:
```typescript
// El usuario modifica filtros y hace clic en "Filtrar"
onFiltersApplied() {
  if (this.searchId) {
    this.viewModel.applyFiltersToSearch();
  }
}
```

### En el ViewModel:
```typescript
applyFiltersToSearch() {
  if (!this.searchId) return;
  
  const formData = this.getFormData();
  const currency = this.getCurrentCurrency();
  const locale = this.getCurrentLocale();
  
  this.petflyInteractor
    .filterFlights(formData, this.searchId, currency, locale, { useDefaults: true })
    .subscribe(response => {
      this.flightResults = response;
    });
}
```

## Notas Importantes

1. **searchId es requerido**: El servicio de filtros requiere el `searchId` de la búsqueda original
2. **Valores por defecto**: Se usa `useDefaults: true` para llenar campos null con valores por defecto
3. **Query params opcionales**: Solo se envían los query params que tienen valor
4. **Body completo**: El body siempre se envía completo, igual que en búsqueda
5. **Respuesta idéntica**: La respuesta tiene el mismo formato que la búsqueda
6. **Mock searchId**: Si el API no devuelve searchId, se usa un fallback para desarrollo

## Archivos Modificados/Creados

### Creados:
- `src/app/features/flight-search/core/entities/filter-flights-request.entity.ts`
- `src/app/features/flight-search/core/entities/filter-flights-response.entity.ts`
- `src/app/features/flight-search/core/usecases/filter-flights.usecase.ts`
- `src/app/features/flight-search/data/mappers/filter-flights-form.mapper.ts`
- `docs/FILTER-SERVICE-IMPLEMENTATION.md`

### Modificados:
- `src/app/features/flight-search/core/entities/index.ts`
- `src/app/features/flight-search/core/entities/flight-search-form.entity.ts`
- `src/app/features/flight-search/core/entities/search-flights-response.entity.ts`
- `src/app/features/flight-search/core/repositories/petfly.repository.ts`
- `src/app/features/flight-search/core/interactor/petfly.interactor.ts`
- `src/app/features/flight-search/data/repositories/petfly-implementation.repository.ts`
- `src/app/features/flight-search/data/repositories/petfly-implementation.repository.fake.ts`
- `src/app/features/flight-search/presentation/pages/flight-results/view-model/flight-results.view-model.ts`
- `src/app/features/flight-search/presentation/pages/flight-results/flight-results.page.ts`
- `src/app/features/flight-search/presentation/pages/flight-search/flight-search.page.ts`
