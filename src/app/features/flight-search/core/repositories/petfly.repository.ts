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
    locale: string
  ): Observable<SearchFlightsResponseEntity>;
}
