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
import { FilterFlightsFormMapper } from '@flight-search/data/mappers/filter-flights-form.mapper';

@Injectable()
export class PetflyImplementationRepositoryFake extends PetflyRepository {
  private mockCities: GetCitiesResponseEntity = [
    {
      cityName: 'Bogotá',
      cityCode: 'BOG',
      countryCode: 'CO',
      countryName: 'Colombia',
      displayName: 'Bogotá, Colombia (BOG)',
    },
    {
      cityName: 'Medellín',
      cityCode: 'MDE',
      countryCode: 'CO',
      countryName: 'Colombia',
      displayName: 'Medellín, Colombia (MDE)',
    },
    {
      cityName: 'Cali',
      cityCode: 'CLO',
      countryCode: 'CO',
      countryName: 'Colombia',
      displayName: 'Cali, Colombia (CLO)',
    },
    {
      cityName: 'Cartagena',
      cityCode: 'CTG',
      countryCode: 'CO',
      countryName: 'Colombia',
      displayName: 'Cartagena, Colombia (CTG)',
    },
    {
      cityName: 'Barranquilla',
      cityCode: 'BAQ',
      countryCode: 'CO',
      countryName: 'Colombia',
      displayName: 'Barranquilla, Colombia (BAQ)',
    },
    {
      cityName: 'Buenos Aires',
      cityCode: 'BUE',
      countryCode: 'AR',
      countryName: 'Argentina',
      displayName: 'Buenos Aires, Argentina (BUE)',
    },
    {
      cityName: 'Lima',
      cityCode: 'LIM',
      countryCode: 'PE',
      countryName: 'Perú',
      displayName: 'Lima, Perú (LIM)',
    },
    {
      cityName: 'Santiago',
      cityCode: 'SCL',
      countryCode: 'CL',
      countryName: 'Chile',
      displayName: 'Santiago, Chile (SCL)',
    },
    {
      cityName: 'Ciudad de México',
      cityCode: 'MEX',
      countryCode: 'MX',
      countryName: 'México',
      displayName: 'Ciudad de México, México (MEX)',
    },
    {
      cityName: 'Madrid',
      cityCode: 'MAD',
      countryCode: 'ES',
      countryName: 'España',
      displayName: 'Madrid, España (MAD)',
    },
  ];

  private mockCurrencies: GetCurrenciesResponseEntity = [
    { id: 1, name: 'United States Dollar', symbol: 'USD' },
    { id: 2, name: 'Euro', symbol: 'EUR' },
    { id: 3, name: 'Colombian Peso', symbol: 'COP' },
    { id: 4, name: 'Mexican Peso', symbol: 'MXN' },
    { id: 5, name: 'Brazilian Real', symbol: 'BRL' },
    { id: 6, name: 'Argentine Peso', symbol: 'ARS' },
    { id: 7, name: 'Peruvian Nuevo Sol', symbol: 'PEN' },
    { id: 8, name: 'Canadian Dollar', symbol: 'CAD' },
    { id: 9, name: 'Uruguayan Peso', symbol: 'UYU' },
    { id: 10, name: 'Costa Rican Colón', symbol: 'CRC' },
    { id: 11, name: 'Panamanian Balboa', symbol: 'PAB' },
    { id: 12, name: 'Russian Ruble', symbol: 'RUB' },
    { id: 13, name: 'Turkish Lira', symbol: 'TRY' },
    { id: 14, name: 'Chilean Peso', symbol: 'CLP' },
    { id: 15, name: 'Bolivian Boliviano', symbol: 'BOB' },
  ];

  private mockBreeds: { [petTypeId: number]: GetBreedsResponseEntity } = {
    1: [
      { name: 'Labrador Retriever', petTypeId: 1 },
      { name: 'Golden Retriever', petTypeId: 1 },
      { name: 'Pastor Alemán', petTypeId: 1 },
      { name: 'Bulldog Francés', petTypeId: 1 },
      { name: 'Beagle', petTypeId: 1 },
      { name: 'Poodle', petTypeId: 1 },
      { name: 'Chihuahua', petTypeId: 1 },
      { name: 'Husky Siberiano', petTypeId: 1 },
    ],
    2: [
      { name: 'Persa', petTypeId: 2 },
      { name: 'Siamés', petTypeId: 2 },
      { name: 'Maine Coon', petTypeId: 2 },
      { name: 'Bengalí', petTypeId: 2 },
      { name: 'Ragdoll', petTypeId: 2 },
      { name: 'British Shorthair', petTypeId: 2 },
    ],
  };

  getCities(request: GetCitiesRequestEntity): Observable<GetCitiesResponseEntity> {
    const filteredCities = this.mockCities.filter(
      city =>
        city.cityName.toLowerCase().includes(request.query.toLowerCase()) ||
        city.cityCode.toLowerCase().includes(request.query.toLowerCase()) ||
        city.countryName.toLowerCase().includes(request.query.toLowerCase())
    );

    const limitedCities = filteredCities.slice(0, request.limit);

    return of(limitedCities).pipe(delay(800));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCurrencies(_request: GetCurrenciesRequestEntity): Observable<GetCurrenciesResponseEntity> {
    return of(this.mockCurrencies).pipe(delay(600));
  }

  getBreeds(request: GetBreedsRequestEntity): Observable<GetBreedsResponseEntity> {
    const breeds = this.mockBreeds[request.petTypeId] || [];
    return of(breeds).pipe(delay(700));
  }

  searchFlights(
    formData: FlightSearchFormEntity,
    currency: string,
    locale: string,
    options?: { useDefaults?: boolean }
  ): Observable<SearchFlightsResponseEntity> {
    console.log('🎭 FAKE Repository - searchFlights llamado');
    console.log('  📋 formData:', formData);
    console.log('  💰 currency:', currency);
    console.log('  🌍 locale:', locale);
    console.log('  ⚙️ options:', options);

    const request = FlightSearchFormMapper.toApiRequest(formData, currency, locale, options);

    console.log('  🔄 Request mapeado:', request);
    console.log('  ✈️ Segments:', request.segments);

    // Validar que haya al menos un segmento
    if (!request.segments || request.segments.length === 0) {
      console.error('❌ No hay segmentos en el request');
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

    const mockResponse: SearchFlightsResponseEntity = {
      searchId: 'mock-search-id-' + Date.now(),
      flightTickets: [
        {
          flights: [
            {
              flightItems: [
                {
                  airlineName: 'Avianca',
                  airlineCode: 'AV',
                  arrivalTime: `${request.segments[0].date}T23:15:00`,
                  arrival: request.segments[0].destination,
                  departure: request.segments[0].origin,
                  departureTime: `${request.segments[0].date}T22:00:00`,
                  duration: 75,
                  tripClass: request.tripClass,
                  imageUrl: 'http://img.wway.io/pics/root/AV@png?exar=1&rs=fit:200:200',
                },
              ],
            },
            ...(request.segments.length > 1
              ? [
                {
                  flightItems: [
                    {
                      airlineName: 'Avianca',
                      airlineCode: 'AV',
                      arrivalTime: `${request.segments[1].date}T23:10:00`,
                      arrival: request.segments[1].destination,
                      departure: request.segments[1].origin,
                      departureTime: `${request.segments[1].date}T22:15:00`,
                      duration: 55,
                      tripClass: request.tripClass,
                      imageUrl: 'http://img.wway.io/pics/root/AV@png?exar=1&rs=fit:200:200',
                    },
                  ],
                },
              ]
              : []),
          ],
          maxStops: 0,
          maxStopDuration: 0,
          price: 361569.41,
          currency: request.currency,
          isDirect: true,
          mrPrice: null,
          aePrice: { min: 0, max: 0, currency: request.currency },
          psPrice: { min: 0, max: 0, currency: request.currency },
          total: { min: 361569.41, max: 361569.41, currency: request.currency },
        },
        {
          flights: [
            {
              flightItems: [
                {
                  airlineName: 'LATAM Chile',
                  airlineCode: 'LA',
                  arrivalTime: `${request.segments[0].date}T14:30:00`,
                  arrival: request.segments[0].destination,
                  departure: request.segments[0].origin,
                  departureTime: `${request.segments[0].date}T13:15:00`,
                  duration: 75,
                  tripClass: request.tripClass,
                  imageUrl: 'http://img.wway.io/pics/root/LA@png?exar=1&rs=fit:200:200',
                },
              ],
            },
            ...(request.segments.length > 1
              ? [
                {
                  flightItems: [
                    {
                      airlineName: 'LATAM Chile',
                      airlineCode: 'LA',
                      arrivalTime: `${request.segments[1].date}T16:45:00`,
                      arrival: request.segments[1].destination,
                      departure: request.segments[1].origin,
                      departureTime: `${request.segments[1].date}T15:30:00`,
                      duration: 75,
                      tripClass: request.tripClass,
                      imageUrl: 'http://img.wway.io/pics/root/LA@png?exar=1&rs=fit:200:200',
                    },
                  ],
                },
              ]
              : []),
          ],
          maxStops: 0,
          maxStopDuration: 0,
          price: 425000,
          currency: request.currency,
          isDirect: true,
          mrPrice: null,
          aePrice: { min: 0, max: 0, currency: request.currency },
          psPrice: { min: 0, max: 0, currency: request.currency },
          total: { min: 425000, max: 425000, currency: request.currency },
        },
      ],
      filtersBoundary: {
        flightsDuration: { min: 50, max: 287 },
        stopsDuration: { min: 98, max: 156 },
        price: { min: 7167, max: 34925, currency: null },
        airlines: [
          { name: 'Avianca', iata: 'AV' },
          { name: 'LATAM Chile', iata: 'LA' },
          { name: 'Aerorepublica', iata: 'P5' },
          { name: 'JetSMART', iata: 'JA' },
        ],
      },
    };

    console.log('  ✅ Mock response generado:', mockResponse);
    console.log('  📊 Total de vuelos en mock:', mockResponse.flightTickets.length);

    return of(mockResponse).pipe(delay(2000));
  }

  filterFlights(
    formData: FlightSearchFormEntity,
    searchId: string,
    currency: string,
    locale: string,
    options?: { useDefaults?: boolean }
  ): Observable<FilterFlightsResponseEntity> {
    console.log('🎭 FAKE Repository - filterFlights llamado');
    console.log('  🔍 searchId:', searchId);
    console.log('  �  formData:', formData);
    console.log('  �  currency:', currency);
    console.log('  🌍 locale:', locale);
    console.log('  ⚙️ options:', options);

    const filterRequest = FilterFlightsFormMapper.toApiRequest(
      formData,
      searchId,
      currency,
      locale,
      options
    );

    console.log(
      '  🔄 Filter request mapeado (body completo):',
      JSON.stringify(filterRequest, null, 2)
    );

    // Simular filtrado de resultados
    const mockResponse: FilterFlightsResponseEntity = {
      flightTickets: [
        {
          flights: [
            {
              flightItems: [
                {
                  airlineName: 'Avianca',
                  airlineCode: 'AV',
                  arrivalTime: `${filterRequest.segments[0].date}T23:15:00`,
                  arrival: filterRequest.segments[0].destination,
                  departure: filterRequest.segments[0].origin,
                  departureTime: `${filterRequest.segments[0].date}T22:00:00`,
                  duration: 75,
                  tripClass: filterRequest.tripClass,
                  imageUrl: 'http://img.wway.io/pics/root/AV@png?exar=1&rs=fit:200:200',
                },
              ],
            },
            ...(filterRequest.segments.length > 1
              ? [
                {
                  flightItems: [
                    {
                      airlineName: 'Avianca',
                      airlineCode: 'AV',
                      arrivalTime: `${filterRequest.segments[1].date}T23:10:00`,
                      arrival: filterRequest.segments[1].destination,
                      departure: filterRequest.segments[1].origin,
                      departureTime: `${filterRequest.segments[1].date}T22:15:00`,
                      duration: 55,
                      tripClass: filterRequest.tripClass,
                      imageUrl: 'http://img.wway.io/pics/root/AV@png?exar=1&rs=fit:200:200',
                    },
                  ],
                },
              ]
              : []),
          ],
          maxStops: 0,
          maxStopDuration: 0,
          price: 361569.41,
          currency: filterRequest.currency,
          isDirect: true,
          mrPrice: null,
          aePrice: { min: 0, max: 0, currency: filterRequest.currency },
          psPrice: { min: 0, max: 0, currency: filterRequest.currency },
          total: { min: 361569.41, max: 361569.41, currency: filterRequest.currency },
        },
      ],
      filtersBoundary: {
        flightsDuration: { min: 50, max: 287 },
        stopsDuration: { min: 98, max: 156 },
        price: { min: 7167, max: 34925, currency: null },
        airlines: [
          { name: 'Avianca', iata: 'AV' },
          { name: 'LATAM Chile', iata: 'LA' },
        ],
      },
    };

    console.log('  ✅ Mock filter response generado:', mockResponse);
    console.log('  📊 Total de vuelos filtrados:', mockResponse.flightTickets.length);

    return of(mockResponse).pipe(delay(1500));
  }
}
