import { FlightSearchFormEntity } from '@flight-search/core/entities/flight-search-form.entity';
import { SearchFlightsRequestEntity } from '@flight-search/core/entities/search-flights-request.entity';
import {
  FLIGHT_SEARCH_CONSTANTS,
  TRIP_CLASS_MAP,
  PET_TYPE_MAP,
} from '@flight-search/core/constants';

export interface MapperOptions {
  useDefaults?: boolean; // Si true, usa valores por defecto para campos null/undefined
  defaultOrigin?: string;
  defaultDestination?: string;
  defaultDepartureDate?: Date;
}

export class FlightSearchFormMapper {
  /**
   * Convierte los datos del formulario al formato requerido por el API
   * @param formData - Datos del formulario
   * @param currency - Código de moneda (ej: 'COP', 'USD')
   * @param locale - Código de idioma (ej: 'es', 'en')
   * @param options - Opciones adicionales para el mapper
   */
  static toApiRequest(
    formData: FlightSearchFormEntity,
    currency: string,
    locale: string,
    options: MapperOptions = {}
  ): SearchFlightsRequestEntity {
    const useDefaults = options.useDefaults ?? false;

    // Extraer códigos de ciudad con fallbacks
    const origenCode =
      this.extractCityCode(formData.origen) || (useDefaults ? options.defaultOrigin || 'BOG' : '');
    const destinoCode =
      this.extractCityCode(formData.destino) ||
      (useDefaults ? options.defaultDestination || 'MDE' : '');

    // Construir segmentos con valores por defecto si es necesario
    const segments: SearchFlightsRequestEntity['segments'] = [];
    const fechaSalida =
      formData.fechaSalida || (useDefaults ? options.defaultDepartureDate || new Date() : null);

    if (fechaSalida) {
      segments.push({
        origin: origenCode,
        origin_country: formData.origenCity?.countryCode || null,
        destination: destinoCode,
        destination_country: formData.destinoCity?.countryCode || null,
        date: this.formatDate(fechaSalida),
      });
    }

    // Agregar segmento de regreso si es roundtrip
    if (formData.tipoViaje === 'roundtrip' && formData.fechaRegreso) {
      segments.push({
        origin: destinoCode,
        origin_country: formData.destinoCity?.countryCode || null,
        destination: origenCode,
        destination_country: formData.origenCity?.countryCode || null,
        date: this.formatDate(formData.fechaRegreso),
      });
    }

    // Calcular pasajeros con valores por defecto
    const pasajeros = formData.pasajeros || {
      adults: 1,
      children: 0,
      childrenAges: [],
      travelClass: 'economy',
    };
    const { infants, children } = this.calculatePassengersByAge(pasajeros.childrenAges || []);

    // Construir request con valores por defecto inteligentes
    return {
      age: this.getDefaultValue(formData.edadMascota, 24, useDefaults), // Default: 24 semanas (adulto)
      weight: this.formatWeight(formData.pesoMascota) || (useDefaults ? 5 : 0), // Default: 5kg
      breed: formData.razaMascota || (useDefaults ? 'Mixed' : ''), // Default: Mixed breed
      currency: currency || 'COP',
      petType: PET_TYPE_MAP[formData.tipoMascota as string] || (useDefaults ? 'Dog' : ''), // Default: Dog
      locale: locale || 'es',
      tripClass:
        TRIP_CLASS_MAP[pasajeros.travelClass] || FLIGHT_SEARCH_CONSTANTS.TRIP_CLASS.ECONOMY,
      passengers: {
        adults: pasajeros.adults || 1,
        children: children || 0,
        infants: infants || 0,
      },
      segments,
    };
  }

  /**
   * Obtiene un valor con fallback a default si useDefaults es true
   */
  private static getDefaultValue<T>(
    value: T | null | undefined,
    defaultValue: T,
    useDefaults: boolean
  ): T {
    if (value !== null && value !== undefined) {
      return value;
    }
    return useDefaults ? defaultValue : (0 as T);
  }

  private static calculatePassengersByAge(childrenAges: number[]): {
    infants: number;
    children: number;
  } {
    let infants = 0;
    let children = 0;

    childrenAges.forEach(age => {
      if (age <= FLIGHT_SEARCH_CONSTANTS.AGE.INFANT_MAX) {
        infants++;
      } else {
        children++;
      }
    });

    return { infants, children };
  }

  private static formatWeight(weight: number | null | undefined): number {
    if (!weight) return 0;
    return (
      Math.round(weight * FLIGHT_SEARCH_CONSTANTS.WEIGHT.DECIMAL_PRECISION) /
      FLIGHT_SEARCH_CONSTANTS.WEIGHT.DECIMAL_PRECISION
    );
  }

  private static extractCityCode(cityValue: unknown): string {
    if (typeof cityValue === 'string') {
      return cityValue;
    }
    if (cityValue && typeof cityValue === 'object' && 'value' in cityValue) {
      return (cityValue as Record<string, unknown>)['value'] as string;
    }
    return '';
  }

  private static formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(
      FLIGHT_SEARCH_CONSTANTS.DATE_FORMAT.PADDING_LENGTH,
      FLIGHT_SEARCH_CONSTANTS.DATE_FORMAT.PADDING_CHAR
    );
    const day = String(dateObj.getDate()).padStart(
      FLIGHT_SEARCH_CONSTANTS.DATE_FORMAT.PADDING_LENGTH,
      FLIGHT_SEARCH_CONSTANTS.DATE_FORMAT.PADDING_CHAR
    );
    return `${year}-${month}-${day}`;
  }
}
