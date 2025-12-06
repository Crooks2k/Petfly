export interface SearchFlightsRequestEntity {
  age: number;
  weight: number;
  breed: string;
  currency: string;
  petType: string;
  locale: string | null;
  tripClass: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  segments: Array<{
    origin: string;
    origin_country: string | null;
    destination: string;
    destination_country: string | null;
    date: string;
  }>;
}
