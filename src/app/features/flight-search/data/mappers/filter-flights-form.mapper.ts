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

    // Construir filterParameters si hay filtros aplicados
    const filterParameters: FilterFlightsRequestEntity['filterParameters'] = {};
    let hasFilters = false;

    // isDirect: si permitirEscalas es false, entonces isDirect es true
    if (formData.permitirEscalas !== null && formData.permitirEscalas !== undefined) {
      filterParameters.isDirect = !formData.permitirEscalas;
      hasFilters = true;
    }

    // Precios
    if (formData.precioMaximo !== null && formData.precioMaximo !== undefined) {
      filterParameters.maxPrice = formData.precioMaximo;
      hasFilters = true;
    }
    if (formData.precioMinimo !== null && formData.precioMinimo !== undefined) {
      filterParameters.minPrice = formData.precioMinimo;
      hasFilters = true;
    }

    // Aerolínea
    if (formData.aerolinea) {
      filterParameters.airlineCode = formData.aerolinea;
      hasFilters = true;
    }

    // Certificados: emotional -> AE, service -> PS
    if (formData.certificados && formData.certificados.length > 0) {
      const certMap: Record<string, string> = {
        emotional: 'AE', // Apoyo emocional
        service: 'PS', // Perro de servicio
      };
      filterParameters.certificateType =
        certMap[formData.certificados[0]] || formData.certificados[0];
      hasFilters = true;
    }

    // Construir el request completo con valores por defecto
    const filterRequest: FilterFlightsRequestEntity = {
      searchId,
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

    // Solo agregar filterParameters si hay filtros
    if (hasFilters) {
      filterRequest.filterParameters = filterParameters;
    }

    return filterRequest;
  }
}
