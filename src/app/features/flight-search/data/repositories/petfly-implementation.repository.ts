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
} from '@flight-search/core/entities';
import { PetflyRepository } from '@flight-search/core/repositories/petfly.repository';
import { FlightSearchFormMapper } from '@flight-search/data/mappers/flight-search-form.mapper';
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

  getCurrencies(request: GetCurrenciesRequestEntity): Observable<GetCurrenciesResponseEntity> {
    return this.http.get<GetCurrenciesResponseEntity>(`${this.apiUrl}currencies`);
  }

  getBreeds(request: GetBreedsRequestEntity): Observable<GetBreedsResponseEntity> {
    const params = new HttpParams().set('petTypeId', request.petTypeId.toString());

    return this.http.get<GetBreedsResponseEntity>(`${this.apiUrl}breeds`, { params });
  }

  searchFlights(
    formData: FlightSearchFormEntity,
    currency: string,
    locale: string
  ): Observable<SearchFlightsResponseEntity> {
    const request = FlightSearchFormMapper.toApiRequest(formData, currency, locale);
    return this.http.post<SearchFlightsResponseEntity>(`${this.apiUrl}search`, request);
  }
}
