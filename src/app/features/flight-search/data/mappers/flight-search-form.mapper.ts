import { FlightSearchFormEntity } from '@flight-search/core/entities/flight-search-form.entity';
import { SearchFlightsRequestEntity } from '@flight-search/core/entities/search-flights-request.entity';

export class FlightSearchFormMapper {
  /**
   * Mapea los datos del formulario al request del API
   * Este mapper se usa en la capa de datos antes de enviar la petición al backend
   */
  static toApiRequest(
    formData: FlightSearchFormEntity,
    currency: string,
    locale: string
  ): SearchFlightsRequestEntity {
    // Mapear tripClass: economy -> Y, business -> C
    const tripClassMap: Record<string, string> = {
      economy: 'Y',
      business: 'C',
    };

    // Mapear petType: dog -> Dog, cat -> Cat
    const petTypeMap: Record<string, string> = {
      dog: 'Dog',
      cat: 'Cat',
    };

    // Crear segments basado en el tipo de viaje
    const segments: SearchFlightsRequestEntity['segments'] = [];

    // Extraer códigos de ciudad (manejar tanto string como objeto)
    const origenCode = this.extractCityCode(formData.origen);
    const destinoCode = this.extractCityCode(formData.destino);

    // Segment de ida
    if (formData.fechaSalida) {
      segments.push({
        origin: origenCode,
        origin_country: formData.origenCity?.countryCode || null,
        destination: destinoCode,
        destination_country: formData.destinoCity?.countryCode || null,
        date: this.formatDate(formData.fechaSalida),
      });
    }

    // Segment de vuelta (si es roundtrip)
    if (formData.tipoViaje === 'roundtrip' && formData.fechaRegreso) {
      segments.push({
        origin: destinoCode,
        origin_country: formData.destinoCity?.countryCode || null,
        destination: origenCode,
        destination_country: formData.origenCity?.countryCode || null,
        date: this.formatDate(formData.fechaRegreso),
      });
    }

    // Calcular infants y children basado en las edades
    const childrenAges = formData.pasajeros.childrenAges || [];
    let infants = 0;
    let children = 0;

    childrenAges.forEach(age => {
      if (age <= 2) {
        infants++;
      } else {
        children++;
      }
    });

    return {
      age: formData.edadMascota || 0,
      weight: this.formatWeight(formData.pesoMascota),
      breed: formData.razaMascota || '',
      currency: currency,
      petType: petTypeMap[formData.tipoMascota as string] || '',
      locale: locale,
      tripClass: tripClassMap[formData.pasajeros.travelClass] || 'Y',
      passengers: {
        adults: formData.pasajeros.adults,
        children: children,
        infants: infants,
      },
      segments: segments,
    };
  }

  /**
   * Formatea el peso para asegurar que tenga al menos un decimal
   * Ejemplos: 10 -> 10.0, 10.5 -> 10.5, 10.25 -> 10.25
   */
  private static formatWeight(weight: number | null | undefined): number {
    if (!weight) return 0;
    return Math.round(weight * 10) / 10;
  }

  /**
   * Extrae el código de ciudad, manejando tanto string como objeto
   */
  private static extractCityCode(cityValue: any): string {
    if (typeof cityValue === 'string') {
      return cityValue;
    }
    if (cityValue && typeof cityValue === 'object' && 'value' in cityValue) {
      return cityValue.value;
    }
    return '';
  }

  /**
   * Formatea una fecha a string YYYY-MM-DD
   */
  private static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
