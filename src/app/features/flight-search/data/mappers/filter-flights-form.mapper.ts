import { FlightSearchFormEntity } from '@flight-search/core/entities/flight-search-form.entity';
import { FilterFlightsRequestEntity } from '@flight-search/core/entities/filter-flights-request.entity';
import { FlightSearchFormMapper, MapperOptions } from './flight-search-form.mapper';

export class FilterFlightsFormMapper {
  /**
   * Convierte los datos del formulario de filtros al formato requerido por el API de filtros
   * @param formData - Datos del formulario
   * @param searchId - ID de la búsqueda original
   * @param currency - Código de moneda
   * @param locale - Código de idioma
   * @param options - Opciones adicionales para el mapper
   */
  static toApiRequest(
    formData: FlightSearchFormEntity,
    searchId: string,
    currency: string,
    locale: string,
    options: MapperOptions = {}
  ): FilterFlightsRequestEntity {
    // Reutilizar el mapper de búsqueda para los datos base
    const searchRequest = FlightSearchFormMapper.toApiRequest(formData, currency, locale, options);

    // Construir filterParameters - SIEMPRE incluir con valores por defecto
    const filterParameters: FilterFlightsRequestEntity['filterParameters'] = {
      isDirect: formData.permitirEscalas === false, // Si permitirEscalas es false, isDirect es true
      minPrice: formData.precioMinimo ?? 0,
      maxPrice: formData.precioMaximo ?? 999999,
      airlineCode: formData.aerolinea || 'LA', // Por defecto LATAM (LA) si no hay aerolínea seleccionada
    };

    // Certificados: emotional -> AE, service -> PS
    if (formData.certificados && formData.certificados.length > 0) {
      const certMap: Record<string, string> = {
        emotional: 'AE', // Apoyo emocional
        service: 'PS', // Perro de servicio
      };
      filterParameters.certificateType =
        certMap[formData.certificados[0]] || formData.certificados[0];
    }

    // Construir el request completo con valores por defecto
    const filterRequest: FilterFlightsRequestEntity = {
      searchId,
      filterParameters, // SIEMPRE incluir
      age: searchRequest.age || 0,
      weight: searchRequest.weight || 0,
      breed: searchRequest.breed || '',
      currency: searchRequest.currency,
      petType: searchRequest.petType || 'Dog',
      locale: searchRequest.locale,
      tripClass: searchRequest.tripClass || 'Y',
      passengers: searchRequest.passengers || {
        adults: 1,
        children: 0,
        infants: 0,
      },
      segments: searchRequest.segments || [],
    };

    return filterRequest;
  }
}
