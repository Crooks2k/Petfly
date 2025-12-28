# Componente Flight Card

## Resumen

Componente acordeón responsive que muestra información de vuelos en la página de resultados. Se adapta automáticamente a desktop y mobile.

## Características Implementadas

### Vista Colapsada (Header)
- Logo de la aerolínea
- Hora de salida y llegada
- Duración del vuelo
- Número de escalas y aeropuertos
- Precio por persona
- Icono de expansión/colapso

### Vista Expandida (Body)

#### Detalles del Vuelo
- **Vuelo de ida**: Timeline completo con:
  - Logo y nombre de aerolínea
  - Hora y aeropuerto de salida
  - Duración del segmento
  - Hora y aeropuerto de llegada
  - Información de escalas (si aplica)

- **Vuelo de regreso** (si es roundtrip): Misma estructura que el vuelo de ida

#### Sección de Precios
- **Precio por persona**: Precio base del vuelo
- **Precio mascota**: Rango de precios con badges (MR, PS)
  - MR (Mascota Regular): Precio con certificado
  - AE (Apoyo Emocional): Rango de precios
  - PS (Perro de Servicio): Precio
  - Indicador si AE no está aceptado
- **Precio total**: Rango total (pasajeros + mascota)
- **Botón de selección**: Para elegir el vuelo
- **Advertencia**: Mensaje sobre verificación de precios

## Funcionalidades

### Métodos Principales

```typescript
// Alternar expansión del acordeón
toggleExpanded(): void

// Seleccionar vuelo (con stopPropagation para evitar cerrar acordeón)
onSelectFlight(event: Event): void

// Formatear hora desde ISO string
formatTime(isoString: string): string

// Formatear fecha completa desde ISO string
formatDate(isoString: string): string

// Formatear duración en minutos a "Xh Ymin"
formatDuration(minutes: number): string

// Calcular duración de escala entre dos vuelos
getLayoverDuration(arrivalTime: string, departureTime: string): string

// Obtener nombre del aeropuerto desde código
getAirportName(code: string): string

// Obtener texto de escalas
getStopsText(): string

// Obtener códigos de aeropuertos de escalas
getStopsCodes(flight: any): string

// Calcular duración total del vuelo
getTotalDuration(flight: any): number

// Obtener offset de día (+1, +2, etc.)
getArrivalDayOffset(departureTime: string, arrivalTime: string): string

// Formatear precio con separadores de miles
formatPrice(price: number): string
```

### Propiedades Computadas

```typescript
// Obtiene el vuelo de ida
get outboundFlight()

// Obtiene el vuelo de regreso (si existe)
get returnFlight()

// Verifica si tiene precio MR
get hasMRPrice(): boolean

// Verifica si AE no está aceptado
get isAENotAccepted(): boolean
```

## Inputs del Componente

```typescript
@Input() flightTicket!: FlightTicketEntity;  // Datos del vuelo
@Input() isRoundTrip: boolean = false;       // Si es ida y vuelta
```

## Uso en la Página de Resultados

```html
<petfly-flight-card
  *ngFor="let flightTicket of searchResults?.flightTickets"
  [flightTicket]="flightTicket"
  [isRoundTrip]="isRoundTrip"
>
</petfly-flight-card>
```

## Textos i18n

### Español (es.json)
```json
{
  "flightCard": {
    "pricePerPerson": "Precio por persona",
    "petPrice": "Precio mascota",
    "totalPrice": "Precio total (pasajeros + mascota)",
    "totalPriceSubtitle": "(pasajeros + mascota)",
    "selectButton": "Seleccionar",
    "direct": "Directo",
    "stop": "escala",
    "stops": "escalas",
    "stopAtAirport": "Escala en el aeropuerto",
    "operatedBy": "Operado por",
    "outboundFlight": "Vuelo de ida",
    "returnFlight": "Vuelo de regreso",
    "priceEstimationWarning": "Precio total es una estimación...",
    "mrBadge": "MR",
    "aeBadge": "AE",
    "psBadge": "PS",
    "mrLabel": "MR",
    "aeLabel": "AE",
    "psLabel": "PS",
    "aeNotAccepted": "AE no aceptado"
  }
}
```

### Inglés (en.json)
```json
{
  "flightCard": {
    "pricePerPerson": "Price per person",
    "petPrice": "Pet price",
    "totalPrice": "Total price (passengers + pet)",
    "totalPriceSubtitle": "(passengers + pet)",
    "selectButton": "Select",
    "direct": "Direct",
    "stop": "stop",
    "stops": "stops",
    "stopAtAirport": "Stop at airport",
    "operatedBy": "Operated by",
    "outboundFlight": "Outbound flight",
    "returnFlight": "Return flight",
    "priceEstimationWarning": "Total price is an estimate...",
    "mrBadge": "MR",
    "aeBadge": "AE",
    "psBadge": "PS",
    "mrLabel": "MR",
    "aeLabel": "AE",
    "psLabel": "PS",
    "aeNotAccepted": "AE not accepted"
  }
}
```

## Diseño Responsive

### Desktop
- Card completa con toda la información visible
- Acordeón para expandir/colapsar detalles
- Grid de 3 columnas para precios
- Hover effects en botones

### Mobile
- Card compacta con información esencial
- Precio se muestra debajo con borde superior
- Grid de 1 columna para precios
- Icono de expansión en posición absoluta (top-right)

## Estilos Destacados

### Colores de Badges
- **MR (Azul)**: `#2196f3`
- **PS (Verde)**: `#4caf50`

### Animaciones
- Expansión del acordeón: `slideDown 0.3s ease`
- Hover en botones: `translateY(-2px)`
- Transiciones suaves en todos los elementos interactivos

### Timeline de Vuelos
- Línea vertical con color primario
- Dots circulares en cada punto
- Información de duración entre segmentos
- Escalas destacadas con fondo azul claro

## Integración con el Módulo

El componente fue agregado al `FlightSearchModule`:

```typescript
@NgModule({
  declarations: [
    FlightSearchPage,
    FlightResultsPage,
    FiltersAsideComponent,
    FlightCardComponent  // ← Agregado
  ],
  // ...
})
export class FlightSearchModule {}
```

## Datos de Entrada

El componente recibe un objeto `FlightTicketEntity` con la siguiente estructura:

```typescript
interface FlightTicketEntity {
  flights: FlightGroupEntity[];      // Grupos de vuelos (ida/vuelta)
  maxStops: number;                  // Número máximo de escalas
  maxStopDuration: number;           // Duración máxima de escala
  price: number;                     // Precio base
  currency: string;                  // Moneda
  isDirect: boolean;                 // Si es vuelo directo
  mrPrice: PriceRangeEntity | null;  // Precio mascota regular
  aePrice: PriceRangeEntity;         // Precio apoyo emocional
  psPrice: PriceRangeEntity;         // Precio perro de servicio
  total: PriceRangeEntity;           // Precio total
}
```

## Estado Actual

✅ **Completado:**
- **Componentes separados:** flight-card-mobile y flight-card-desktop
- **Mobile:** Diseño compacto con acordeón (ya probado y funcionando)
- **Desktop:** Diseño horizontal con vuelos lado a lado + precios en columnas
- Mock data con vuelos de ida y vuelta con múltiples escalas (BOG→MIA→LIS→MAD)
- Textos i18n configurados (ES/EN)
- Declarados en FlightSearchModule
- Integrados en página de resultados con condicionales responsive
- Sin errores de compilación
- Listo para pruebas en navegador

### Características Desktop
- **Header cerrado:** 
  - Columna izquierda: Vuelos de ida y regreso con logo, horarios, duración visual, escalas
  - Separador vertical
  - Columna derecha: 3 cajas de precios (persona, mascota con badges, total)
  - Botón "Seleccionar" a la derecha
  - Icono de expansión
- **Header expandido:** Timeline detallado con todos los segmentos de vuelo, escalas, duraciones y aeropuertos

### Características Mobile
- **Header cerrado:** Vuelos apilados verticalmente con precios abajo
- **Header expandido:** Grid de precios con botón de selección

## Estructura de Datos

### FlightTicketEntity
```typescript
interface FlightTicketEntity {
  flights: FlightGroupEntity[];      // Grupos de vuelos (ida/vuelta)
  maxStops: number;                  // Número máximo de escalas
  price: number;                     // Precio base
  currency: string;                  // Moneda
  mrPrice: PriceRangeEntity | null;  // Precio mascota regular
  aePrice: PriceRangeEntity;         // Precio apoyo emocional
  psPrice: PriceRangeEntity;         // Precio perro de servicio
  total: PriceRangeEntity;           // Precio total
}
```

### Formato de Fechas
```typescript
// Formato ISO 8601 sin timezone
departureTime: "2025-01-15T07:45:00"
arrivalTime: "2025-01-15T12:30:00"

// Para vuelos que llegan al día siguiente
departureTime: "2025-01-15T16:30:00"
arrivalTime: "2025-01-16T05:50:00"  // Día siguiente
```

## Métodos de Formateo

- `formatTime()`: `"2025-01-15T07:45:00"` → `"07:45"`
- `formatDuration()`: `220` → `"3h 40min"`
- `formatPrice()`: `1430` → `"1.430"`
- `getArrivalDayOffset()`: Calcula días adicionales (`"+1"`, `"+2"`)
- `getLayoverDuration()`: Calcula duración de escalas
- `getTotalDuration()`: Suma duraciones de todos los segmentos

## Notas

- Usa `I18nService` para textos reactivos
- Precios con separadores de miles
- Horas en formato 24h (HH:mm)
- Detecta automáticamente vuelo de regreso
- Días adicionales como "+1", "+2"
