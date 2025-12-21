import { SearchFlightsRequestEntity } from './search-flights-request.entity';

export interface FilterFlightsRequestEntity extends SearchFlightsRequestEntity {
  searchId: string;
  filterParameters?: {
    isDirect?: boolean;
    maxPrice?: number;
    minPrice?: number;
    airlineCode?: string;
    certificateType?: string;
  };
}
