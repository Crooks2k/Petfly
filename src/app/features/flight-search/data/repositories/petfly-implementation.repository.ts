import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
} from '@flight-search/core/entities';
import { PetflyRepository } from '@flight-search/core/repositories/petfly.repository';
import { FlightSearchFormMapper } from '@flight-search/data/mappers/flight-search-form.mapper';
import { FilterFlightsFormMapper } from '@flight-search/data/mappers/filter-flights-form.mapper';
import { environment } from '@environments/environment';

@Injectable()
export class PetflyImplementationRepository extends PetflyRepository {
  private readonly apiUrl = environment.API_SERVICES.API_URL;

  constructor(private readonly http: HttpClient) {
    super();
  }

  getCities(request: GetCitiesRequestEntity): Observable<GetCitiesResponseEntity> {
    const params = new HttpParams()
      .set('query', request.query)
      .set('limit', request.limit.toString());

    return this.http.get<GetCitiesResponseEntity>(`${this.apiUrl}cities`, { params });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCurrencies(_request: GetCurrenciesRequestEntity): Observable<GetCurrenciesResponseEntity> {
    return this.http.get<GetCurrenciesResponseEntity>(`${this.apiUrl}currencies`);
  }

  getBreeds(request: GetBreedsRequestEntity): Observable<GetBreedsResponseEntity> {
    const params = new HttpParams().set('petTypeId', request.petTypeId.toString());

    return this.http.get<GetBreedsResponseEntity>(`${this.apiUrl}breeds`, { params });
  }

  searchFlights(
    formData: FlightSearchFormEntity,
    currency: string,
    locale: string,
    options?: { useDefaults?: boolean }
  ): Observable<SearchFlightsResponseEntity> {
    const request = FlightSearchFormMapper.toApiRequest(formData, currency, locale, options);
    return this.http.post<SearchFlightsResponseEntity>(`${this.apiUrl}search`, request);
  }

  filterFlights(
    formData: FlightSearchFormEntity,
    searchId: string,
    currency: string,
    locale: string,
    options?: { useDefaults?: boolean }
  ): Observable<FilterFlightsResponseEntity> {
    const filterRequest = FilterFlightsFormMapper.toApiRequest(
      formData,
      searchId,
      currency,
      locale,
      options
    );

    return this.http.post<FilterFlightsResponseEntity>(`${this.apiUrl}filter`, filterRequest);
  }
}
