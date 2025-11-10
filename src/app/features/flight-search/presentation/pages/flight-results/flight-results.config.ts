import { I18nConfigEntity } from '@core/i18n/config';

export const FlightResultsConfig: I18nConfigEntity = {
  i18n: {
    title: 'flightResults.title',
    subtitle: 'flightResults.subtitle',
    modifySearch: 'flightResults.modifySearch',
    sortBy: 'flightResults.sortBy',
    priceLabel: 'flightResults.priceLabel',
    durationLabel: 'flightResults.durationLabel',
    departureLabel: 'flightResults.departureLabel',
    arrivalLabel: 'flightResults.arrivalLabel',
    airlineLabel: 'flightResults.airlineLabel',
    selectFlight: 'flightResults.selectFlight',
    withPet: 'flightResults.withPet',
    withoutPet: 'flightResults.withoutPet',
    petCertificate: 'flightResults.petCertificate',
    requestCertificate: 'flightResults.requestCertificate',
    noResults: 'flightResults.noResults',
    loading: 'flightResults.loading',
    stops: 'flightResults.stops',
    direct: 'flightResults.direct',
    oneStop: 'flightResults.oneStop'
  }
};

export interface ResolvedFlightResultsTexts {
  title: string;
  subtitle: string;
  modifySearch: string;
  sortBy: string;
  priceLabel: string;
  durationLabel: string;
  departureLabel: string;
  arrivalLabel: string;
  airlineLabel: string;
  selectFlight: string;
  withPet: string;
  withoutPet: string;
  petCertificate: string;
  requestCertificate: string;
  noResults: string;
  loading: string;
  stops: string;
  direct: string;
  oneStop: string;
}