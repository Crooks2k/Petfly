# Flight Card - Mapeo de Datos

## Verificación de Estructura de Datos

### ✅ Entidad: FlightTicketEntity

| Campo | Tipo | Usado en Componente | Descripción |
|-------|------|---------------------|-------------|
| `flights` | `FlightGroupEntity[]` | ✅ Sí | Array de grupos de vuelos (ida/vuelta) |
| `maxStops` | `number` | ✅ Sí | Número máximo de escalas - usado en `getStopsText()` |
| `maxStopDuration` | `number` | ❌ No | Duración máxima de escala - no se muestra actualmente |
| `price` | `number` | ✅ Sí | Precio por persona - mostrado en header |
| `currency` | `string` | ✅ Sí | Moneda - usado en formateo |
| `isDirect` | `boolean` | ❌ No | Si es vuelo directo - se calcula con maxStops |
| `mrPrice` | `PriceRangeEntity \| null` | ✅ Sí | Precio mascota regular - mostrado en columna de precios |
| `aePrice` | `PriceRangeEntity` | ✅ Sí | Precio apoyo emocional - mostrado en desglose |
| `psPrice` | `PriceRangeEntity` | ✅ Sí | Precio perro de servicio - mostrado en desglose |
| `total` | `PriceRangeEntity` | ✅ Sí | Precio total - mostrado en header |

### ✅ Entidad: FlightGroupEntity

| Campo | Tipo | Usado en Componente | Descripción |
|-------|------|---------------------|-------------|
| `flightItems` | `FlightItemEntity[]` | ✅ Sí | Array de segmentos de vuelo |

### ✅ Entidad: FlightItemEntity

| Campo | Tipo | Usado en Componente | Descripción |
|-------|------|---------------------|-------------|
| `airlineName` | `string` | ✅ Sí | Nombre de aerolínea - mostrado en timeline |
| `airlineCode` | `string` | ✅ Sí | Código de vuelo - mostrado en timeline |
| `arrivalTime` | `string` | ✅ Sí | Hora de llegada ISO - formateado con `formatTime()` |
| `arrival` | `string` | ✅ Sí | Código aeropuerto llegada - mostrado en header y timeline |
| `departure` | `string` | ✅ Sí | Código aeropuerto salida - mostrado en header y timeline |
| `departureTime` | `string` | ✅ Sí | Hora de salida ISO - formateado con `formatTime()` |
| `duration` | `number` | ✅ Sí | Duración en minutos - formateado con `formatDuration()` |
| `tripClass` | `string` | ❌ No | Clase de viaje - no se muestra actualmente |
| `imageUrl` | `string` | ✅ Sí | URL logo aerolínea - mostrado en header |

### ✅ Entidad: PriceRangeEntity

| Campo | Tipo | Usado en Componente | Descripción |
|-------|------|---------------------|-------------|
| `min` | `number` | ✅ Sí | Precio mínimo - mostrado en rangos |
| `max` | `number` | ✅ Sí | Precio máximo - mostrado en rangos |
| `currency` | `string` | ✅ Sí | Moneda - usado en formateo |

## Formato de Fechas

### ✅ Formato Correcto
```typescript
// Formato ISO 8601 sin timezone
departureTime: "2025-01-15T07:45:00"
arrivalTime: "2025-01-15T12:30:00"

// Para vuelos que llegan al día siguiente
departureTime: "2025-01-15T16:30:00"
arrivalTime: "2025-01-16T05:50:00"  // Día siguiente
```

### ❌ Formato Incorrecto (corregido)
```typescript
// NO usar +1 en el string
arrivalTime: "2025-01-15T05:50:00+1"  // ❌ INCORRECTO
```

## Mock Data Actualizado

### Vuelo de Ida: BOG → MIA → LIS → MAD
```typescript
{
  flightItems: [
    {
      // Segmento 1: BOG → MIA (mismo día)
      departureTime: "2025-01-15T07:45:00",
      arrivalTime: "2025-01-15T12:30:00",
      duration: 220, // 3h 40min
    },
    {
      // Segmento 2: MIA → LIS (llega día siguiente)
      departureTime: "2025-01-15T16:30:00",
      arrivalTime: "2025-01-16T05:50:00",
      duration: 500, // 8h 20min
    },
    {
      // Segmento 3: LIS → MAD (mismo día)
      departureTime: "2025-01-16T07:55:00",
      arrivalTime: "2025-01-16T10:15:00",
      duration: 80, // 1h 20min
    },
  ]
}
```

### Vuelo de Regreso: MAD → LIS → MIA → BOG
```typescript
{
  flightItems: [
    {
      // Segmento 1: MAD → LIS (mismo día)
      departureTime: "2025-01-22T07:40:00",
      arrivalTime: "2025-01-22T12:30:00",
      duration: 80, // 1h 20min
    },
    {
      // Segmento 2: LIS → MIA (mismo día)
      departureTime: "2025-01-22T14:35:00",
      arrivalTime: "2025-01-22T16:30:00",
      duration: 485, // 8h 05min
    },
    {
      // Segmento 3: MIA → BOG (mismo día)
      departureTime: "2025-01-22T18:50:00",
      arrivalTime: "2025-01-22T21:59:00",
      duration: 245, // 4h 05min
    },
  ]
}
```

## Métodos de Formateo

### ✅ formatTime(isoString: string): string
- **Input:** `"2025-01-15T07:45:00"`
- **Output:** `"07:45"`
- **Uso:** Mostrar horas en header y timeline

### ✅ formatDate(isoString: string): string
- **Input:** `"2025-01-15T07:45:00"`
- **Output:** `"15 de enero de 2025"`
- **Uso:** Título de timeline expandido

### ✅ formatDuration(minutes: number): string
- **Input:** `220`
- **Output:** `"3h 40min"`
- **Uso:** Mostrar duración de vuelos

### ✅ formatPrice(price: number): string
- **Input:** `1430`
- **Output:** `"1.430"`
- **Uso:** Formatear precios con separadores de miles

### ✅ getArrivalDayOffset(departureTime: string, arrivalTime: string): string
- **Input:** `"2025-01-15T16:30:00"`, `"2025-01-16T05:50:00"`
- **Output:** `"+1"`
- **Uso:** Mostrar cuando el vuelo llega al día siguiente

### ✅ getLayoverDuration(arrivalTime: string, departureTime: string): string
- **Input:** `"2025-01-15T12:30:00"`, `"2025-01-15T16:30:00"`
- **Output:** `"4h 0min"`
- **Uso:** Calcular duración de escalas

### ✅ getTotalDuration(flight: FlightGroupEntity): number
- **Input:** `FlightGroupEntity` con 3 segmentos
- **Output:** `800` (suma de duraciones)
- **Uso:** Calcular duración total del vuelo

### ✅ getStopsText(): string
- **Input:** `maxStops = 2`
- **Output:** `"2 escalas"`
- **Uso:** Mostrar número de escalas

### ✅ getStopsCodes(flight: FlightGroupEntity): string
- **Input:** `FlightGroupEntity` con escalas en MIA, LIS
- **Output:** `"MIA, LIS"`
- **Uso:** Mostrar códigos de aeropuertos de escalas

## Campos No Utilizados (Oportunidades de Mejora)

1. **maxStopDuration**: Podría mostrarse como "Escala máxima: 4h"
2. **isDirect**: Ya se calcula con `maxStops === 0`
3. **tripClass**: Podría mostrarse en el header ("Economy", "Business")

## Verificación de Datos Reales

Cuando se conecte con el API real, verificar que:

1. ✅ Las fechas vienen en formato ISO 8601: `YYYY-MM-DDTHH:mm:ss`
2. ✅ Los precios son números, no strings
3. ✅ Las duraciones están en minutos
4. ✅ Los códigos de aeropuerto son strings de 3 letras (IATA)
5. ✅ Las URLs de imágenes son válidas
6. ✅ Los arrays `flights` y `flightItems` no están vacíos
7. ✅ `mrPrice` puede ser `null` (algunos vuelos no aceptan mascotas regulares)

## Conclusión

✅ **Todos los campos necesarios del response están correctamente mapeados**
✅ **Las fechas ahora usan formato ISO válido**
✅ **Los componentes mobile y desktop usan la misma estructura de datos**
✅ **El mock data refleja correctamente la estructura del API**
