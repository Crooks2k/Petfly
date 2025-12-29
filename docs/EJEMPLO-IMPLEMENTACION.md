# 💻 Guía de Implementación de Servicios

Esta guía te muestra paso a paso cómo agregar un nuevo servicio a la arquitectura limpia y cómo usarlo en tus páginas.

---

## 📋 Pasos para Agregar un Nuevo Servicio

### Paso 1: Crear las Entidades (Request y Response)

Las entidades definen la estructura de datos que envías y recibes.

**Ubicación:** `src/app/features/flight-search/core/entities/`

#### Ejemplo: Get Cities

**get-cities-request.entity.ts**
```typescript
export interface GetCitiesRequestEntity {
  query: string;   // Parámetro de búsqueda
  limit: number;   // Límite de resultados
}
```

**get-cities-response.entity.ts**
```typescript
export interface GetCitiesResponseEntity {
  cities: CityEntity[];
}

export interface CityEntity {
  id: string;
  name: string;
  code: string;
  country: string;
  countryCode: string;
}
```

**index.ts** (exportar las entidades)
```typescript
export * from './get-cities-request.entity';
export * from './get-cities-response.entity';
```

---

### Paso 2: Agregar Método al Repository (Contrato)

El repository es una clase abstracta que define el contrato que deben cumplir las implementaciones.

**Ubicación:** `src/app/features/flight-search/core/repositories/petfly.repository.ts`

```typescript
import { Observable } from 'rxjs';
import { GetCitiesRequestEntity, GetCitiesResponseEntity } from '../entities';

export abstract class PetflyRepository {
  // Agregar el nuevo método abstracto
  abstract getCities(request: GetCitiesRequestEntity): Observable<GetCitiesResponseEntity>;
}
```

---

### Paso 3: Crear el Use Case

El use case encapsula la lógica de negocio del servicio.

**Ubicación:** `src/app/features/flight-search/core/usecases/get-cities.usecase.ts`

```typescript
import { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { GetCitiesRequestEntity, GetCitiesResponseEntity } from '../entities';
import { PetflyRepository } from '../repositories/petfly.repository';

export class GetCitiesUseCase
  implements UseCase<GetCitiesRequestEntity, GetCitiesResponseEntity>
{
  constructor(private readonly petflyRepository: PetflyRepository) {}

  public execute(request: GetCitiesRequestEntity): Observable<GetCitiesResponseEntity> {
    // Aquí puedes agregar validaciones o lógica adicional
    return this.petflyRepository.getCities(request);
  }
}
```

**index.ts** (exportar el use case)
```typescript
export * from './get-cities.usecase';
```

---

### Paso 4: Agregar al Interactor

El interactor orquesta los casos de uso y es el punto de entrada desde la capa de presentación.

**Ubicación:** `src/app/features/flight-search/core/interactor/petfly.interactor.ts`

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetCitiesRequestEntity, GetCitiesResponseEntity } from '../entities';
import { PetflyRepository } from '../repositories/petfly.repository';
import { GetCitiesUseCase } from '../usecases/get-cities.usecase';

@Injectable()
export class PetflyInteractor {
  public getCitiesUseCase: GetCitiesUseCase;

  constructor(private readonly repository: PetflyRepository) {
    // Instanciar el use case en el constructor
    this.getCitiesUseCase = new GetCitiesUseCase(repository);
  }

  // Método público que ejecuta el use case
  public getCities(request: GetCitiesRequestEntity): Observable<GetCitiesResponseEntity> {
    return this.getCitiesUseCase.execute(request);
  }
}
```

---

### Paso 5: Implementación REAL (Conexión a API)

Esta implementación hace la llamada HTTP real al backend.

**Ubicación:** `src/app/features/flight-search/data/repositories/petfly-implementation.repository.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetCitiesRequestEntity, GetCitiesResponseEntity } from '@flight-search/core/entities';
import { PetflyRepository } from '@flight-search/core/repositories/petfly.repository';
import { environment } from '@environments/environment';

@Injectable()
export class PetflyImplementationRepository extends PetflyRepository {
  private readonly apiUrl = environment.API_SERVICES.API_URL;

  constructor(private readonly http: HttpClient) {
    super();
  }

  getCities(request: GetCitiesRequestEntity): Observable<GetCitiesResponseEntity> {
    // Construir los query params
    const params = new HttpParams()
      .set('query', request.query)
      .set('limit', request.limit.toString());

    // Hacer la llamada HTTP GET
    return this.http.get<GetCitiesResponseEntity>(`${this.apiUrl}cities`, { params });
    // Resultado: GET /api/cities?query=Bogotá&limit=10
  }
}
```

---

### Paso 6: Implementación FAKE (Datos Mock)

Esta implementación retorna datos simulados para desarrollo sin backend.

**Ubicación:** `src/app/features/flight-search/data/repositories/petfly-implementation.repository.fake.ts`

```typescript
import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { GetCitiesRequestEntity, GetCitiesResponseEntity } from '@flight-search/core/entities';
import { PetflyRepository } from '@flight-search/core/repositories/petfly.repository';

@Injectable()
export class PetflyImplementationRepositoryFake extends PetflyRepository {
  // Datos mock
  private mockCities: GetCitiesResponseEntity = {
    cities: [
      { id: '1', name: 'Bogotá', code: 'BOG', country: 'Colombia', countryCode: 'CO' },
      { id: '2', name: 'Medellín', code: 'MDE', country: 'Colombia', countryCode: 'CO' },
      { id: '3', name: 'Cali', code: 'CLO', country: 'Colombia', countryCode: 'CO' },
      // ... más ciudades
    ],
  };

  getCities(request: GetCitiesRequestEntity): Observable<GetCitiesResponseEntity> {
    // Filtrar ciudades basado en el query
    const filteredCities = this.mockCities.cities.filter(
      city =>
        city.name.toLowerCase().includes(request.query.toLowerCase()) ||
        city.code.toLowerCase().includes(request.query.toLowerCase()) ||
        city.country.toLowerCase().includes(request.query.toLowerCase())
    );

    // Limitar resultados
    const limitedCities = filteredCities.slice(0, request.limit);

    // Simular latencia de red (800ms)
    return of({ cities: limitedCities }).pipe(delay(800));
  }
}
```

---

## 🎯 Cómo Usar el Servicio en una Page

### Opción 1: Uso Directo en el Componente

**Ubicación:** `src/app/features/flight-search/presentation/pages/flight-search/flight-search.page.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { PetflyInteractor } from '@flight-search/core/interactor/petfly.interactor';
import { CityEntity } from '@flight-search/core/entities';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.page.html',
  styleUrl: './flight-search.page.scss',
})
export class FlightSearchPage implements OnInit {
  // Variables del componente
  cities: CityEntity[] = [];
  isLoadingCities = false;
  selectedCity: CityEntity | null = null;

  // 👇 Inyectar el interactor en el constructor
  constructor(
    private readonly petflyInteractor: PetflyInteractor,
    // ... otros servicios
  ) {}

  ngOnInit(): void {
    // Cargar ciudades al iniciar
    this.loadCities('');
  }

  // Método para buscar ciudades
  loadCities(query: string): void {
    this.isLoadingCities = true;
    
    // 👇 Llamar al interactor
    this.petflyInteractor
      .getCities({ query, limit: 10 })
      .subscribe({
        next: (response) => {
          this.cities = response.cities;
          this.isLoadingCities = false;
          console.log('✅ Ciudades cargadas:', this.cities);
        },
        error: (error) => {
          console.error('❌ Error al cargar ciudades:', error);
          this.isLoadingCities = false;
          this.cities = [];
        }
      });
  }

  // Método para buscar mientras el usuario escribe (con PrimeNG AutoComplete)
  onCitySearch(event: any): void {
    const query = event.query || '';
    this.loadCities(query);
  }

  // Método cuando se selecciona una ciudad
  onCitySelect(city: CityEntity): void {
    this.selectedCity = city;
    console.log('Ciudad seleccionada:', city);
  }
}
```

### HTML con PrimeNG AutoComplete

```html
<!-- flight-search.page.html -->
<div class="form-group">
  <label for="origin">{{ texts.origin }}</label>
  
  <p-autoComplete
    [(ngModel)]="selectedCity"
    [suggestions]="cities"
    (completeMethod)="onCitySearch($event)"
    (onSelect)="onCitySelect($event)"
    field="name"
    [placeholder]="texts.selectCity"
    [dropdown]="true"
    [loading]="isLoadingCities">
    
    <!-- Template personalizado para cada item -->
    <ng-template let-city pTemplate="item">
      <div class="city-item">
        <span class="city-name">{{ city.name }}</span>
        <span class="city-code">({{ city.code }})</span>
        <span class="city-country">- {{ city.country }}</span>
      </div>
    </ng-template>
  </p-autoComplete>
</div>
```

---

### Opción 2: Uso en ViewModel

Si prefieres separar la lógica en un ViewModel:

**flight-search.view-model.ts**
```typescript
import { Injectable } from '@angular/core';
import { PetflyInteractor } from '@flight-search/core/interactor/petfly.interactor';
import { CityEntity } from '@flight-search/core/entities';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class FlightSearchViewModel {
  private citiesSubject = new BehaviorSubject<CityEntity[]>([]);
  public cities$ = this.citiesSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private readonly petflyInteractor: PetflyInteractor) {}

  searchCities(query: string, limit: number = 10): void {
    this.loadingSubject.next(true);
    
    this.petflyInteractor
      .getCities({ query, limit })
      .subscribe({
        next: (response) => {
          this.citiesSubject.next(response.cities);
          this.loadingSubject.next(false);
        },
        error: (error) => {
          console.error('Error:', error);
          this.citiesSubject.next([]);
          this.loadingSubject.next(false);
        }
      });
  }
}
```

**flight-search.page.ts** (usando ViewModel)
```typescript
export class FlightSearchPage implements OnInit {
  cities$ = this.viewModel.cities$;
  loading$ = this.viewModel.loading$;

  constructor(public readonly viewModel: FlightSearchViewModel) {}

  onCitySearch(event: any): void {
    const query = event.query || '';
    this.viewModel.searchCities(query);
  }
}
```

**flight-search.page.html** (con async pipe)
```html
<p-autoComplete
  [suggestions]="cities$ | async"
  (completeMethod)="onCitySearch($event)"
  [loading]="loading$ | async">
</p-autoComplete>
```

---

## 📝 Ejemplos de Otros Servicios

### Ejemplo 1: Get Currencies (sin parámetros)

```typescript
// 1. Entidades
export interface GetCurrenciesRequestEntity {}

export interface GetCurrenciesResponseEntity {
  currencies: CurrencyEntity[];
}

// 2. Repository
abstract getCurrencies(request: GetCurrenciesRequestEntity): Observable<GetCurrenciesResponseEntity>;

// 3. Use Case
export class GetCurrenciesUseCase {
  execute(request: GetCurrenciesRequestEntity): Observable<GetCurrenciesResponseEntity> {
    return this.petflyRepository.getCurrencies(request);
  }
}

// 4. Interactor
public getCurrencies(request: GetCurrenciesRequestEntity): Observable<GetCurrenciesResponseEntity> {
  return this.getCurrenciesUseCase.execute(request);
}

// 5. Implementation REAL
getCurrencies(request: GetCurrenciesRequestEntity): Observable<GetCurrenciesResponseEntity> {
  return this.http.get<GetCurrenciesResponseEntity>(`${this.apiUrl}currencies`);
}

// 6. Implementation FAKE
getCurrencies(request: GetCurrenciesRequestEntity): Observable<GetCurrenciesResponseEntity> {
  return of(this.mockCurrencies).pipe(delay(600));
}

// 7. Uso en Page
this.petflyInteractor.getCurrencies({}).subscribe(response => {
  this.currencies = response.currencies;
});
```

---

### Ejemplo 2: Get Breeds (con query params)

```typescript
// 1. Entidades
export interface GetBreedsRequestEntity {
  petTypeId: string;
}

export interface GetBreedsResponseEntity {
  breeds: BreedEntity[];
}

// 2. Repository
abstract getBreeds(request: GetBreedsRequestEntity): Observable<GetBreedsResponseEntity>;

// 3. Use Case
export class GetBreedsUseCase {
  execute(request: GetBreedsRequestEntity): Observable<GetBreedsResponseEntity> {
    return this.petflyRepository.getBreeds(request);
  }
}

// 4. Interactor
public getBreeds(request: GetBreedsRequestEntity): Observable<GetBreedsResponseEntity> {
  return this.getBreedsUseCase.execute(request);
}

// 5. Implementation REAL
getBreeds(request: GetBreedsRequestEntity): Observable<GetBreedsResponseEntity> {
  const params = new HttpParams().set('petTypeId', request.petTypeId);
  return this.http.get<GetBreedsResponseEntity>(`${this.apiUrl}breeds`, { params });
}

// 6. Implementation FAKE
getBreeds(request: GetBreedsRequestEntity): Observable<GetBreedsResponseEntity> {
  const breeds = this.mockBreeds[request.petTypeId] || { breeds: [] };
  return of(breeds).pipe(delay(700));
}

// 7. Uso en Page
onPetTypeChange(petTypeId: string): void {
  this.petflyInteractor.getBreeds({ petTypeId }).subscribe(response => {
    this.breeds = response.breeds;
  });
}
```

---

## ✅ Checklist para Agregar un Nuevo Servicio

- [ ] **Paso 1:** Crear `get-[nombre]-request.entity.ts`
- [ ] **Paso 2:** Crear `get-[nombre]-response.entity.ts`
- [ ] **Paso 3:** Exportar entidades en `entities/index.ts`
- [ ] **Paso 4:** Agregar método abstracto en `petfly.repository.ts`
- [ ] **Paso 5:** Crear `get-[nombre].usecase.ts`
- [ ] **Paso 6:** Exportar use case en `usecases/index.ts`
- [ ] **Paso 7:** Agregar al interactor:
  - [ ] Importar entidades y use case
  - [ ] Declarar propiedad del use case
  - [ ] Instanciar en el constructor
  - [ ] Crear método público
- [ ] **Paso 8:** Implementar en `petfly-implementation.repository.ts` (REAL)
- [ ] **Paso 9:** Implementar en `petfly-implementation.repository.fake.ts` (FAKE)
- [ ] **Paso 10:** Usar en la page inyectando el interactor

---

## 💡 Tips y Mejores Prácticas

### 1. Nombres Consistentes
- Request: `Get[Entity]RequestEntity`
- Response: `Get[Entity]ResponseEntity`
- Use Case: `Get[Entity]UseCase`
- Método: `get[Entity]()`

### 2. Manejo de Errores
```typescript
this.petflyInteractor.getCities({ query, limit: 10 })
  .subscribe({
    next: (response) => {
      // Éxito
      this.cities = response.cities;
    },
    error: (error) => {
      // Error
      console.error('Error:', error);
      // Mostrar mensaje al usuario
      this.showErrorMessage('No se pudieron cargar las ciudades');
    }
  });
```

### 3. Loading States
```typescript
loadCities(query: string): void {
  this.isLoading = true;
  
  this.petflyInteractor.getCities({ query, limit: 10 })
    .subscribe({
      next: (response) => {
        this.cities = response.cities;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
}
```

### 4. Unsubscribe
```typescript
private destroy$ = new Subject<void>();

ngOnInit(): void {
  this.petflyInteractor.getCities({ query: '', limit: 10 })
    .pipe(takeUntil(this.destroy$))
    .subscribe(response => {
      this.cities = response.cities;
    });
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### 5. Delay en FAKE
Simula latencia de red para testing realista:
```typescript
return of(mockData).pipe(delay(600)); // 600-800ms
```

### 6. Filtrado en FAKE
Implementa lógica de filtrado para simular búsquedas:
```typescript
const filtered = this.mockData.filter(item =>
  item.name.toLowerCase().includes(query.toLowerCase())
);
```

---

## 🎯 Resumen del Flujo

1. **Component** llama a `petflyInteractor.getCities(request)`
2. **Interactor** ejecuta `getCitiesUseCase.execute(request)`
3. **Use Case** llama a `petflyRepository.getCities(request)`
4. **Angular** inyecta la implementación correcta (Real o Fake)
5. **Implementation** retorna `Observable<Response>`
6. **Component** recibe la respuesta y actualiza la UI

---

## 🔄 Flujo Completo: Search Flights

### Paso a Paso

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
    SearchFlightsUseCase → repository.searchFlights(formData, currency)
         ↓
    FlightSearchFormMapper.toApiRequest(formData, currency)
         ↓
    http.post('/api/search', request)
         ↓
    Component recibe response y navega a resultados
```

### Transferencia de Datos entre Páginas

Los datos se pasan entre páginas usando el routing state de Angular:

```typescript
// Envío (flight-search.page.ts)
this.router.navigate(['/results'], {
  state: {
    searchResults: response,
    searchParams: formData,
    currency: currency,
    locale: locale,
  },
});

// Recepción (flight-results.page.ts)
private loadSearchData(): void {
  const navigation = this.router.getCurrentNavigation();
  const state = navigation?.extras?.state as FlightResultsState;
  
  if (state) {
    this.searchResults = state.searchResults;
    this.searchParams = state.searchParams;
    this.searchCurrency = state.currency;
    this.searchLocale = state.locale;
  }
}
```

---

## 🔍 Servicio de Filtros

El servicio de filtros usa query params + body para filtrar resultados basándose en una búsqueda previa:

### Endpoint
```
POST /api/filter?searchId=xxx&isDirect=false&maxPrice=500000
```

### Implementación

```typescript
// Uso en ViewModel
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

El mapper reutiliza `FlightSearchFormMapper` para el body y extrae query params del formulario.

---

## 🚀 Comandos para Probar

```bash
# Modo FAKE (datos mock)
npm run start:fake

# Modo DEV (API real)
npm run start:dev
```

### 1. Crear las Entidades

```typescript
// core/entities/get-cities-request.entity.ts
export interface GetCitiesRequestEntity {
  query: string;
  limit: number;
}

// core/entities/get-cities-response.entity.ts
export interface GetCitiesResponseEntity {
  cities: CityEntity[];
}

export interface CityEntity {
  id: string;
  name: string;
  code: string;
  country: string;
  countryCode: string;
}

// core/entities/index.ts
export * from './get-cities-request.entity';
export * from './get-cities-response.entity';
```

### 2. Crear el Repository (Contrato)

```typescript
// core/repositories/petfly.repository.ts
import { Observable } from 'rxjs';
import { GetCitiesRequestEntity, GetCitiesResponseEntity } from '../entities';

export abstract class PetflyRepository {
  abstract getCities(request: GetCitiesRequestEntity): Observable<GetCitiesResponseEntity>;
}
```

### 3. Crear el Use Case

```typescript
// core/usecases/get-cities.usecase.ts
import { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { GetCitiesRequestEntity, GetCitiesResponseEntity } from '../entities';
import { PetflyRepository } from '../repositories/petfly.repository';

export class GetCitiesUseCase
  implements UseCase<GetCitiesRequestEntity, GetCitiesResponseEntity>
{
  constructor(private readonly petflyRepository: PetflyRepository) {}

  public execute(request: GetCitiesRequestEntity): Observable<GetCitiesResponseEntity> {
    return this.petflyRepository.getCities(request);
  }
}
```

### 4. Agregar al Interactor

```typescript
// core/interactor/petfly.interactor.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetCitiesRequestEntity, GetCitiesResponseEntity } from '../entities';
import { PetflyRepository } from '../repositories/petfly.repository';
import { GetCitiesUseCase } from '../usecases/get-cities.usecase';

@Injectable()
export class PetflyInteractor {
  public getCitiesUseCase: GetCitiesUseCase;

  constructor(private readonly repository: PetflyRepository) {
    this.getCitiesUseCase = new GetCitiesUseCase(repository);
  }

  public getCities(request: GetCitiesRequestEntity): Observable<GetCitiesResponseEntity> {
    return this.getCitiesUseCase.execute(request);
  }
}
```

### 5. Implementación REAL (API)

```typescript
// data/repositories/petfly-implementation.repository.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetCitiesRequestEntity, GetCitiesResponseEntity } from '@flight-search/core/entities';
import { PetflyRepository } from '@flight-search/core/repositories/petfly.repository';
import { environment } from '@environments/environment';

@Injectable()
export class PetflyImplementationRepository extends PetflyRepository {
  private readonly apiUrl = environment.API_SERVICES.API_URL;

  constructor(private readonly http: HttpClient) {
    super();
  }

  getCities(request: GetCitiesRequestEntity): Observable<GetCitiesResponseEntity> {
    const params = new HttpParams()
      .set('query', request.query)
      .set('limit', request.limit.toString());

    return this.http.get<GetCitiesResponseEntity>(`${this.apiUrl}cities`, { params });
  }
}
```

### 6. Implementación FAKE (Mock)

```typescript
// data/repositories/petfly-implementation.repository.fake.ts
import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { GetCitiesRequestEntity, GetCitiesResponseEntity } from '@flight-search/core/entities';
import { PetflyRepository } from '@flight-search/core/repositories/petfly.repository';

@Injectable()
export class PetflyImplementationRepositoryFake extends PetflyRepository {
  private mockCities: GetCitiesResponseEntity = {
    cities: [
      { id: '1', name: 'Bogotá', code: 'BOG', country: 'Colombia', countryCode: 'CO' },
      { id: '2', name: 'Medellín', code: 'MDE', country: 'Colombia', countryCode: 'CO' },
      // ... más ciudades
    ],
  };

  getCities(request: GetCitiesRequestEntity): Observable<GetCitiesResponseEntity> {
    const filteredCities = this.mockCities.cities.filter(
      city =>
        city.name.toLowerCase().includes(request.query.toLowerCase()) ||
        city.code.toLowerCase().includes(request.query.toLowerCase())
    );

    const limitedCities = filteredCities.slice(0, request.limit);

    return of({ cities: limitedCities }).pipe(delay(800));
  }
}
```

### 7. Configurar Service Providers

```typescript
// core/service-providers/service-provider.module.ts (REAL)
@NgModule({
  providers: [
    {
      provide: PetflyRepository,
      useClass: PetflyImplementationRepository,
    },
  ],
})
export class ServiceProviderModule {}

// core/service-providers/service-provider.module.fake.ts (FAKE)
@NgModule({
  providers: [
    {
      provide: PetflyRepository,
      useClass: PetflyImplementationRepositoryFake,
    },
  ],
})
export class ServiceProviderModule {}
```

### 8. Usar en un Componente

```typescript
// presentation/pages/flight-search/flight-search.page.ts
import { Component, OnInit } from '@angular/core';
import { PetflyInteractor } from '@flight-search/core/interactor/petfly.interactor';
import { CityEntity } from '@flight-search/core/entities';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.page.html',
})
export class FlightSearchPage implements OnInit {
  cities: CityEntity[] = [];
  isLoading = false;

  constructor(private readonly petflyInteractor: PetflyInteractor) {}

  ngOnInit(): void {
    this.searchCities('Bogotá');
  }

  searchCities(query: string): void {
    this.isLoading = true;
    
    this.petflyInteractor
      .getCities({ query, limit: 10 })
      .subscribe({
        next: (response) => {
          this.cities = response.cities;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.isLoading = false;
        }
      });
  }
}
```

## 🔄 Resumen del Flujo

1. **Component** llama a `petflyInteractor.getCities(request)`
2. **Interactor** ejecuta `getCitiesUseCase.execute(request)`
3. **Use Case** llama a `petflyRepository.getCities(request)`
4. **Angular** inyecta la implementación correcta (Real o Fake)
5. **Implementation** retorna `Observable<Response>`
6. **Component** recibe la respuesta y actualiza la UI

## 📝 Checklist para Agregar un Nuevo Servicio

- [ ] Crear entidades (request y response)
- [ ] Exportar entidades en `index.ts`
- [ ] Agregar método abstracto al repository
- [ ] Crear el use case
- [ ] Exportar use case en `index.ts`
- [ ] Agregar al interactor (instanciar use case y crear método público)
- [ ] Implementar en repository REAL (HTTP call)
- [ ] Implementar en repository FAKE (mock data)
- [ ] Usar en componente inyectando el interactor

## 🎯 Ejemplos de Otros Servicios

### Get Currencies (sin parámetros)

```typescript
// Request
interface GetCurrenciesRequestEntity {}

// Response
interface GetCurrenciesResponseEntity {
  currencies: CurrencyEntity[];
}

// Uso
this.petflyInteractor.getCurrencies({}).subscribe(response => {
  this.currencies = response.currencies;
});
```

### Get Breeds (con query params)

```typescript
// Request
interface GetBreedsRequestEntity {
  petTypeId: string;
}

// Response
interface GetBreedsResponseEntity {
  breeds: BreedEntity[];
}

// Uso
this.petflyInteractor.getBreeds({ petTypeId: '7048' }).subscribe(response => {
  this.breeds = response.breeds;
});
```

---

### Ejemplo 3: Search Flights (POST con mapper)

Este ejemplo muestra cómo implementar un servicio POST que requiere transformación de datos mediante un mapper.

```typescript
// 1. Entidades
export interface SearchFlightsRequestEntity {
  age: number;
  weight: number;
  breed: string;
  currency: string;
  petType: string;
  tripClass: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  segments: Array<{
    origin: string;
    destination: string;
    date: string;
  }>;
}

export interface SearchFlightsResponseEntity {
  searchId: string;
  totalResults: number;
  flights: FlightEntity[];
}

// 2. Repository
abstract searchFlights(
  formData: FlightSearchFormEntity,
  currency: string
): Observable<SearchFlightsResponseEntity>;

// 3. Use Case
export class SearchFlightsUseCase {
  execute(params: {
    formData: FlightSearchFormEntity;
    currency: string;
  }): Observable<SearchFlightsResponseEntity> {
    return this.petflyRepository.searchFlights(params.formData, params.currency);
  }
}

// 4. Interactor
public searchFlights(
  formData: FlightSearchFormEntity,
  currency: string
): Observable<SearchFlightsResponseEntity> {
  return this.searchFlightsUseCase.execute({ formData, currency });
}

// 5. Mapper (en data/mappers/)
export class FlightSearchFormMapper {
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
      tripClass: formData.pasajeros.travelClass === 'economy' ? 'Y' : 'C',
      passengers: {
        adults: formData.pasajeros.adults,
        children: formData.pasajeros.children,
        infants: 0
      },
      segments: [
        {
          origin: formData.origen,
          destination: formData.destino,
          date: this.formatDate(formData.fechaSalida)
        },
        {
          origin: formData.destino,
          destination: formData.origen,
          date: this.formatDate(formData.fechaRegreso)
        }
      ]
    };
  }
}

// 6. Implementation REAL
searchFlights(
  formData: FlightSearchFormEntity,
  currency: string
): Observable<SearchFlightsResponseEntity> {
  // Usar el mapper para transformar los datos
  const request = FlightSearchFormMapper.toApiRequest(formData, currency);
  
  // Hacer POST al API
  return this.http.post<SearchFlightsResponseEntity>(`${this.apiUrl}search`, request);
}

// 7. Implementation FAKE
searchFlights(
  formData: FlightSearchFormEntity,
  currency: string
): Observable<SearchFlightsResponseEntity> {
  // Usar el mismo mapper
  const request = FlightSearchFormMapper.toApiRequest(formData, currency);
  
  // Generar datos mock
  const mockResponse: SearchFlightsResponseEntity = {
    searchId: `search-${Date.now()}`,
    totalResults: 3,
    flights: [
      {
        id: 'flight-1',
        airline: 'Avianca',
        flightNumber: 'AV123',
        origin: request.segments[0].origin,
        destination: request.segments[0].destination,
        departureTime: '2024-12-15T08:00:00',
        arrivalTime: '2024-12-15T10:30:00',
        duration: 150,
        price: 450000,
        currency: request.currency,
        availableSeats: 5,
        segments: []
      }
    ]
  };
  
  return of(mockResponse).pipe(delay(2000));
}

// 8. Uso en Page
onSearch(): void {
  const formData = this.viewModel.getFormData();
  const currency = this.currencyService.getCurrentCurrencyCode();
  
  this.petflyInteractor.searchFlights(formData, currency)
    .subscribe({
      next: response => {
        console.log('Vuelos encontrados:', response.flights);
        this.router.navigate(['/results'], {
          state: { flights: response.flights }
        });
      },
      error: error => {
        console.error('Error:', error);
      }
    });
}
```

**Ventajas del Mapper:**
- ✅ Transformación centralizada en la capa de datos
- ✅ Mismo mapper usado en REAL y FAKE
- ✅ Fácil de testear
- ✅ Cambios en el API solo afectan al mapper

---

## 💡 Tips

1. **Nombres consistentes**: Usa el patrón `Get[Entity]RequestEntity` y `Get[Entity]ResponseEntity`
2. **Delay en fake**: Simula latencia de red (600-800ms) para testing realista
3. **Filtrado en fake**: Implementa lógica de filtrado para simular búsquedas
4. **Logs**: Agrega console.log en cada capa para debugging
5. **Errores**: Maneja errores en el componente con el operador `error` del subscribe
6. **Mappers**: Coloca los mappers en `data/mappers/` para transformaciones complejas
7. **POST requests**: Usa mappers para transformar datos del formulario al formato del API
