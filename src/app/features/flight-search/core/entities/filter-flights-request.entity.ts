import { FilterFlightsParametersEntity } from './filter-flights-parameters.entity';

export interface FilterFlightsSegmentEntity {
  origin: string;
  origin_country: string;
  destination: string;
  destination_country: string;
  date: string;
}

export interface FilterFlightsPassengersEntity {
  adults: number;
  children: number;
  infants: number;
}

export interface FilterFlightsRequestEntity {
  searchId: string;
  filterParameters: FilterFlightsParametersEntity;
  age: number;
  weight: number;
  breed: string | null;
  currency: string;
  petType: string;
  locale: string | null;
  tripClass: string;
  passengers: FilterFlightsPassengersEntity;
  segments: FilterFlightsSegmentEntity[];
}
