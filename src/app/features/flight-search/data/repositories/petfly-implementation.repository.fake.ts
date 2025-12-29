/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
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
import { getMockFlightTicket, mockCities, mockCurrencies, mockBreeds } from '@shared/mocks';

@Injectable()
export class PetflyImplementationRepositoryFake extends PetflyRepository {
  getCities(request: GetCitiesRequestEntity): Observable<GetCitiesResponseEntity> {
    const filteredCities = mockCities.filter(
      city =>
        city.cityName.toLowerCase().includes(request.query.toLowerCase()) ||
        city.cityCode.toLowerCase().includes(request.query.toLowerCase()) ||
        city.countryName.toLowerCase().includes(request.query.toLowerCase())
    );

    const limitedCities = filteredCities.slice(0, request.limit);

    return of(limitedCities).pipe(delay(800));
  }

  getCurrencies(_request: GetCurrenciesRequestEntity): Observable<GetCurrenciesResponseEntity> {
    return of(mockCurrencies).pipe(delay(600));
  }

  getBreeds(request: GetBreedsRequestEntity): Observable<GetBreedsResponseEntity> {
    const breeds = mockBreeds[request.petTypeId] || [];
    return of(breeds).pipe(delay(700));
  }

  searchFlights(
    formData: FlightSearchFormEntity,
    currency: string,
    locale: string,
    options?: { useDefaults?: boolean }
  ): Observable<SearchFlightsResponseEntity> {
    const request = FlightSearchFormMapper.toApiRequest(formData, currency, locale, options);

    if (!request.segments || request.segments.length === 0) {
      return of({
        flightTickets: [],
        filtersBoundary: {
          flightsDuration: { min: 0, max: 0 },
          stopsDuration: { min: 0, max: 0 },
          price: { min: 0, max: 0, currency: null },
          airlines: [],
        },
      }).pipe(delay(2000));
    }

    const mockFlights = [
      getMockFlightTicket(1),
      getMockFlightTicket(2),
      getMockFlightTicket(3),
      getMockFlightTicket(4),
      getMockFlightTicket(5),
    ];

    const mockResponse: SearchFlightsResponseEntity = {
      searchId: 'mock-search-id-' + Date.now(),
      flightTickets: mockFlights,
      filtersBoundary: {
        flightsDuration: { min: 50, max: 287 },
        stopsDuration: { min: 98, max: 156 },
        price: { min: 7167, max: 34925, currency: null },
        airlines: [
          { name: 'Avianca', iata: 'AV' },
          { name: 'LATAM Chile', iata: 'LA' },
          { name: 'Aerorepublica', iata: 'P5' },
          { name: 'JetSMART', iata: 'JA' },
          { name: 'TAP Air Portugal', iata: 'TP' },
        ],
      },
    };

    return of(mockResponse).pipe(delay(2000));
  }

  filterFlights(
    _formData: FlightSearchFormEntity,
    _searchId: string,
    _currency: string,
    _locale: string,
    _options?: { useDefaults?: boolean }
  ): Observable<FilterFlightsResponseEntity> {
    const mockFlights = [getMockFlightTicket(1), getMockFlightTicket(2), getMockFlightTicket(3)];

    const mockResponse: FilterFlightsResponseEntity = {
      flightTickets: mockFlights,
      filtersBoundary: {
        flightsDuration: { min: 50, max: 287 },
        stopsDuration: { min: 98, max: 156 },
        price: { min: 7167, max: 34925, currency: null },
        airlines: [
          { name: 'Avianca', iata: 'AV' },
          { name: 'LATAM Chile', iata: 'LA' },
          { name: 'TAP Air Portugal', iata: 'TP' },
        ],
      },
    };

    return of(mockResponse).pipe(delay(1500));
  }
}
