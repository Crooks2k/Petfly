export interface SearchFlightsResponseEntity {
  searchId?: string;
  flightTickets: FlightTicketEntity[];
  filtersBoundary: FiltersBoundaryEntity;
}

export interface FlightTicketEntity {
  flights: FlightGroupEntity[];
  maxStops: number;
  maxStopDuration: number;
  price: number;
  currency: string;
  isDirect: boolean;
  mrPrice: PriceRangeEntity | null;
  aePrice: PriceRangeEntity | null;
  psPrice: PriceRangeEntity | null;
  totalPetPrice: PriceRangeEntity | null;
  total: PriceRangeEntity;
}

export interface FlightGroupEntity {
  flightItems: FlightItemEntity[];
}

export interface FlightItemEntity {
  airlineName: string;
  airlineCode: string;
  arrivalTime: string;
  arrival: string;
  departure: string;
  departureTime: string;
  duration: number;
  tripClass: string;
  imageUrl: string;
  agencyLink: string;
}

export interface PriceRangeEntity {
  min: number;
  max: number;
  currency: string;
}

export interface FiltersBoundaryEntity {
  flightsDuration: DurationRangeEntity;
  stopsDuration: DurationRangeEntity;
  price: PriceFilterEntity;
  airlines: AirlineEntity[];
}

export interface DurationRangeEntity {
  min: number;
  max: number;
}

export interface PriceFilterEntity {
  min: number;
  max: number;
  currency: string | null;
}

export interface AirlineEntity {
  name: string;
  iata: string;
}
