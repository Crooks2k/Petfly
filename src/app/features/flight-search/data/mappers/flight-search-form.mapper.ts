import { FlightSearchFormEntity } from '@flight-search/core/entities/flight-search-form.entity';
import { SearchFlightsRequestEntity } from '@flight-search/core/entities/search-flights-request.entity';
import { FLIGHT_SEARCH_CONSTANTS, TRIP_CLASS_MAP, PET_TYPE_MAP } from '@flight-search/core/constants';

export class FlightSearchFormMapper {
  static toApiRequest(
    formData: FlightSearchFormEntity,
    currency: string,
    locale: string
  ): SearchFlightsRequestEntity {
    const segments: SearchFlightsRequestEntity['segments'] = [];
    const origenCode = this.extractCityCode(formData.origen);
    const destinoCode = this.extractCityCode(formData.destino);

    if (formData.fechaSalida) {
      segments.push({
        origin: origenCode,
        origin_country: formData.origenCity?.countryCode || null,
        destination: destinoCode,
        destination_country: formData.destinoCity?.countryCode || null,
        date: this.formatDate(formData.fechaSalida),
      });
    }

    if (formData.tipoViaje === 'roundtrip' && formData.fechaRegreso) {
      segments.push({
        origin: destinoCode,
        origin_country: formData.destinoCity?.countryCode || null,
        destination: origenCode,
        destination_country: formData.origenCity?.countryCode || null,
        date: this.formatDate(formData.fechaRegreso),
      });
    }

    const { infants, children } = this.calculatePassengersByAge(formData.pasajeros.childrenAges || []);

    return {
      age: formData.edadMascota || 0,
      weight: this.formatWeight(formData.pesoMascota),
      breed: formData.razaMascota || '',
      currency,
      petType: PET_TYPE_MAP[formData.tipoMascota as string] || '',
      locale,
      tripClass: TRIP_CLASS_MAP[formData.pasajeros.travelClass] || FLIGHT_SEARCH_CONSTANTS.TRIP_CLASS.ECONOMY,
      passengers: {
        adults: formData.pasajeros.adults,
        children,
        infants,
      },
      segments,
    };
  }

  private static calculatePassengersByAge(childrenAges: number[]): { infants: number; children: number } {
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
    return Math.round(weight * FLIGHT_SEARCH_CONSTANTS.WEIGHT.DECIMAL_PRECISION) / FLIGHT_SEARCH_CONSTANTS.WEIGHT.DECIMAL_PRECISION;
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

  private static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(
      FLIGHT_SEARCH_CONSTANTS.DATE_FORMAT.PADDING_LENGTH, 
      FLIGHT_SEARCH_CONSTANTS.DATE_FORMAT.PADDING_CHAR
    );
    const day = String(date.getDate()).padStart(
      FLIGHT_SEARCH_CONSTANTS.DATE_FORMAT.PADDING_LENGTH, 
      FLIGHT_SEARCH_CONSTANTS.DATE_FORMAT.PADDING_CHAR
    );
    return `${year}-${month}-${day}`;
  }
}
