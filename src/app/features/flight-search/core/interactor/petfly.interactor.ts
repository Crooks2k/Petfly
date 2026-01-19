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
  FilterFlightsResponseEntity,
  BookingLinkEntity,
} from '../entities';
import { PetflyRepository } from '../repositories/petfly.repository';
import { BookingLinkRepository } from '../repositories/booking-link.repository';
import { GetCitiesUseCase } from '../usecases/get-cities.usecase';
import { GetCurrenciesUseCase } from '../usecases/get-currencies.usecase';
import { GetBreedsUseCase } from '../usecases/get-breeds.usecase';
import { SearchFlightsUseCase } from '../usecases/search-flights.usecase';
import { FilterFlightsUseCase } from '../usecases/filter-flights.usecase';
import { GetBookingLinkUseCase } from '../usecases/get-booking-link.usecase';

@Injectable()
export class PetflyInteractor {
  public getCitiesUseCase: GetCitiesUseCase;
  public getCurrenciesUseCase: GetCurrenciesUseCase;
  public getBreedsUseCase: GetBreedsUseCase;
  public searchFlightsUseCase: SearchFlightsUseCase;
  public filterFlightsUseCase: FilterFlightsUseCase;
  public getBookingLinkUseCase: GetBookingLinkUseCase;

  constructor(
    private readonly repository: PetflyRepository,
    private readonly bookingLinkRepository: BookingLinkRepository
  ) {
    this.getCitiesUseCase = new GetCitiesUseCase(repository);
    this.getCurrenciesUseCase = new GetCurrenciesUseCase(repository);
    this.getBreedsUseCase = new GetBreedsUseCase(repository);
    this.searchFlightsUseCase = new SearchFlightsUseCase(repository);
    this.filterFlightsUseCase = new FilterFlightsUseCase(repository);
    this.getBookingLinkUseCase = new GetBookingLinkUseCase(bookingLinkRepository);
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
    locale: string,
    options?: { useDefaults?: boolean }
  ): Observable<SearchFlightsResponseEntity> {
    return this.searchFlightsUseCase.execute({ formData, currency, locale, options });
  }

  public filterFlights(
    formData: FlightSearchFormEntity,
    searchId: string,
    currency: string,
    locale: string,
    options?: { useDefaults?: boolean }
  ): Observable<FilterFlightsResponseEntity> {
    return this.filterFlightsUseCase.execute({ formData, searchId, currency, locale, options });
  }

  public getBookingLink(searchId: string, termsUrl: string): Observable<BookingLinkEntity> {
    return this.getBookingLinkUseCase.execute(searchId, termsUrl);
  }
}
