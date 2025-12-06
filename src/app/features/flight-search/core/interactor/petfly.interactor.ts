import { Injectable } from '@angular/core';
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
import { PetflyRepository } from '../repositories/petfly.repository';
import { GetCitiesUseCase } from '../usecases/get-cities.usecase';
import { GetCurrenciesUseCase } from '../usecases/get-currencies.usecase';
import { GetBreedsUseCase } from '../usecases/get-breeds.usecase';
import { SearchFlightsUseCase } from '../usecases/search-flights.usecase';

@Injectable()
export class PetflyInteractor {
  public getCitiesUseCase: GetCitiesUseCase;
  public getCurrenciesUseCase: GetCurrenciesUseCase;
  public getBreedsUseCase: GetBreedsUseCase;
  public searchFlightsUseCase: SearchFlightsUseCase;

  constructor(private readonly repository: PetflyRepository) {
    this.getCitiesUseCase = new GetCitiesUseCase(repository);
    this.getCurrenciesUseCase = new GetCurrenciesUseCase(repository);
    this.getBreedsUseCase = new GetBreedsUseCase(repository);
    this.searchFlightsUseCase = new SearchFlightsUseCase(repository);
  }

  public getCities(request: GetCitiesRequestEntity): Observable<GetCitiesResponseEntity> {
    return this.getCitiesUseCase.execute(request);
  }

  public getCurrencies(
    request: GetCurrenciesRequestEntity
  ): Observable<GetCurrenciesResponseEntity> {
    return this.getCurrenciesUseCase.execute(request);
  }

  public getBreeds(request: GetBreedsRequestEntity): Observable<GetBreedsResponseEntity> {
    return this.getBreedsUseCase.execute(request);
  }

  public searchFlights(
    formData: FlightSearchFormEntity,
    currency: string,
    locale: string
  ): Observable<SearchFlightsResponseEntity> {
    return this.searchFlightsUseCase.execute({ formData, currency, locale });
  }
}
