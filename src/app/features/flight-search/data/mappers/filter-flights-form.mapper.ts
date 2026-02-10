import { FlightSearchFormEntity } from '@flight-search/core/entities/flight-search-form.entity';
import {
  FilterFlightsRequestEntity,
  FilterFlightsParametersEntity,
  FilterFlightsDimensionsEntity,
  FilterFlightsPassengersEntity,
  FilterFlightsSegmentEntity,
} from '@flight-search/core/entities';
import { FlightSearchFormMapper, MapperOptions } from './flight-search-form.mapper';

const DEFAULT_CODE_ALL = 'all';

function defaultNumber(value: number | null | undefined): number {
  const n = Number(value);
  return value != null && !Number.isNaN(n) ? n : 0;
}

function defaultString(value: string | null | undefined): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  return s === '' ? null : s;
}

function defaultCode(value: string | null | undefined): string {
  const s = defaultString(value);
  return s ?? DEFAULT_CODE_ALL;
}

export class FilterFlightsFormMapper {
  static toApiRequest(
    formData: FlightSearchFormEntity,
    searchId: string,
    currency: string,
    locale: string,
    options: MapperOptions = {}
  ): FilterFlightsRequestEntity {
    const searchRequest = FlightSearchFormMapper.toApiRequest(formData, currency, locale, options);

    const dimensions: FilterFlightsDimensionsEntity = {
      length: defaultNumber(formData.length),
      width: defaultNumber(formData.width),
      height: defaultNumber(formData.height),
    };

    const filterParameters: FilterFlightsParametersEntity = {
      isDirect: formData.permitirEscalas === false,
      minPrice: defaultNumber(formData.precioMinimo),
      maxPrice: defaultNumber(formData.precioMaximo),
      dimensions,
      airlineCode: defaultCode(formData.aerolinea),
      certificateType: getCertificateType(formData),
      isCarrierRequired:
        typeof formData.isCarrierRequired === 'boolean' ? formData.isCarrierRequired : null,
    };

    const passengers: FilterFlightsPassengersEntity = {
      adults: defaultNumber(searchRequest.passengers?.adults),
      children: defaultNumber(searchRequest.passengers?.children),
      infants: defaultNumber(searchRequest.passengers?.infants),
    };

    const segments: FilterFlightsSegmentEntity[] = (searchRequest.segments ?? []).map(seg => ({
      origin: seg.origin,
      origin_country: seg.origin_country,
      destination: seg.destination,
      destination_country: seg.destination_country,
      date: seg.date,
    }));

    const request: FilterFlightsRequestEntity = {
      searchId,
      filterParameters,
      age: Math.min(24, defaultNumber(searchRequest.age)),
      weight: defaultNumber(searchRequest.weight),
      breed: defaultString(searchRequest.breed),
      currency: searchRequest.currency || 'COP',
      petType: searchRequest.petType || 'Dog',
      locale: defaultString(searchRequest.locale) ?? null,
      tripClass: searchRequest.tripClass || 'Y',
      passengers,
      segments,
    };

    return request;
  }
}

function getCertificateType(formData: FlightSearchFormEntity): string {
  const list = Array.isArray(formData.certificados) ? formData.certificados : [];
  if (list.length === 0) {
    return DEFAULT_CODE_ALL;
  }
  const certMap: Record<string, string> = {
    emotional: 'AE',
    service: 'PS',
  };
  const first = list[0];
  return certMap[first] ?? first;
}
