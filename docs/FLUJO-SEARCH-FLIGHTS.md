# 🔄 Flujo Completo: Search Flights

Este documento explica el flujo completo desde que el usuario hace clic en "Buscar" hasta que se obtienen los resultados.

---

## 📊 Diagrama de Flujo

```
Usuario hace clic en "Buscar"
         ↓
    HTML Form (ngSubmit)
         ↓
    flight-search.page.ts → onSearch()
         ↓
    viewModel.getFormData() → Obtiene FlightSearchFormEntity
         ↓
    petflyInteractor.searchFlights(formData, currency)
         ↓
    PetflyInteractor → searchFlightsUseCase.execute({ formData, currency })
         ↓
    SearchFlightsUseCase → repository.searchFlights(formData, currency)
         ↓
    PetflyImplementationRepository
         ↓
    FlightSearchFormMapper.toApiRequest(formData, currency)
         ↓
    Transforma FlightSearchFormEntity → SearchFlightsRequestEntity
         ↓
    http.post('/api/search', request)
         ↓
    Backend procesa y retorna SearchFlightsResponseEntity
         ↓
    Observable<SearchFlightsResponseEntity>
         ↓
    Component recibe response.flights
         ↓
    Navega a página de resultados
```

---

## 🔍 Paso a Paso Detallado

### 1. Usuario Hace Clic en "Buscar"

**HTML:**
```html
<form [formGroup]="searchForm" (ngSubmit)="onSearch()">
  <!-- ... campos del formulario ... -->
  
  <button type="submit" [disabled]="searchForm.invalid || isSearching">
    {{ isSearching ? texts.searchingFlights : texts.searchButton }}
  </button>
</form>
```

---

### 2. Método onSearch() en el Component

**flight-search.page.ts:**
```typescript
public onSearch(): void {
  if (this.viewModel.isFormValid()) {
    this.isSearching = true;

    // Obtener los datos del formulario
    const formData = this.viewModel.getFormData();
    const currency = 'COP';

    // Llamar al interactor
    this.petflyInteractor
      .searchFlights(formData, currency)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          console.log('✅ Vuelos encontrados:', response);
          this.isSearching = false;
          this.router.navigate(['/results'], {
            state: { flights: response.flights }
          });
        },
        error: error => {
          console.error('❌ Error:', error);
          this.isSearching = false;
        }
      });
  } else {
    this.viewModel.markAllAsTouched();
  }
}
```

**Datos del formulario (FlightSearchFormEntity):**
```typescript
{
  tipoViaje: "roundtrip",
  origen: "BOG",
  destino: "MDE",
  fechaSalida: Date(2024-12-15),
  fechaRegreso: Date(2024-12-20),
  pasajeros: {
    adults: 1,
    children: 0,
    travelClass: "economy"
  },
  conMascota: true,
  tipoMascota: "dog",
  edadMascota: 24,
  pesoMascota: 5.5,
  razaMascota: "Labrador"
}
```

---

### 3. Interactor Ejecuta el Use Case

**petfly.interactor.ts:**
```typescript
public searchFlights(
  formData: FlightSearchFormEntity,
  currency: string
): Observable<SearchFlightsResponseEntity> {
  return this.searchFlightsUseCase.execute({ formData, currency });
}
```

---

### 4. Use Case Llama al Repository

**search-flights.usecase.ts:**
```typescript
public execute(params: SearchFlightsUseCaseParams): Observable<SearchFlightsResponseEntity> {
  return this.petflyRepository.searchFlights(params.formData, params.currency);
}
```

---

### 5. Repository Usa el Mapper y Hace la Llamada HTTP

**petfly-implementation.repository.ts:**
```typescript
searchFlights(
  formData: FlightSearchFormEntity,
  currency: string
): Observable<SearchFlightsResponseEntity> {
  // 🔄 Mapear el formulario al request del API
  const request = FlightSearchFormMapper.toApiRequest(formData, currency);
  
  // 🌐 Hacer la llamada HTTP POST
  return this.http.post<SearchFlightsResponseEntity>(`${this.apiUrl}search`, request);
}
```

---

### 6. Mapper Transforma los Datos

**flight-search-form.mapper.ts:**
```typescript
static toApiRequest(
  formData: FlightSearchFormEntity,
  currency: string
): SearchFlightsRequestEntity {
  return {
    age: formData.edadMascota || 0,
    weight: formData.pesoMascota || 0,
    breed: formData.razaMascota || '',
    currency: currency,
    petType: formData.tipoMascota === 'dog' ? 'Dog' : 'Cat',
    userIp: null,
    locale: null,
    tripClass: formData.pasajeros.travelClass === 'economy' ? 'Y' : 'C',
    passengers: {
      adults: formData.pasajeros.adults,
      children: formData.pasajeros.children,
      infants: 0
    },
    segments: [
      {
        origin: formData.origen,
        origin_country: null,
        destination: formData.destino,
        destination_country: null,
        date: "2024-12-15"
      },
      {
        origin: formData.destino,
        origin_country: null,
        destination: formData.origen,
        destination_country: null,
        date: "2024-12-20"
      }
    ]
  };
}
```

**Request enviado al API:**
```json
{
  "age": 24,
  "weight": 5.5,
  "breed": "Labrador",
  "currency": "COP",
  "petType": "Dog",
  "userIp": null,
  "locale": null,
  "tripClass": "Y",
  "passengers": {
    "adults": 1,
    "children": 0,
    "infants": 0
  },
  "segments": [
    {
      "origin": "BOG",
      "origin_country": null,
      "destination": "MDE",
      "destination_country": null,
      "date": "2024-12-15"
    },
    {
      "origin": "MDE",
      "origin_country": null,
      "destination": "BOG",
      "destination_country": null,
      "date": "2024-12-20"
    }
  ]
}
```

---

### 7. Backend Procesa y Retorna Resultados

**Response del API:**
```json
{
  "searchId": "search-1234567890",
  "totalResults": 3,
  "flights": [
    {
      "id": "flight-1",
      "airline": "Avianca",
      "flightNumber": "AV123",
      "origin": "BOG",
      "destination": "MDE",
      "departureTime": "2024-12-15T08:00:00",
      "arrivalTime": "2024-12-15T10:30:00",
      "duration": 150,
      "price": 450000,
      "currency": "COP",
      "availableSeats": 5,
      "segments": [...]
    },
    // ... más vuelos
  ]
}
```

---

### 8. Component Recibe la Respuesta

```typescript
next: response => {
  console.log('✅ Vuelos encontrados:', response);
  // response.flights contiene el array de vuelos
  // response.searchId contiene el ID de la búsqueda
  
  this.isSearching = false;
  
  // Navegar a resultados
  this.router.navigate(['/results'], {
    state: { 
      flights: response.flights,
      searchId: response.searchId 
    }
  });
}
```

---

## 🎯 Ventajas de este Flujo

### 1. Separación de Responsabilidades
- **Component**: Solo maneja la UI y eventos
- **View-Model**: Solo maneja la lógica del formulario
- **Interactor**: Orquesta los casos de uso
- **Use Case**: Ejecuta la lógica de negocio
- **Repository**: Maneja la comunicación con el API
- **Mapper**: Transforma los datos

### 2. Testeable
Cada capa se puede testear independientemente:
```typescript
// Test del mapper
it('should map form data to API request', () => {
  const formData = { ... };
  const result = FlightSearchFormMapper.toApiRequest(formData, 'COP');
  expect(result.petType).toBe('Dog');
});

// Test del use case
it('should call repository with correct params', () => {
  const spy = spyOn(repository, 'searchFlights');
  useCase.execute({ formData, currency: 'COP' });
  expect(spy).toHaveBeenCalledWith(formData, 'COP');
});
```

### 3. Mantenible
- Cambios en el formato del API solo afectan al mapper
- Cambios en la UI solo afectan al component
- Fácil agregar validaciones en el use case

### 4. Reutilizable
- El mapper se usa tanto en REAL como en FAKE
- El use case se puede usar desde cualquier component
- El interactor centraliza toda la lógica de negocio

---

## 🔄 Modo FAKE vs REAL

### Modo FAKE (npm run start:fake)
```typescript
// petfly-implementation.repository.fake.ts
searchFlights(formData, currency): Observable<SearchFlightsResponseEntity> {
  const request = FlightSearchFormMapper.toApiRequest(formData, currency);
  
  // Generar vuelos mock
  const mockFlights = { ... };
  
  return of(mockFlights).pipe(delay(2000));
}
```

### Modo REAL (npm run start:dev)
```typescript
// petfly-implementation.repository.ts
searchFlights(formData, currency): Observable<SearchFlightsResponseEntity> {
  const request = FlightSearchFormMapper.toApiRequest(formData, currency);
  
  return this.http.post(`${this.apiUrl}search`, request);
}
```

**Ambos usan el mismo mapper** → Consistencia garantizada

---

## 📝 Resumen

1. ✅ Usuario hace clic → `onSearch()`
2. ✅ Component obtiene `formData` del view-model
3. ✅ Component llama `petflyInteractor.searchFlights(formData, currency)`
4. ✅ Interactor ejecuta el use case
5. ✅ Use case llama al repository
6. ✅ Repository usa el **mapper** para transformar los datos
7. ✅ Repository hace POST al API
8. ✅ Component recibe la respuesta y navega a resultados

**El mapper está en la capa de datos donde debe estar** ✅
