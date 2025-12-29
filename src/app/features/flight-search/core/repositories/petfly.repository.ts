import { Observable } from 'rxjs';
import {
  GetCitiesRequestEntity,
  GetCitiesResponseEntity,
  GetCurrenciesRequestEntity,
  GetCurrenciesResponseEntity,
  GetBreedsRequestEntity,
  GetBreedsResponseEntity,
  FlightSearchFormEntity,
  SearchFlightsResponseEntity,
  FilterFlightsResponseEntity,
} from '../entities';

export abstract class PetflyRepository {
  abstract getCities(request: GetCitiesRequestEntity): Observable<GetCitiesResponseEntity>;
  abstract getCurrencies(
    request: GetCurrenciesRequestEntity
  ): Observable<GetCurrenciesResponseEntity>;
  abstract getBreeds(request: GetBreedsRequestEntity): Observable<GetBreedsResponseEntity>;
  abstract searchFlights(
    formData: FlightSearchFormEntity,
    currency: string,
    locale: string,
    options?: { useDefaults?: boolean }
  ): Observable<SearchFlightsResponseEntity>;
  abstract filterFlights(
    formData: FlightSearchFormEntity,
    searchId: string,
    currency: string,
    locale: string,
    options?: { useDefaults?: boolean }
  ): Observable<FilterFlightsResponseEntity>;
}
