# 🔄 Transferencia de Datos entre Páginas via Routing

## 📋 Objetivo

Pasar los datos de búsqueda desde `flight-search` a `flight-results` usando el sistema de routing de Angular, permitiendo:

✅ Mantener los resultados de búsqueda  
✅ Preservar los parámetros de búsqueda originales  
✅ Inicializar los filtros con los datos de búsqueda  
✅ Mantener currency y locale consistentes  

---

## 🏗️ Arquitectura Implementada

### 1. Interfaz de Estado

Definimos una interfaz para tipar los datos que se pasan entre páginas:

```typescript
// flight-results.page.ts
export interface FlightResultsState {
  searchResults: SearchFlightsResponseEntity;  // Resultados del API
  searchParams: FlightSearchFormEntity;        // Parámetros de búsqueda
  currency: string;                            // Moneda usada
  locale: string;                              // Idioma usado
}
```

---

## 📤 Envío de Datos (flight-search.page.ts)

### Implementación

```typescript
public onSearch(): void {
  if (this.viewModel.isFormValid()) {
    this.isSearching = true;
    const formData = this.viewModel.getFormData();
    const currency = this.viewModel.getCurrentCurrency();
    const locale = this.viewModel.getCurrentLocale();

    console.log('🚀 Iniciando búsqueda de vuelos...');
    console.log('  📋 Datos del formulario:', formData);
    console.log('  💰 Moneda:', currency);
    console.log('  🌍 Idioma:', locale);

    this.petflyInteractor
      .searchFlights(formData, currency, locale)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.isSearching = false;
          
          console.log('✅ Búsqueda completada exitosamente');
          console.log('  📊 Total de vuelos:', response.flightTickets?.length || 0);

          // 🔑 Navegar enviando todos los datos via state
          this.router.navigate(['/results'], {
            state: {
              searchResults: response,
              searchParams: formData,
              currency: currency,
              locale: locale,
            },
          });
        },
        error: error => {
          this.isSearching = false;
          console.error('❌ Error en la búsqueda:', error);
        }
      });
  }
}
```

### Datos Enviados

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `searchResults` | `SearchFlightsResponseEntity` | Respuesta completa del API con vuelos |
| `searchParams` | `FlightSearchFormEntity` | Parámetros originales de búsqueda |
| `currency` | `string` | Código de moneda (ej: 'COP', 'USD') |
| `locale` | `string` | Código de idioma (ej: 'es', 'en') |

---

## 📥 Recepción de Datos (flight-results.page.ts)

### Implementación

```typescript
export class FlightResultsPage implements OnInit {
  // Propiedades para almacenar los datos recibidos
  public searchResults: SearchFlightsResponseEntity | null = null;
  public searchParams: FlightSearchFormEntity | null = null;
  public searchCurrency: string | null = null;
  public searchLocale: string | null = null;

  constructor(
    public readonly viewModel: FlightResultsViewModel,
    private readonly i18nService: I18nService,
    private readonly router: Router
  ) {
    this.filtersForm = this.viewModel.filtersForm;
    this.loadSearchData(); // 🔑 Cargar datos en el constructor
  }

  public ngOnInit(): void {
    this.setupReactiveTexts();
    this.initializeFiltersFromSearch(); // 🔑 Inicializar filtros
  }

  /**
   * Carga los datos enviados desde la página de búsqueda
   */
  private loadSearchData(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as FlightResultsState;

    if (state) {
      this.searchResults = state.searchResults;
      this.searchParams = state.searchParams;
      this.searchCurrency = state.currency;
      this.searchLocale = state.locale;

      console.log('📦 Datos recibidos de la búsqueda:');
      console.log('  ✅ Resultados:', this.searchResults);
      console.log('  ✅ Parámetros:', this.searchParams);
      console.log('  ✅ Moneda:', this.searchCurrency);
      console.log('  ✅ Idioma:', this.searchLocale);
      console.log('  ✅ Total vuelos:', this.searchResults?.flightTickets?.length || 0);
    } else {
      console.warn('⚠️ No se recibieron datos de búsqueda');
    }
  }

  /**
   * Inicializa los filtros con los datos de la búsqueda original
   */
  private initializeFiltersFromSearch(): void {
    if (this.searchParams) {
      console.log('🔧 Inicializando filtros con datos de búsqueda...');
      
      this.viewModel.form.patchValue({
        origen: this.searchParams.origen,
        origenCity: this.searchParams.origenCity,
        destino: this.searchParams.destino,
        destinoCity: this.searchParams.destinoCity,
        fechaSalida: this.searchParams.fechaSalida,
        fechaRegreso: this.searchParams.fechaRegreso,
        pasajeros: this.searchParams.pasajeros,
        tipoMascota: this.searchParams.tipoMascota,
        pesoMascota: this.searchParams.pesoMascota,
        razaMascota: this.searchParams.razaMascota,
        edadMascota: this.searchParams.edadMascota,
      });

      if (this.searchParams.tipoMascota) {
        this.viewModel.selectPetType(
          this.searchParams.tipoMascota as Exclude<PetType, null>
        );
      }

      console.log('✅ Filtros inicializados correctamente');
    }
  }
}
```

---

## 🔄 Flujo Completo

```
1. Usuario llena formulario en flight-search
         ↓
2. Usuario hace clic en "Buscar"
         ↓
3. Se llama al servicio searchFlights()
         ↓
4. API retorna resultados
         ↓
5. Se navega a flight-results con state:
   {
     searchResults: response,
     searchParams: formData,
     currency: 'COP',
     locale: 'es'
   }
         ↓
6. flight-results recibe los datos en constructor
         ↓
7. loadSearchData() extrae los datos del state
         ↓
8. ngOnInit() inicializa filtros con searchParams
         ↓
9. Usuario ve resultados y filtros pre-llenados
```

---

## 📊 Ejemplo de Datos Transferidos

### searchResults (SearchFlightsResponseEntity)

```json
{
  "flightTickets": [
    {
      "flights": [...],
      "price": 361569.41,
      "currency": "COP",
      "isDirect": true
    }
  ],
  "filtersBoundary": {
    "flightsDuration": { "min": 50, "max": 287 },
    "price": { "min": 7167, "max": 34925 },
    "airlines": [...]
  }
}
```

### searchParams (FlightSearchFormEntity)

```json
{
  "tipoViaje": "roundtrip",
  "origen": "BOG",
  "origenCity": { "cityCode": "BOG", "cityName": "Bogotá", ... },
  "destino": "MDE",
  "destinoCity": { "cityCode": "MDE", "cityName": "Medellín", ... },
  "fechaSalida": "2024-12-15T00:00:00",
  "fechaRegreso": "2024-12-20T00:00:00",
  "pasajeros": {
    "adults": 1,
    "children": 0,
    "travelClass": "economy"
  },
  "tipoMascota": "dog",
  "pesoMascota": 7.5,
  "razaMascota": "Labrador",
  "edadMascota": 24
}
```

---

## ✨ Ventajas de este Enfoque

### 1. Datos Completos
- ✅ Resultados de búsqueda disponibles inmediatamente
- ✅ Parámetros originales preservados
- ✅ Currency y locale consistentes

### 2. Filtros Pre-inicializados
- ✅ Usuario ve sus parámetros de búsqueda en los filtros
- ✅ Puede modificar y re-buscar fácilmente
- ✅ Experiencia de usuario mejorada

### 3. Sin Llamadas Adicionales
- ✅ No necesita re-llamar al API al cargar la página
- ✅ Más rápido y eficiente
- ✅ Menos carga en el servidor

### 4. Debugging Fácil
- ✅ Console.logs muestran todo el flujo
- ✅ Fácil identificar problemas
- ✅ Datos visibles en cada paso

---

## 🎯 Uso de los Datos Recibidos

### Mostrar Resultados

```typescript
// En flight-results.page.html
<div *ngIf="searchResults">
  <h3>{{ searchResults.flightTickets.length }} vuelos encontrados</h3>
  
  <div *ngFor="let ticket of searchResults.flightTickets">
    <app-flight-card [ticket]="ticket"></app-flight-card>
  </div>
</div>
```

### Aplicar Filtros Modificados

```typescript
public applyFilters(): void {
  // Obtener filtros actuales (pueden ser modificados por el usuario)
  const filters = this.viewModel.getFiltersData();
  
  // Usar currency y locale originales
  const currency = this.searchCurrency || this.viewModel.getCurrentCurrency();
  const locale = this.searchLocale || this.viewModel.getCurrentLocale();
  
  // Re-buscar con filtros modificados
  this.petflyInteractor
    .searchFlights(filters, currency, locale, { useDefaults: true })
    .subscribe(response => {
      this.searchResults = response;
    });
}
```

---

## 🔧 Manejo de Casos Edge

### Sin Datos (Navegación Directa)

```typescript
private loadSearchData(): void {
  const navigation = this.router.getCurrentNavigation();
  const state = navigation?.extras?.state as FlightResultsState;

  if (!state) {
    console.warn('⚠️ No se recibieron datos de búsqueda');
    // Opción 1: Redirigir a búsqueda
    this.router.navigate(['/search']);
    
    // Opción 2: Mostrar mensaje
    // this.showNoDataMessage = true;
    
    return;
  }
  
  // Procesar datos...
}
```

### Datos Incompletos

```typescript
private loadSearchData(): void {
  const state = navigation?.extras?.state as FlightResultsState;

  if (state) {
    this.searchResults = state.searchResults;
    this.searchParams = state.searchParams;
    
    // Usar defaults si faltan datos
    this.searchCurrency = state.currency || 'COP';
    this.searchLocale = state.locale || 'es';
  }
}
```

---

## 🧪 Testing

### Test de Envío de Datos

```typescript
describe('FlightSearchPage - onSearch', () => {
  it('should navigate with correct state', () => {
    const routerSpy = spyOn(router, 'navigate');
    
    component.onSearch();
    
    expect(routerSpy).toHaveBeenCalledWith(['/results'], {
      state: jasmine.objectContaining({
        searchResults: jasmine.any(Object),
        searchParams: jasmine.any(Object),
        currency: 'COP',
        locale: 'es'
      })
    });
  });
});
```

### Test de Recepción de Datos

```typescript
describe('FlightResultsPage - loadSearchData', () => {
  it('should load data from navigation state', () => {
    const mockState: FlightResultsState = {
      searchResults: mockResults,
      searchParams: mockParams,
      currency: 'USD',
      locale: 'en'
    };
    
    spyOn(router, 'getCurrentNavigation').and.returnValue({
      extras: { state: mockState }
    } as any);
    
    component.loadSearchData();
    
    expect(component.searchResults).toEqual(mockResults);
    expect(component.searchCurrency).toBe('USD');
  });
});
```

---

## 📝 Console Output Esperado

### En flight-search (al buscar):

```
🚀 Iniciando búsqueda de vuelos...
  📋 Datos del formulario: { origen: 'BOG', destino: 'MDE', ... }
  💰 Moneda: COP
  🌍 Idioma: es
✅ Búsqueda completada exitosamente
  📊 Total de vuelos encontrados: 3
  🔍 Filtros disponibles: { flightsDuration: {...}, price: {...} }
```

### En flight-results (al cargar):

```
📦 Datos recibidos de la búsqueda:
  ✅ Resultados: { flightTickets: [...], filtersBoundary: {...} }
  ✅ Parámetros de búsqueda: { origen: 'BOG', destino: 'MDE', ... }
  ✅ Moneda: COP
  ✅ Idioma: es
  ✅ Total de vuelos: 3
🔧 Inicializando filtros con datos de búsqueda...
✅ Filtros inicializados correctamente
```

---

## 🎯 Resumen

✅ **Datos completos** transferidos via routing state  
✅ **Filtros pre-inicializados** con parámetros de búsqueda  
✅ **Currency y locale** preservados  
✅ **Console logs** para debugging  
✅ **Sin llamadas adicionales** al API  
✅ **Experiencia de usuario** mejorada  

¡Transferencia de datos implementada correctamente! 🚀
